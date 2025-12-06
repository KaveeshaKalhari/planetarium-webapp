import React from 'react';
import { ArrowLeft, ArrowRight, Edit } from 'lucide-react';

interface BookingDetails {
    showName: string;
    description: string;
    date: string;
    showtime: string;
    seats: string[];
    adultTickets: number;
    childTickets: number;
    adultPrice: number;
    childPrice: number;
    bookingFee: number;
}

const BookingReviewPage: React.FC = () => {
    const booking: BookingDetails = {
        showName: "Galaxies Nebulae",
        description: "A journey to the edge of the universe.",
        date: "July 28, 2025",
        showtime: "10.00 AM",
        seats: ["C4", "C5", "C6"],
        adultTickets: 2,
        childTickets: 1,
        adultPrice: 200,
        childPrice: 100,
        bookingFee: 50
    };

    const total = (booking.adultTickets * booking.adultPrice) +
        (booking.childTickets * booking.childPrice) +
        booking.bookingFee;

    const steps = [
        { number: 1, label: "Select Show", active: false },
        { number: 2, label: "Choose Seats", active: false },
        { number: 3, label: "Review Order", active: true },
        { number: 4, label: "Payment", active: false }
    ];

    return (
        <div className="min-h-screen bg-[#0A1128] text-white p-4 md:p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    Review Your Order
                </h1>
                <p className="text-slate-300 text-center text-lg">
                    Please confirm the details of your booking before proceeding to payment.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="max-w-5xl mx-auto mb-12">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center text-xl md:text-2xl font-bold transition-all ${
                                        step.active
                                            ? 'bg-slate-400 border-slate-400 text-slate-900'
                                            : 'bg-transparent border-slate-200 text-slate-200'
                                    }`}
                                >
                                    {step.number}
                                </div>
                                <span className="mt-3 text-sm md:text-base font-medium text-slate-200">
                  {step.label}
                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-1 bg-slate-200 mx-2 md:mx-4 mb-8" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Order Details Card */}
            <div className="max-w-5xl mx-auto bg-slate-300 rounded-2xl p-6 md:p-10">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-6">
                            Order Summary
                        </h2>

                        <div className="mb-6">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {booking.showName}
                                </h3>
                                <button className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors">
                                    <Edit size={18} />
                                    <span className="font-semibold">Edit</span>
                                </button>
                            </div>
                            <p className="text-slate-600 text-base">
                                {booking.description}
                            </p>
                        </div>

                        <div className="space-y-3 text-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Date:</span>
                                <span className="text-lg font-bold text-slate-900">
                  {booking.date}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Showtime:</span>
                                <span className="text-lg font-bold text-slate-900">
                  {booking.showtime}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Seats:</span>
                                <span className="text-lg font-bold text-slate-900">
                  {booking.seats.join(", ")}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-6">
                            Price Details
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-slate-700">
                <span className="text-lg font-medium">
                  Adult Ticket(x{booking.adultTickets})
                </span>
                                <span className="text-lg font-semibold">
                  Rs.{booking.adultTickets * booking.adultPrice}.00
                </span>
                            </div>
                            <div className="flex justify-between items-center text-slate-700">
                <span className="text-lg font-medium">
                  Child Ticket(x{booking.childTickets})
                </span>
                                <span className="text-lg font-semibold">
                  Rs.{booking.childTickets * booking.childPrice}.00
                </span>
                            </div>
                            <div className="flex justify-between items-center text-slate-700">
                                <span className="text-lg font-medium">Booking Fee:</span>
                                <span className="text-lg font-semibold">
                  Rs.{booking.bookingFee}.00
                </span>
                            </div>

                            <div className="border-t-2 border-slate-400 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-slate-900">
                    Total
                  </span>
                                    <span className="text-2xl font-bold text-slate-900">
                    Rs.{total}.00
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-14 justify-center mt-8">
                    <button
                        type="button"
                        onClick={() => { window.location.href = '/choose-seats'; }}
                        className="flex items-center justify-center gap-2 px-9 py-4 bg-slate-400 hover:bg-slate-500 text-slate-900 font-semibold rounded-lg transition-colors text-lg"
                    >
                        <ArrowLeft size={20} />
                        Go Back & Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => { window.location.href = '/payment'; }}
                        className="flex items-center justify-center px-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors text-lg"
                    >
                        Proceed to Payment
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingReviewPage;