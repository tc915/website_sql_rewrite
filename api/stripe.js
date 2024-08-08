// Import the Stripe library for interacting with Stripe's API
import Stripe from "stripe";

// Initialize a new Stripe instance using the secret key from environment variables
export const stripeAPI = new Stripe(process.env.STRIPE_SECRET_KEY);
