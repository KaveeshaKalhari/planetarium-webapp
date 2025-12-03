import React, { useState } from "react";

const steps = [
    { label: "Select Show", path: "/booking" },
    { label: "Choose Seats", path: "/choose-seats" },
    { label: "Review Order", path: "/review-order" },
    { label: "Payment", path: "/payment" },
];

const show = {
  title: "Galaxies Nebulae",
  date: "July 28, 2025",
  time: "10.00 AM",
  seats: ["C4", "C5", "C6"],
};

const subtotal = 500;
const bookingFee = 50;
const total = subtotal + bookingFee;

const PaymentPage: React.FC = () => {
  const [method, setMethod] = useState<"card" | "wallet">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a1121] flex flex-col items-center pt-8 px-2">
      <h1 className="text-4xl font-bold text-white text-center mb-2">Payment</h1>
      <p className="text-center text-gray-200 mb-8">
        Securely complete your booking by providing your payment details.
      </p>
      {/* Stepper */}
      <div className="flex justify-center items-center gap-16 mb-12 w-full max-w-3xl">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex flex-col items-center w-32">
            <div className="relative flex items-center">
              <button
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition ${
                  idx === 3
                    ? "bg-gray-300 border-cyan-400 text-[#0a1121] shadow-lg"
                    : "bg-[#0a1121] border-white text-white"
                }`}
                disabled
              >
                {idx + 1}
              </button>
              {idx < steps.length - 1 && (
                <span className="absolute right-[-64px] top-1/2 w-32 h-0.5 bg-white"></span>
              )}
            </div>
            <span
              className={`mt-3 text-base font-semibold ${
                idx === 3 ? "text-white" : "text-gray-300"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl">
        {/* Payment Method */}
        <div className="bg-[#e5edf5] rounded-lg p-6 flex-1 min-w-[320px]">
          <h2 className="text-gray-700 font-bold text-xl mb-2">Payment Method</h2>
          <div className="mb-4">
            <span className="text-gray-700 font-semibold">Choose&nbsp; how you'd like to pay</span>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                className={`px-4 py-2 rounded flex items-center gap-2 font-medium border ${
                  method === "card"
                    ? "bg-white border-cyan-400 text-[#0a1121]"
                    : "bg-gray-200 border-gray-300 text-gray-600"
                }`}
                onClick={() => setMethod("card")}
              >
                <span className="material-icons">credit_card</span>
                Credit/Debit Card
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded flex items-center gap-2 font-medium border ${
                  method === "wallet"
                    ? "bg-white border-cyan-400 text-[#0a1121]"
                    : "bg-gray-200 border-gray-300 text-gray-600"
                }`}
                onClick={() => setMethod("wallet")}
              >
                <span className="material-icons">account_balance_wallet</span>
                Digital Wallet
              </button>
            </div>
          </div>
          {/* Card Details */}
          {method === "card" && (
            <form className="space-y-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Card Number</label>
                <input
                  type="text"
                  maxLength={16}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                  placeholder="0000000000000000"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-gray-700 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-semibold mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                    placeholder="123"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Card Holder Name</label>
                <input
                  type="text"
                  value={holder}
                  onChange={e => setHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                  placeholder="Enter name as it appears on card"
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={e => setSaveCard(e.target.checked)}
                  className="mr-2"
                  id="saveCard"
                />
                <label htmlFor="saveCard" className="text-gray-700 text-sm">
                  Save this card for future payments
                </label>
              </div>
            </form>
          )}
          {method === "wallet" && (
            <div className="mt-4 text-gray-600">
              <span>Wallet payment coming soon...</span>
            </div>
          )}
        </div>
        {/* Order Summary */}
        <div className="bg-[#e5edf5] rounded-lg p-6 flex-1 min-w-[320px]">
          <h2 className="text-gray-700 font-bold text-xl mb-2">Order Summary</h2>
          <div className="mb-2 flex">
            <span className="text-gray-700 w-24">Show:</span>
            <span className="font-semibold text-[#16244a]">{show.title}</span>
          </div>
          <div className="mb-2 flex">
            <span className="text-gray-700 w-24">Date:</span>
            <span className="font-semibold text-[#16244a]">{show.date}</span>
          </div>
          <div className="mb-2 flex">
            <span className="text-gray-700 w-24">Showtime:</span>
            <span className="font-semibold text-[#16244a]">{show.time}</span>
          </div>
          <div className="mb-2 flex">
            <span className="text-gray-700 w-24">Seats:</span>
            <span className="font-semibold text-[#16244a]">{show.seats.join(", ")}</span>
          </div>
          <div className="mb-2 flex">
            <span className="text-gray-700 w-24">Subtotal:</span>
            <span className="font-semibold text-[#16244a]">Rs.{subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-2 flex">
            <span className="text-gray-700 w-24">Booking Fee:</span>
            <span className="font-semibold text-[#16244a]">Rs.{bookingFee.toFixed(2)}</span>
          </div>
          <hr className="my-2 border-gray-400" />
          <div className="flex justify-between items-center font-bold text-lg text-[#16244a]">
            <span>Total</span>
            <span>Rs.{total.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="mt-6 w-full bg-green-400 text-[#16244a] px-6 py-3 rounded font-semibold flex items-center justify-center gap-2 hover:bg-green-500 transition"
          >
            <span className="material-icons">check_circle</span>
            Pay Now
          </button>
          <div className="mt-4 flex items-center gap-2 text-gray-600 text-xs">
            <span className="material-icons">lock</span>
            All transactions are secure and encrypted.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;