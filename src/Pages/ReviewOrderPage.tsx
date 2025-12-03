import React from "react";

const steps = [
    { label: "Select Show", path: "/booking" },
    { label: "Choose Seats", path: "/choose-seats" },
    { label: "Review Order", path: "/review-order" },
    { label: "Payment", path: "/payment" },
];

const show = {
  title: "Galaxies Nebulae",
  description: "A journey to the edge of the universe.",
  date: "July 28, 2025",
  time: "10.00 AM",
  seats: ["C4", "C5", "C6"],
};

const priceDetails = [
  { label: "Adult Ticket(x2)", price: 400 },
  { label: "Child Ticket(x1)", price: 100 },
  { label: "Booking Fee", price: 50 },
];
priceDetails.reduce((sum, item) => sum + item.price, 0);
const ReviewOrderPage: React.FC = () => (
  <div className="min-h-screen bg-[#08132a] flex flex-col items-center pt-10">
    <h1 className="text-4xl font-bold text-white text-center mb-2">Review Your Order</h1>
    <p className="text-center text-cyan-300 mb-8">
      Please confirm the details of your booking before proceeding to payment.
    </p>
    {/* Stepper */}
    <div className="flex justify-center items-center mb-10 gap-12">
      {steps.map((step, idx) => (
        <div key={step.label} className="flex flex-col items-center">
          <div className="relative">
            <button
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold mb-2 transition ${
                idx === 2
                  ? "bg-[#16244a] border-cyan-400 text-cyan-300"
                  : "bg-[#16244a] border-white text-white"
              }`}
              disabled
            >
              {idx + 1}
            </button>
            {idx < steps.length - 1 && (
              <span className="absolute top-1/2 right-[-48px] w-24 h-0.5 bg-white"></span>
            )}
          </div>
          <span
            className={`text-sm ${
              idx === 2 ? "text-cyan-300 font-semibold" : "text-white"
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
    {/* Order Summary & Price Details */}
    <div className="flex gap-8 bg-[#e5edf5] rounded-lg px-8 py-8 w-full max-w-3xl mb-10">
      {/* Order Summary */}
      <div className="flex-1">
        <h2 className="text-gray-700 font-bold text-lg mb-3">Order Summary</h2>
        <div className="mb-2 flex items-center gap-2">
          <span className="font-semibold text-[#16244a]">{show.title}</span>
          <button className="text-gray-600 text-xs flex items-center gap-1 hover:underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Edit
          </button>
        </div>
        <div className="text-gray-600 text-sm mb-4">{show.description}</div>
        <div className="mb-2 flex">
          <span className="text-gray-600 w-20">Date:</span>
          <span className="font-semibold text-[#16244a]">{show.date}</span>
        </div>
        <div className="mb-2 flex">
          <span className="text-gray-600 w-20">Showtime:</span>
          <span className="font-semibold text-[#16244a]">{show.time}</span>
        </div>
        <div className="mb-2 flex">
          <span className="text-gray-600 w-20">Seats:</span>
          <span className="font-semibold text-[#16244a]">{show.seats.join(", ")}</span>
        </div>
      </div>
      {/* Price Details */}
      <div className="flex-1">
        <h2 className="text-gray-700 font-bold text-lg mb-3">Price Details</h2>
        <div className="mb-2 flex justify-between text-gray-700">
          <span>Adult Ticket(x2)</span>
          <span>Rs.400.00</span>
        </div>
        <div className="mb-2 flex justify-between text-gray-700">
          <span>Child Ticket(x1)</span>
          <span>Rs.100.00</span>
        </div>
        <div className="mb-2 flex justify-between text-gray-700">
          <span>Booking Fee:</span>
          <span>Rs.50.00</span>
        </div>
        <hr className="my-2 border-gray-300" />
        <div className="flex justify-between font-bold text-lg text-[#16244a]">
          <span>Total</span>
          <span>Rs.550.00</span>
        </div>
      </div>
    </div>
    {/* Buttons */}
    <div className="flex gap-4 mb-10">
      <button
        className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium flex items-center gap-2 hover:bg-gray-300"
        type="button"
        onClick={() => window.location.href = "/choose-seats"}
      >
        <span>&larr;</span> Go Back &amp; Edit
      </button>
      <button
        className="bg-green-400 text-[#16244a] px-6 py-2 rounded font-medium flex items-center gap-2 hover:bg-green-500"
        type="button"
      >
        Proceed to Payment <span>&rarr;</span>
      </button>
    </div>
  </div>
);

export default ReviewOrderPage;