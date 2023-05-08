import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
 
const stripePromise = loadStripe("pk_test_51My8EeK1wTZ2urZSice9wpbyHGj80BOb1RDLeyaURz8TCoAgbHgVbwv3z34kBkaWI90Gt2DpXk8vn60UXBizuIC3007IWNzkzW");

const CheckoutForm = () => {
  const [amount, setAmount] = useState(0);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      const response = await fetch(
        "http://localhost:4000/api/stripe/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amount * 100 }),
        }
      );

      const { clientSecret } = await response.json();

      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        console.log("[error]", confirmError);
      } else {
        console.log("[success]", "Payment succeeded!");
        setAmount(0);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

function StripePayments() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default StripePayments;
