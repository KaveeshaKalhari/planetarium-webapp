import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { BookingStepper } from '../components/BookingStepper';

export function PaymentPage() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentComplete, setPaymentComplete] = useState(false);

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentComplete(true);
        setTimeout(() => {
            navigate('/user-home-page');
        }, 3000);
    };

    const total = 500.00; // Example total amount

    if (paymentComplete) {
        return (
            <div className="min-h-screen bg-[#FEFCFB] flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#1282A2] p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-[#0A1128] mb-4">Payment Successful!</h2>
                        <p className="text-[#0A1128]/70 mb-6">
                            Your booking has been confirmed. A confirmation email has been sent to your registered email address.
                        </p>
                        <div className="bg-[#1282A2]/10 border border-[#1282A2]/20 p-4 rounded-lg mb-6">
                            <p className="text-sm text-[#0A1128]">
                                <strong>Booking Reference:</strong> PB2026012601
                            </p>
                        </div>
                        <p className="text-sm text-[#0A1128]/60">Redirecting to home page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FEFCFB]">
            <div className="bg-gradient-to-r from-[#0A1128] to-[#001F54] text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-2">Payment</h1>
                    <p className="text-white/90">Complete your booking securely</p>
                </div>
            </div>

            {/* Booking Stepper */}
            <BookingStepper currentStep={4} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <Lock className="w-5 h-5 text-[#1282A2]" />
                                <h2 className="text-2xl font-bold text-[#0A1128]">Secure Payment</h2>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-[#0A1128] mb-4">Payment Method</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 border-2 rounded-lg transition-all Rs{
                                            paymentMethod === 'card'
                                                ? 'border-[#1282A2] bg-[#1282A2]/10'
                                                : 'border-[#0A1128]/20 hover:border-[#1282A2]/50'
                                        }`}
                                    >
                                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-[#0A1128]" />
                                        <p className="text-sm font-medium text-[#0A1128]">Credit Card</p>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('debit')}
                                        className={`p-4 border-2 rounded-lg transition-all Rs{
                                            paymentMethod === 'debit'
                                                ? 'border-[#1282A2] bg-[#1282A2]/10'
                                                : 'border-[#0A1128]/20 hover:border-[#1282A2]/50'
                                        }`}
                                    >
                                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-[#0A1128]" />
                                        <p className="text-sm font-medium text-[#0A1128]">Debit Card</p>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`p-4 border-2 rounded-lg transition-all Rs{
                                            paymentMethod === 'upi'
                                                ? 'border-[#1282A2] bg-[#1282A2]/10'
                                                : 'border-[#0A1128]/20 hover:border-[#1282A2]/50'
                                        }`}
                                    >
                                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-[#0A1128]" />
                                        <p className="text-sm font-medium text-[#0A1128]">UPI</p>
                                    </button>
                                </div>
                            </div>

                            {/* Card Details Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="cardName">Cardholder Name</Label>
                                    <Input
                                        id="cardName"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.cardName}
                                        onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                                        className="mt-1 bg-[#FEFCFB] border-[#0A1128]/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={formData.cardNumber}
                                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                        className="mt-1 bg-[#FEFCFB] border-[#0A1128]/20"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiryDate">Expiry Date</Label>
                                        <Input
                                            id="expiryDate"
                                            type="text"
                                            placeholder="MM/YY"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="mt-1 bg-[#FEFCFB] border-[#0A1128]/20"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            type="text"
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                            className="mt-1 bg-[#FEFCFB] border-[#0A1128]/20"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bg-[#1282A2]/10 border border-[#1282A2]/20 p-4 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <Lock className="w-5 h-5 text-[#1282A2] mt-0.5" />
                                        <p className="text-sm text-[#0A1128]">
                                            Your payment information is encrypted and secure. We do not store your card details.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-md transition-colors font-medium"
                                >
                                    Pay Rs{total.toFixed(2)}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg sticky top-4">
                            <h3 className="text-xl font-bold text-[#0A1128] mb-6">Payment Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="pb-3 border-b border-[#0A1128]/10">
                                    <p className="font-medium text-[#0A1128] mb-1">Journey to the Stars</p>
                                    <p className="text-sm text-[#0A1128]/60">January 26, 2026 • 7:00 PM</p>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-[#0A1128]/70">Seats (3 × Rs150.00)</span>
                                    <span className="font-medium text-[#0A1128]">Rs 450.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#0A1128]/70">Service Fee</span>
                                    <span className="font-medium text-[#0A1128]">Rs 2.50</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#0A1128]/70">Tax</span>
                                    <span className="font-medium text-[#0A1128]">Rs 3.15</span>
                                </div>
                            </div>

                            <div className="border-t border-[#0A1128]/10 pt-4">
                                <div className="flex justify-between text-xl font-bold">
                                    <span className="text-[#0A1128]">Total</span>
                                    <span className="text-[#1282A2]">Rs{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}