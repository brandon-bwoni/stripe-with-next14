'use client'

import CheckoutPage from "@/app/components/CheckoutPage"
import convertToSubcurrencey from "../../lib/convertToSubcurrency"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string)

export default function Home() {
  const amount = 49.99
  return (
   <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
    <div className="mb-8">
      <h1 className="text-4xl font-extrabold mb-2">Brandon</h1>
      <h2 className="text-2xl">
        has requested 
        <span className="font-bold"> ${amount}</span>
      </h2>
    </div>
      <Elements 
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrencey(amount),
          currency: "usd"
        }}  
      >
        <CheckoutPage amount={amount}/>
      </Elements>
   </main>
  );
}
