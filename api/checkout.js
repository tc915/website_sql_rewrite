const stripeAPI = require('./stripe')

const createCheckoutSession = async (req, res) => {
    const domainUrl = process.env.WEB_APP_URL
    const { email, userCart } = req.body

    if (!email || !userCart) {
        return res.status(200).json({ error: 'Missing required session parameters' })
    }

    let session

    try {
        session = await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: userCart,
            customer_email: email,
            success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainUrl}/canceled`,
            shipping_address_collection: { allowed_countries: ['GB', 'US'] },
            automatic_tax: { enanbled: true }
        })
        res.status(200).json({ sessionID: session.id })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'An error occured, unable to create session' })
    }
}

module.exports = createCheckoutSession