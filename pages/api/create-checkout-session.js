// pages/api/create-checkout-session.js
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Important for Stripe signature
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { headers } = req;
    const buf = await buffer(req);
    const sig = headers['stripe-signature'];
    
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // handle post-payment update logic here
    }

    res.json({ received: true });
  } catch (err) {
    console.log('Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
