import { findUserById, getPricingsForProduct, getProduct } from './database.js'
import { stripeAPI } from './stripe.js'

export const createCheckoutSession = async (req, res) => {
    // Get the domain URL from environment variables
    const domainUrl = process.env.WEB_APP_URL

    // Extract the checkout cart and user document from the request body
    const { checkoutCart, userDoc } = req.body

    // Check if both userDoc and checkoutCart are provided
    if (!userDoc || !checkoutCart) {
        return res.status(200).json({ error: 'Missing required session parameters' })
    }

    // Retrieve user information based on userDoc.id
    const userInfo = await findUserById(userDoc.id)
    const email = userInfo.email

    // Initialize an empty array to hold formatted cart items
    let userCartFinal = []

    // Loop through each item in the checkoutCart
    for (let i = 0; i < checkoutCart.length; i++) {
        // Create a template for the item to be sent to Stripe
        const formattedItem = {
            quantity: 0,
            price_data: {
                currency: 'usd',
                unit_amount: 0, // Price in cents
                product_data: {
                    name: '',
                    description: '',
                    images: []
                }
            },
        }

        // Fetch product information based on productId from the checkoutCart
        const productInfo = await getProduct(checkoutCart[i].productId)
        // Fetch pricing information for the product
        const productPricing = await getPricingsForProduct(checkoutCart[i].productId)

        // Function to determine the unit price based on quantity and pricing ranges
        const getUnitPrice = (cartItem) => {
            // Sort pricing data in descending order based on minimum quantity
            const sortedPricing = [...productPricing].sort((a, b) => b.min - a.min)
            // Loop through sorted pricing data to find the applicable price
            for (let i = 0; i < sortedPricing.length; i++) {
                const { min, max } = sortedPricing[i];
                const productCount = cartItem.count;
                // Check if the product count falls within the pricing range
                const isWithinRange = (min <= productCount) && ((max >= productCount) || max === null || max === 0);
                if (isWithinRange) {
                    return sortedPricing[i].price
                }
            }
        }

        // Set the quantity of the item
        formattedItem.quantity = checkoutCart[i].count
        // Set product details for the item
        formattedItem.price_data.product_data.name = productInfo.name
        formattedItem.price_data.product_data.description = productInfo.description
        formattedItem.price_data.product_data.images = [checkoutCart[i].stripeImgThumbnail]
        // Set the unit amount (price) for the item in cents
        formattedItem.price_data.unit_amount = await getUnitPrice(checkoutCart[i]) * 100
        // Add the formatted item to the final cart array
        userCartFinal.push(formattedItem)
    }

    let session

    try {
        // Create a Stripe Checkout session with the formatted cart items
        session = await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'], // Accepts card payments
            mode: 'payment', // Payment mode for one-time purchases
            line_items: userCartFinal, // Array of items to be purchased
            customer_email: email, // Email address of the customer
            success_url: `${domainUrl}/cart/checkout/success/{CHECKOUT_SESSION_ID}`, // URL to redirect to on successful payment
            cancel_url: `${domainUrl}/cart`, // URL to redirect to if the payment is cancelled
            shipping_address_collection: { allowed_countries: ['US'] }, // Collect shipping address, restricted to the US
            automatic_tax: { enabled: true } // Enable automatic tax calculation
        })
        // Respond with the Stripe session ID
        res.status(200).json({ sessionID: session.id })
    } catch (err) {
        // Log and respond with an error if session creation fails
        console.log(err)
        res.status(400).json({ error: 'An error occurred, unable to create session' })
    }
}
