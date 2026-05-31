import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import { BookingStepper } from '../components/BookingStepper';

export function ReviewOrderPage() {
    const navigate = useNavigate();

    const bookingDetails = {
        show: 'Journey to the Stars',
        date: 'January 26, 2026',
        time: '7:00 PM',
        duration: '45 minutes',
        venue: 'Main Planetarium Hall',
        seats: ['A5', 'A6', 'A7'],
        pricePerSeat: 150,
        tax: 3.15,
        serviceFee: 2.50
    };

    const subtotal = bookingDetails.seats.length * bookingDetails.pricePerSeat;
    const total = subtotal + bookingDetails.tax + bookingDetails.serviceFee;

    return (
        <div className="min-h-screen bg-[#FEFCFB]">
            <div className="bg-gradient-to-r from-[#0A1128] to-[#001F54] text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-2">Review Your Order</h1>
                    <p className="text-white/90">Please verify your booking details</p>
                </div>
            </div>

            {/* Booking Stepper */}
            <BookingStepper currentStep={3} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Show Details */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-[#0A1128] mb-6">Show Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-[#0A1128] mb-2">{bookingDetails.show}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-[#1282A2] mt-1" />
                                        <div>
                                            <p className="text-sm text-[#0A1128]/60">Date</p>
                                            <p className="font-medium text-[#0A1128]">{bookingDetails.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-[#1282A2] mt-1" />
                                        <div>
                                            <p className="text-sm text-[#0A1128]/60">Time</p>
                                            <p className="font-medium text-[#0A1128]">{bookingDetails.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-[#1282A2] mt-1" />
                                        <div>
                                            <p className="text-sm text-[#0A1128]/60">Duration</p>
                                            <p className="font-medium text-[#0A1128]">{bookingDetails.duration}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-[#1282A2] mt-1" />
                                        <div>
                                            <p className="text-sm text-[#0A1128]/60">Venue</p>
                                            <p className="font-medium text-[#0A1128]">{bookingDetails.venue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seat Details */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-[#0A1128] mb-4">Selected Seats</h2>

                            <div className="flex flex-wrap gap-3">
                                {bookingDetails.seats.map((seat) => (
                                    <div key={seat} className="px-4 py-2 bg-[#1282A2] text-white rounded-lg font-medium">
                                        Seat {seat}
                                    </div>
                                ))}
                            </div>

                            <p className="text-sm text-[#0A1128]/60 mt-4">
                                Total {bookingDetails.seats.length} seat(s) selected
                            </p>
                        </div>

                        {/* Important Information */}
                        <div className="bg-[#1282A2]/10 border border-[#1282A2]/20 p-6 rounded-lg">
                            <h3 className="font-semibold text-[#0A1128] mb-3">Important Information</h3>
                            <ul className="space-y-2 text-sm text-[#0A1128]/80">
                                <li>• Please arrive 15 minutes before the show starts</li>
                                <li>• Late entry may not be permitted</li>
                                <li>• Tickets are non-refundable but can be rescheduled up to 24 hours before the show</li>
                                <li>• Photography and video recording are not allowed during the show</li>
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg sticky top-4">
                            <h3 className="text-xl font-bold text-[#0A1128] mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-[#0A1128]/70">Subtotal ({bookingDetails.seats.length} × ${bookingDetails.pricePerSeat})</span>
                                    <span className="font-medium text-[#0A1128]">Rs{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#0A1128]/70">Service Fee</span>
                                    <span className="font-medium text-[#0A1128]">${bookingDetails.serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#0A1128]/70">Tax</span>
                                    <span className="font-medium text-[#0A1128]">Rs{bookingDetails.tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-[#0A1128]/10 pt-4 mb-6">
                                <div className="flex justify-between text-xl font-bold">
                                    <span className="text-[#0A1128]">Total</span>
                                    <span className="text-[#1282A2]">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/payment')}
                                className="w-full py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-md transition-colors flex items-center justify-center gap-2 mb-3"
                            >
                                <CreditCard className="w-4 h-4" />
                                Proceed to Payment
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => window.history.back()}
                                className="w-full py-3 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-md transition-colors"
                            >
                                Back to Seat Selection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}