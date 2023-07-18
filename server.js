require('dotenv').config()
const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SK)

const app = express()

app.use(cors());
app.use(express.json())

const path = require("path")
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"))
})
}


app.get('/', (req, res) => {
    res.send("Welcome to our RRNovelties website")
})

const array = [];
const calculateOrderAmount = (items) => {
      items.map((item) => {
        const {price, cartQuantity} = item;
        const cartItemAmount = price * cartQuantity;
        return array.push(cartItemAmount)
      });
      const totalAmount = array.reduce((a, b) => {
        return a + b;
      }, 0);
    return totalAmount * 100;
  };
  
  app.post("/create-payment-intent", async (req, res) => {
    const { items, shipping, description } = req.body;
    console.log("aaaaa", items);
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      description,
      shipping: {
        address: {
            line1: shipping.line1,
            line2: shipping.line2,
            city: shipping.city,
            country: shipping.country,
            postal_code: shipping.postal_code
        },
        name: shipping.name,
        phone: shipping.phone
      }
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

const PORT = process.env.PORT || 4242
app.listen(PORT, () => {
    console.log(`Server listening from ${PORT}`)
})