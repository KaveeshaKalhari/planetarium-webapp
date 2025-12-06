import React, { useState } from 'react';
import { CreditCard, Wallet, Lock, Shield } from 'lucide-react';

interface OrderDetails {
    show: string;
    date: string;
    showtime: string;
    seats: string[];
    subtotal: number;
    bookingFee: number;
}

const PaymentPage: React.FC = () => {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [saveCard, setSaveCard] = useState(false);

    const order: OrderDetails = {
        show: "Galaxies Nebulae",
        date: "July 28, 2025",
        showtime: "10.00 AM",
        seats: ["C4", "C5", "C6"],
        subtotal: 500,
        bookingFee: 50
    };

    const total = order.subtotal + order.bookingFee;

    const steps = [
        { number: 1, label: "Select Show", active: false },
        { number: 2, label: "Choose Seats", active: false },
        { number: 3, label: "Review Order", active: false },
        { number: 4, label: "Payment", active: true }
    ];

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '');
        if (value.length <= 16 && /^\d*$/.test(value)) {
            setCardNumber(value);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        if (value.length <= 5) {
            setExpiryDate(value);
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 3 && /^\d*$/.test(value)) {
            setCvv(value);
        }
    };

    const handlePayment = () => {
        console.log('Processing payment...');
    };

    return (
        <div className="min-h-screen bg-[#0A1128] text-white md:p-6">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    Payment
                </h1>
                <p className="text-slate-300 text-center text-lg">
                    Securely complete your booking by providing your payment details.
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

            {/* Payment Content */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                {/* Payment Method Card */}
                <div className="bg-slate-300 rounded-2xl md:p-6 md:pb-0 p-4 pb-0">
                    <h2 className="text-3xl font-bold text-slate-900 mb-1.5">
                        Payment Method
                    </h2>
                    <p className="text-slate-700 text-lg mb-2">
                        Choose how you'd like to pay
                    </p>

                    {/* Payment Method Toggle */}
                    <div className="flex gap-3 mb-2">
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                                paymentMethod === 'card'
                                    ? 'bg-teal-500 text-white border-2 border-teal-600'
                                    : 'bg-slate-200 text-slate-700 border-2 border-slate-300'
                            }`}
                        >
                            <CreditCard size={20} />
                            Credit/Debit Card
                        </button>
                        <button
                            onClick={() => setPaymentMethod('wallet')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                                paymentMethod === 'wallet'
                                    ? 'bg-teal-500 text-white border-2 border-teal-600'
                                    : 'bg-slate-200 text-slate-700 border-2 border-slate-300'
                            }`}
                        >
                            <Wallet size={20} />
                            Digital Wallet
                        </button>
                    </div>

                    {/* Card Details Form */}
                    {paymentMethod === 'card' && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900">Card Details</h3>

                            {/* Card Number */}
                            <div>
                                <label className="block text-slate-700 font-semibold">
                                    Card Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="0000000000000000"
                                        className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                    />
                                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                                </div>
                            </div>

                            {/* Expiry and CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 font-semibold">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        value={expiryDate}
                                        onChange={handleExpiryChange}
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-semibold">
                                        CVV
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={handleCvvChange}
                                            placeholder="123"
                                            className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Card Holder Name */}
                            <div>
                                <label className="block text-slate-700 font-semibold">
                                    Card Holder Name
                                </label>
                                <input
                                    type="text"
                                    value={cardHolder}
                                    onChange={(e) => setCardHolder(e.target.value)}
                                    placeholder="Enter name as it appears on card"
                                    className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                />
                            </div>

                            {/* Save Card Checkbox */}
                            <div className="flex items-center gap-3 mb-0">
                                <input
                                    type="checkbox"
                                    id="saveCard"
                                    checked={saveCard}
                                    onChange={(e) => setSaveCard(e.target.checked)}
                                    className="w-5 h-5 rounded border-2 border-slate-400 text-teal-500 focus:ring-teal-500"
                                />
                                <label htmlFor="saveCard" className="text-slate-700 font-medium cursor-pointer">
                                    Save this card for future payments
                                </label>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'wallet' && (
                        <div className="text-center py-12">
                            <Wallet className="mx-auto mb-4 text-slate-600" size={64} />
                            <p className="text-slate-600 text-lg">Digital Wallet option coming soon</p>
                        </div>
                    )}
                </div>

                {/* Order Summary Card */}
                <div className="space-y-6">
                    <div className="bg-slate-300 rounded-2xl p-6 md:p-6">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-4 text-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Show:</span>
                                <span className="font-bold text-slate-900 text-lg">
                  {order.show}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Date:</span>
                                <span className="font-bold text-slate-900 text-lg">
                  {order.date}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Showtime:</span>
                                <span className="font-bold text-slate-900 text-lg">
                  {order.showtime}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Seats:</span>
                                <span className="font-bold text-slate-900 text-lg">
                  {order.seats.join(", ")}
                </span>
                            </div>

                            <div className="border-t-2 border-slate-400 pt-4 mt-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-lg">Subtotal</span>
                                    <span className="font-semibold text-lg">
                    Rs.{order.subtotal}.00
                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-lg">Booking Fee</span>
                                    <span className="font-semibold text-lg">
                    Rs.{order.bookingFee}.00
                  </span>
                                </div>
                            </div>

                            <div className="border-t-2 border-slate-400 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-slate-900">Total</span>
                                    <span className="text-2xl font-bold text-slate-900">
                    Rs.{total}.00
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pay Now Button */}
                    <button
                        onClick={handlePayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3 text-xl"
                    >
                        <Shield size={24} />
                        Pay Now
                    </button>

                    {/* Security Message */}
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                        <Lock size={18} />
                        <span className="text-sm">All transactions are secure and encrypted.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;