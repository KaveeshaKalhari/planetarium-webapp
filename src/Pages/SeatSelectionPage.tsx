import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Info, Calendar, Clock, Globe, GraduationCap } from 'lucide-react';
import { BookingStepper } from '../components/BookingStepper';

interface Seat {
    id: string;
    row: string;
    number: number;
    angle: number;
    radius: number;
    status: 'available' | 'selected' | 'booked';
}

export function SeatSelectionPage() {
    const navigate = useNavigate();
    //const { showId } = useParams();
    const location = useLocation();
    const [seats, setSeats] = useState<Seat[]>(generateSeats());
    const [showInfo, setShowInfo] = useState(false);

    // Get show details from location state (from Show Availability page) or use defaults
    const showDetails = location.state?.showDetails;

    // Event details
    const eventDetails = {
        title: showDetails?.audienceType || 'Journey Through the Cosmos',
        date: showDetails?.date || 'January 26, 2026',
        time: showDetails?.time || '7:00 PM',
        language: showDetails?.language || 'English',
        duration: '45 minutes',
        pricePerSeat: 15.00
    };

    function generateSeats(): Seat[] {
        const seats: Seat[] = [];
        const rows = [
            { label: 'A', count: 20, radius: 300, bookedSeats: [2, 5, 9, 15] },
            { label: 'B', count: 24, radius: 270, bookedSeats: [3, 7, 11, 14, 19] },
            { label: 'C', count: 28, radius: 240, bookedSeats: [1, 8, 15, 22] },
            { label: 'D', count: 32, radius: 210, bookedSeats: [4, 9, 16, 20, 28] },
            { label: 'E', count: 36, radius: 180, bookedSeats: [2, 12, 18, 25, 32] },
            { label: 'F', count: 40, radius: 150, bookedSeats: [5, 13, 21, 29, 35] },
            { label: 'G', count: 44, radius: 120, bookedSeats: [3, 11, 19, 27, 38] },
        ];

        rows.forEach(row => {
            const angleStep = 360 / row.count;
            for (let i = 0; i < row.count; i++) {
                const angle = i * angleStep - 90;
                seats.push({
                    id: `${row.label}${i + 1}`,
                    row: row.label,
                    number: i + 1,
                    angle,
                    radius: row.radius,
                    status: row.bookedSeats.includes(i + 1) ? 'booked' : 'available'
                });
            }
        });

        return seats;
    }

    const handleSeatClick = (seatId: string) => {
        setSeats(seats.map(seat => {
            if (seat.id === seatId && seat.status !== 'booked') {
                return {
                    ...seat,
                    status: seat.status === 'selected' ? 'available' : 'selected'
                };
            }
            return seat;
        }));
    };

    const selectedSeats = seats.filter(seat => seat.status === 'selected');
    const totalPrice = selectedSeats.length * eventDetails.pricePerSeat;

    const getSeatColor = (status: string) => {
        switch (status) {
            case 'available':
                return '#1282A2';
            case 'selected':
                return '#34D399';
            case 'booked':
                return '#6B7280';
            default:
                return '#1282A2';
        }
    };

    const handleContinue = () => {
        if (selectedSeats.length > 0) {
            sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
            sessionStorage.setItem('totalPrice', totalPrice.toString());
            navigate('/review-order');
        }
    };

    return (
        <div className="min-h-screen bg-[#FEFCFB]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A1128] to-[#001F54] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold mb-2">Choose Your Seats</h1>
                    <p className="text-white/90">Select your preferred seats for the show</p>
                </div>
            </div>

            {/* Booking Stepper */}
            <BookingStepper currentStep={2} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Show Info Banner */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-[#0A1128] mb-3">{eventDetails.title}</h2>
                            <div className="flex items-center gap-6 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#034078]" />
                                    <span className="text-[#0A1128]/70 text-sm">{eventDetails.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#034078]" />
                                    <span className="text-[#0A1128]/70 text-sm font-semibold">{eventDetails.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-[#034078]" />
                                    <span className="text-[#0A1128]/70 text-sm font-semibold">{eventDetails.language}</span>
                                </div>
                                {showDetails?.grade && (
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-[#034078]" />
                                        <span className="text-[#0A1128]/70 text-sm font-semibold">Reserved for {showDetails.grade}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className="px-4 py-2 border-2 border-[#1282A2] text-[#1282A2] hover:bg-[#1282A2] hover:text-white rounded-md transition-colors flex items-center gap-2"
                        >
                            <Info className="w-4 h-4" />
                            Show Info
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Seating Map */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {/* Instructions */}
                        <div className="mb-6 text-center">
                            <h3 className="text-xl font-semibold text-[#0A1128] mb-2">Select Your Seats</h3>
                            <p className="text-[#0A1128]/60 text-sm">
                                Click on available seats to select. Best viewing from center rows (D, E, F).
                            </p>
                        </div>

                        {/* Circular Seating Map */}
                        <div className="flex items-center justify-center mb-6 overflow-hidden">
                            <div className="relative" style={{ width: '550px', height: '550px' }}>
                                {/* Central Overhead Dome Indicator */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                    <div className="relative w-28 h-28">
                                        <div className="absolute inset-0 rounded-full bg-[#1282A2] opacity-20 blur-xl"></div>
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1282A2]/40 via-[#034078]/30 to-[#001F54]/20 border-2 border-[#1282A2]/60 backdrop-blur-sm">
                                            <div className="absolute inset-2 rounded-full border border-[#1282A2]/30"></div>
                                            <div className="absolute inset-4 rounded-full border border-[#1282A2]/20"></div>
                                        </div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                                            <svg className="w-7 h-7 text-[#1282A2] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeDasharray="2 2"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                                            </svg>
                                            <div className="text-[10px] font-bold text-[#1282A2]">360° DOME</div>
                                            <div className="text-[8px] text-[#0A1128]/60">PROJECTION</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Entrance indicator */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                                    <div className="w-16 h-1 bg-[#1282A2] rounded"></div>
                                    <div className="text-[10px] font-semibold text-[#1282A2]">ENTRANCE</div>
                                </div>

                                {/* Seats */}
                                {seats.map(seat => {
                                    const scaledRadius = seat.radius * 0.8; // Scale down by 20%
                                    const x = 275 + scaledRadius * Math.cos((seat.angle * Math.PI) / 180);
                                    const y = 275 + scaledRadius * Math.sin((seat.angle * Math.PI) / 180);

                                    return (
                                        <button
                                            key={seat.id}
                                            onClick={() => handleSeatClick(seat.id)}
                                            disabled={seat.status === 'booked'}
                                            className="absolute transition-all duration-200 hover:scale-125 disabled:cursor-not-allowed group"
                                            style={{
                                                left: `${x}px`,
                                                top: `${y}px`,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                            title={`Seat ${seat.id} - ${seat.status}`}
                                        >
                                            <svg width="13" height="13" viewBox="0 0 20 20">
                                                <rect
                                                    x="2"
                                                    y="6"
                                                    width="16"
                                                    height="12"
                                                    rx="2"
                                                    fill={getSeatColor(seat.status)}
                                                    stroke={seat.status === 'selected' ? '#fff' : 'none'}
                                                    strokeWidth="1.5"
                                                />
                                                <rect
                                                    x="4"
                                                    y="4"
                                                    width="12"
                                                    height="3"
                                                    rx="1.5"
                                                    fill={getSeatColor(seat.status)}
                                                />
                                            </svg>
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0A1128] px-2 py-0.5 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20 shadow-lg text-white">
                                                {seat.id}
                                            </div>
                                        </button>
                                    );
                                })}

                                {/* Row Labels */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((label, index) => {
                                        const radius = (300 - (index * 30) + 20) * 0.8;
                                        const angle = -95;
                                        const x = radius * Math.cos((angle * Math.PI) / 180);
                                        const y = radius * Math.sin((angle * Math.PI) / 180);
                                        return (
                                            <div
                                                key={label}
                                                className="absolute text-[10px] font-bold text-white/90 bg-[#034078] px-1.5 py-0.5 rounded border border-[#1282A2]/40"
                                                style={{
                                                    left: `${x}px`,
                                                    top: `${y}px`,
                                                    transform: 'translate(-50%, -50%)',
                                                }}
                                            >
                                                {label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center items-center gap-6 pt-4 border-t border-[#0A1128]/10">
                            <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 20 20">
                                    <rect x="2" y="6" width="16" height="12" rx="2" fill="#1282A2" />
                                    <rect x="4" y="4" width="12" height="3" rx="1.5" fill="#1282A2" />
                                </svg>
                                <span className="text-xs text-[#0A1128]/70">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 20 20">
                                    <rect x="2" y="6" width="16" height="12" rx="2" fill="#34D399" stroke="#fff" strokeWidth="1.5" />
                                    <rect x="4" y="4" width="12" height="3" rx="1.5" fill="#34D399" />
                                </svg>
                                <span className="text-xs text-[#0A1128]/70">Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 20 20">
                                    <rect x="2" y="6" width="16" height="12" rx="2" fill="#6B7280" />
                                    <rect x="4" y="4" width="12" height="3" rx="1.5" fill="#6B7280" />
                                </svg>
                                <span className="text-xs text-[#0A1128]/70">Booked</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary & Tips */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-[#034078] px-6 py-4">
                                <h3 className="font-bold text-lg text-white">Booking Summary</h3>
                            </div>

                            <div className="p-6">
                                {/* Selected Seats */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-[#0A1128]/60">Selected Seats</span>
                                        <span className="font-semibold text-[#0A1128]">{selectedSeats.length}</span>
                                    </div>

                                    {selectedSeats.length > 0 ? (
                                        <div className="bg-[#FEFCFB] rounded-lg p-4 max-h-48 overflow-y-auto border border-[#0A1128]/10">
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSeats.map(seat => (
                                                    <div
                                                        key={seat.id}
                                                        className="bg-[#1282A2] px-3 py-1.5 rounded-md text-sm font-semibold text-white flex items-center gap-2"
                                                    >
                                                        {seat.id}
                                                        <button
                                                            onClick={() => handleSeatClick(seat.id)}
                                                            className="text-white/80 hover:text-white transition-colors"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#FEFCFB] rounded-lg p-4 text-center text-sm text-[#0A1128]/40 border border-[#0A1128]/10">
                                            No seats selected
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#0A1128]/60">Price per seat</span>
                                        <span className="text-[#0A1128]">${eventDetails.pricePerSeat.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#0A1128]/60">Number of seats</span>
                                        <span className="text-[#0A1128]">× {selectedSeats.length}</span>
                                    </div>
                                    <div className="h-px bg-[#0A1128]/10"></div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span className="text-[#0A1128]">Total</span>
                                        <span className="text-[#1282A2]">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <button
                                    onClick={handleContinue}
                                    disabled={selectedSeats.length === 0}
                                    className="w-full py-3 bg-[#1282A2] hover:bg-[#034078] disabled:bg-[#0A1128]/20 disabled:text-[#0A1128]/40 disabled:cursor-not-allowed text-white rounded-md font-semibold transition-colors mb-3"
                                >
                                    Continue to Review
                                </button>

                                <button
                                    onClick={() => navigate('/select-datetime')}
                                    className="w-full py-3 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-md transition-colors font-semibold"
                                >
                                    Back to Date Selection
                                </button>

                                <p className="text-xs text-[#0A1128]/40 text-center mt-3">
                                    Seats will be held for 10 minutes
                                </p>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-[#1282A2]/10 border border-[#1282A2]/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-4 h-4 text-[#1282A2] mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-[#0A1128]/70 space-y-1">
                                    <p>• Best viewing: Rows D, E & F (center)</p>
                                    <p>• 360° overhead dome projection</p>
                                    <p>• Arrive 15 minutes early</p>
                                    <p>• Wheelchair accessible in Row A</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Modal */}
            {showInfo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[#0A1128]">Show Information</h3>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="text-2xl text-[#0A1128]/60 hover:text-[#0A1128] transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-3 text-sm text-[#0A1128]/80">
                            <p>
                                <strong className="text-[#0A1128]">Overhead Dome:</strong> Our planetarium features a 360° overhead projection dome. Recline and look upward for an immersive celestial experience.
                            </p>
                            <p>
                                <strong className="text-[#0A1128]">Best Seats:</strong> Rows D, E and F (center rings) offer optimal viewing angles directly beneath the dome center.
                            </p>
                            <p>
                                <strong className="text-[#0A1128]">Capacity:</strong> 224 seats arranged in 7 concentric circular rows around the central projection area.
                            </p>
                            <p>
                                <strong className="text-[#0A1128]">Accessibility:</strong> Wheelchair accessible seating available in Row A. Please contact us for assistance.
                            </p>
                            <p>
                                <strong className="text-[#0A1128]">Cancellation:</strong> Free cancellation up to 24 hours before the show.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}