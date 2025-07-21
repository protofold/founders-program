import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Important for raw request body
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle specific event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Do your post-payment logic here
    }

    res.json({ received: true });
  } catch (err) {
    console.log(`Error`, err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
}
