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

            sessionsStore[session.id] = { session, lineItems }

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
        console.log('Payment succeeded')
    } else {
        res.status(200).send('Webhook received')
    }
}

// // server.js
// //
// // Use this sample code to handle webhook events in your integration.
// //
// // 1) Paste this code into a new file (server.js)
// //
// // 2) Install dependencies
// //   npm install stripe
// //   npm install express
// //
// // 3) Run the server on http://localhost:4242
// //   node server.js

// // The library needs to be configured with your account's secret key.
// // Ensure the key is kept out of any version control system you might be using.
// const stripe = require('stripe')('sk_test_...');
// const express = require('express');
// const app = express();


// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_a8c6c71201a6fb5c7d0d78982b6ac85b1272977b9ce103f3be6eb4b271a410e2";

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.async_payment_failed':
//       const checkoutSessionAsyncPaymentFailed = event.data.object;
//       // Then define and call a function to handle the event checkout.session.async_payment_failed
//       break;
//     case 'checkout.session.async_payment_succeeded':
//       const checkoutSessionAsyncPaymentSucceeded = event.data.object;
//       // Then define and call a function to handle the event checkout.session.async_payment_succeeded
//       break;
//     case 'checkout.session.completed':
//       const checkoutSessionCompleted = event.data.object;
//       // Then define and call a function to handle the event checkout.session.completed
//       break;
//     case 'checkout.session.expired':
//       const checkoutSessionExpired = event.data.object;
//       // Then define and call a function to handle the event checkout.session.expired
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

// app.listen(4242, () => console.log('Running on port 4242'));