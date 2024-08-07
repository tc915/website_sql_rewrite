import { findUserById, getPricingsForProduct, getProduct } from './database.js'
import { stripeAPI } from './stripe.js'

export const createCheckoutSession = async (req, res) => {
    const domainUrl = process.env.WEB_APP_URL
    const { checkoutCart, userDoc } = req.body

    if (!userDoc || !userCart) {
        return res.status(200).json({ error: 'Missing required session parameters' })
    }

    const userInfo = findUserById(userDoc.id)
    const email = userInfo.email

    let userCartFinal = []

    for (let i = 0; i < checkoutCart.length; i++) {
        const formattedItem = {
            quantity: 0,
            price_data: {
                currency: 'usd',
                unit_amount: 0, // in cents
                product_data: {
                    name: '',
                    description: '',
                    images: []
                }
            },
        }

        const productInfo = getProduct(checkoutCart[i].productId)
        console.log(productInfo)

        const getUnitPrice = (cartItem) => {
            const productPricing = getPricingsForProduct(cartItem.produtId)
            console.log(productPricing)
            const sortedPricing = [...productPricing].sort((a, b) => b.min - a.min)
            for (let i = 0; i < sortedPricing.length; i++) {
                const { min, max } = sortedPricing[i];
                const productCount = cartItem.count;
                const isWithinRange = (min <= productCount) && ((max >= productCount) || max === null || max === 0);
                if (isWithinRange) {
                    return sortedPricing[i].price
                }
            }
        }

        formattedItem.quantity = checkoutCart[i].count
        formattedItem.price_data.product_data.name = productInfo.name
        formattedItem.price_data.product_data.description = productInfo.description
        formattedItem.price_data.product_data.images = [checkoutCart[i].stripeImgThumbnail]
        formattedItem.price_data.unit_amount = getUnitPrice(checkoutCart[i]) * 100
        console.log('userCartFinal', userCartFinal)
        userCartFinal.push(formattedItem)
    }

    let session

    try {
        session = await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: userCartFinal,
            customer_email: email,
            success_url: `${domainUrl}/cart/checkout/success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainUrl}/canceled`,
            shipping_address_collection: { allowed_countries: ['US'] },
            automatic_tax: { enabled: true }
        })
        res.status(200).json({ sessionID: session.id })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'An error occured, unable to create session' })
    }
}
