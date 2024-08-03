"use client"
import React, { useEffect, useState } from "react"
import { 
  useStripe,
  useElements,
  PaymentElement
 } from "@stripe/react-stripe-js"
 import convertToSubcurrency from "../../../lib/convertToSubcurrency"

const CheckoutPage = ({amount}:{amount: number}) => {
const stripe = useStripe()
const elements = useElements()

const [errorMessage, setErrorMessage] = useState<String>();
const [clientSecret, setClientSecrect] = useState("")
const [loading, setLoading] = useState(false)

useEffect(() => {
  async function fetchPayment(){
    await fetch("/api/create-payment-intent", {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({amount: convertToSubcurrency(amount)})
    })
    .then((res) => res.json())
    .then((data) => setClientSecrect(data.clientSecret))
  } 
  fetchPayment()
}, [amount])


const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  setLoading(true)

  if(!stripe || !elements) return

  const {error: submitError} = await elements.submit()

  if(submitError){
    setErrorMessage(submitError.message);
    setLoading(false)
    return
  }

  const {error} = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: `http://localhost:3000/payment-success?amount=${amount}`
    }
  })

  if(error){
    // This point is only reached if there's an immediate error when
    // confirming the payment. Show the error to your customer( for example payment details incomplete)
    setErrorMessage(error.message)
  } else {
    // The payment UI automatically closes with a success animation
    // You customer is redirected to your 'return urk
  }
  setLoading(false)
}

if (!clientSecret || !stripe || !elements) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}

return(
  <form
    onSubmit={handleSubmit} 
    className="bg-white rounded-md p-4"
  >
    {clientSecret && <PaymentElement/>}
    {errorMessage && <div>{errorMessage}</div>}
    <button
      disabled={!stripe || !elements || loading} 
    className="text-white p-5 bg-black w-full mt-2 rounded-md disabled:opacity-50 disabled:animate-pulse  ">
       {!loading ? `Pay ${amount}`: "Processing..."}
    </button>
  </form>
)
}


export default CheckoutPage