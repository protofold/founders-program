// pages/api/webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Must disable Next.js bodyParser for Stripe webhooks
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // TODO: Update your database, e.g., add "Founder phase 1" tag
      console.log('Checkout session completed:', session);
    }

    res.json({ received: true });
  } catch (err) {
    console.log('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
