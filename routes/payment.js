const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const {encrypt,decrypt} = require('../controllers/security')
router.get('/', async (req, res) => {
  res.render('add_money.ejs', {
    key: 'pk_test_51MKLuRSH1eQbSerGY7CM6QNCzKsjn9XjdTQLAYLHhEUWZPutRToa5IuyQncypu2OkXUp4jjmxLzWtKRznD9Vmy6700OWsTSS5e',
  });
});

router.post('/:amount', async (req, res) => {
  const money = req.params.amount;
  const encryptedMoney = encrypt(money)
  const product = await stripe.products.create({
    name: 'Cryptex',
    type: 'good',
    description: 'Add Money to Your Cryptex Wallet',
  });

  const price = await stripe.prices.create({
    unit_amount: money*100 , 
    currency: 'usd',
    product: product.id,
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/payment-success/?data=${encryptedMoney.encryptedData}&iv=${encryptedMoney.iv}`,
    cancel_url: `http://localhost:3000/portfolio`,
  });

  res.redirect(session.url); 
});
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  const stripeEndpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeEndpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const amountPaid = session.amount_total / 100;
    console.log(amountPaid);
    console.log('Payment succeeded:', session.id);
  }
  res.sendStatus(200);
});
module.exports = router;
