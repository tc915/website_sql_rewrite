// Import the sendEmail function from the mailer module to send emails
import { sendEmail } from './mailer.js';
// Import the stripeAPI instance for interacting with the Stripe API
import { stripeAPI } from './stripe.js';

// Initialize an object to store session information
export const sessionsStore = {};

// Variable to keep track of the latest session ID
let latestSessionId = null;

// Webhook handler function to process incoming Stripe webhook events
export const webhook = async (req, res) => {
    // Retrieve the Stripe signature from the request headers
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // Verify and construct the Stripe event object using the raw body and signature
        event = stripeAPI.webhooks.constructEvent(
            req['rawBody'], sig, process.env.WEB_HOOK_SECRET
        );
    } catch (err) {
        // If verification fails, return a 400 error with the error message
        return res.status(400).send(`Webhook error ${err.message}`);
    }

    // Check if the event type is 'checkout.session.completed'
    if (event.type === 'checkout.session.completed') {
        // Retrieve the session object from the event data
        const session = event.data.object;

        try {
            // Retrieve the line items from the completed session
            const lineItems = await stripeAPI.checkout.sessions.listLineItems(session.id, {
                limit: 100
            });

            // Store the session and line items in the sessionsStore
            sessionsStore[session.id] = {
                session,
                lineItems
            };

            // Update latestSessionId with the current session ID
            latestSessionId = session.id;

            // Remove old session data from sessionsStore, keeping only the latest session
            Object.keys(sessionsStore).forEach(id => {
                if (id !== latestSessionId) {
                    delete sessionsStore[id];
                }
            });

            // Retrieve the customer's email from the session
            const email = session.customer_details.email;
            // Define the subject and body of the confirmation email
            const subject = 'Purchase Confirmation';
            const text = `Thank you for your purchase! Your session ID is ${session.id}`;

            // Send a confirmation email to the customer
            sendEmail(email, subject, text);

            // Respond with a 200 status to acknowledge receipt of the webhook
            res.status(200).send('Webhook received');
        } catch (err) {
            // Log any errors encountered while retrieving line items
            console.error(`Failed to retrieve line items: ${err.message}`);
            // Respond with a 500 status if there was an error retrieving line items
            res.status(500).send(`Failed to retrieve line items: ${err.message}`);
        }
    } else {
        // Respond with a 200 status for events that are not 'checkout.session.completed'
        res.status(200).send('Webhook received');
    }
}
