import { findUserById } from './database.js'
import { stripeAPI } from './stripe.js'

export const createCheckoutSession = async (req, res) => {
    // const domainUrl = process.env.WEB_APP_URL
    const { userCart, userDoc } = req.body

    if (!userDoc || !userCart) {
        return res.status(200).json({ error: 'Missing required session parameters' })
    }

    const userInfo = findUserById(userDoc.id)
    const email = userInfo.email

    let userCartFinal = []

    for (let i = 0; i < userCart.length; i++) {
        const formattedItem = {
            quantity: 0,
            price_data: {
                currency: 'usd',
                unit_amount: 0 // in cents
            },
            product_data: {
                name: '',
                description: '',
                iamges: []
            }
        }

        formattedItem.quantity = userCart[i].count
        formattedItem.product_data.name = userCart[i].details.name
        formattedItem.product_data.description = userCart[i].details.description

        userCartFinal.push(formattedItem)
    }

    // let session

    try {
        //     session = await stripeAPI.checkout.sessions.create({
        //         payment_method_types: ['card'],
        //         mode: 'payment',
        //         line_items: userCart,
        //         customer_email: email,
        //         success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        //         cancel_url: `${domainUrl}/canceled`,
        //         shipping_address_collection: { allowed_countries: ['GB', 'US'] },
        //         automatic_tax: { enanbled: true }
        //     })
        // res.status(200).json({ sessionID: session.id })
        res.status(200).json({ email, userCartFinal })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'An error occured, unable to create session' })
    }
}
