import { stripeAPI } from './stripe.js'
export const sessionsStore = {}

let latestSessionId = null

export const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature']

    let event

    try {
        event = stripeAPI.webhooks.constructEvent(
            req['rawBody'], sig, process.env.WEB_HOOK_SECRET
        )
    } catch (err) {
        return res.status(400).send(`Webhook error ${err.message}`)
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object

        try {
            const lineItems = await stripeAPI.checkout.sessions.listLineItems(session.id, {
                limit: 100
            })

            sessionsStore[session.id] = {
                session,
                lineItems,
                paymentIntentId: session.payment_intent // Store the payment intent ID
            }

            latestSessionId = session.id

            Object.keys(sessionsStore).forEach(id => {
                if (id !== latestSessionId) {
                    delete sessionsStore[id]
                }
            })

            res.status(200).send('Webhook received')
        } catch (err) {
            console.error(`Failed to retrieve line items: ${err.message}`)
            res.status(500).send(`Failed to retrieve line items: ${err.message}`)
        }
    } else if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object
        const sessionId = paymentIntent.metadata.session_id // Retrieve the session ID if stored in metadata

        if (sessionsStore[sessionId]) {
            console.log('Session Store Entry for Payment Intent:', sessionsStore[sessionId])
        } else {
            console.log('No session store entry found for this payment intent.')
        }

        res.status(200).send('Webhook received')
    } else {
        res.status(200).send('Webhook received')
    }
}
