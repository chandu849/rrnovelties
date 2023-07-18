import React, { useEffect, useState } from "react";
import styles from './CheckoutForm.module.scss'
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import Card from "../card/Card";
import CheckoutSummary from "../checkouttSummary/CheckoutSummary";
import spinnerImg from "../../assets/spinner.jpg"
import { toast } from "react-toastify";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail, selectUserId } from "../../redux/slice/authSlice";
import { CLEAR_CART, selectCartItems, selectCartTotalAmount } from "../../redux/slice/cartSlice";
import { selectShippingAddress } from "../../redux/slice/checkoutSlice";
import { useNavigate } from "react-router-dom";


const CheckoutForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const userId = useSelector(selectUserId)
  const userEmail = useSelector(selectEmail)
  const cartTotalAmount = useSelector(selectCartTotalAmount)
  const shippingAddress = useSelector(selectShippingAddress)
  const cartItems = useSelector(selectCartItems)
  
  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const saveOrder = () => {
    const today = new Date()
    const date = today.toDateString()
    const time = today.toLocaleTimeString()
    const orderConfig = {
      userId,
      userEmail,
      orderDate: date,
      orderTime: time,
      orderAmount: cartTotalAmount,
      orderStatus: "Order Placed",
      cartItems,
      shippingAddress,
      createdAt: Timestamp.now().toDate()
    }
    try {
      addDoc(collection(db, "orders"), orderConfig)
      dispatch(CLEAR_CART())
      toast.success("Order Saved")
      navigate("/checkout-success")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const confirmPayment = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout-success",
      },
      redirect: "if_required"
    })
    .then((result) => {
      if(result.error) {
        toast.error(result.error.message)
        setMessage(result.error.message)
        return;
      }
      if(result.paymentIntent) {
        if(result.paymentIntent.status === "succeeded") {
          setIsLoading(false)
          toast.success("Payment successful")
          saveOrder();
        }
      }
    });
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Card cardClass={styles.card}>
              <CheckoutSummary />
            </Card>
          </div>
          <div>
            <Card cardClass={`${styles.card} ${styles.pay}`}>
              <h3>Stripe Checkout</h3>
              <PaymentElement id={styles["payment-element"]} options={paymentElementOptions} />
              <button disabled={isLoading || !stripe || !elements} id="submit" className={styles.button}>
                <span id="button-text">
                  {isLoading ? (<img src={spinnerImg} alt="Loading.." style={{width: "20px"}}/>) : "Pay now"}
                </span>
              </button>
              {/* Show any error or success messages */}
              {message && <div id={styles["payment-message"]}>{message}</div>}
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CheckoutForm