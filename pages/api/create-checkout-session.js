// pages/api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'prod_SirsUzmK1tACqT', // Replace with your actual Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://letunfold.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://letunfold.com/cancel',
      customer_email: email, // optional, for pre-filled email
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
