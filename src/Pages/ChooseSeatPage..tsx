import React, { useState } from 'react';

interface Seat {
    id: string;
    row: string;
    number: number;
    status: 'available' | 'selected' | 'booked';
}

const ChooseSeatsPage: React.FC = () => {
    const [seats, setSeats] = useState<Seat[]>(generateSeats());

    const steps = [
        { number: 1, label: "Select Show", active: false },
        { number: 2, label: "Choose Seats", active: true },
        { number: 3, label: "Review Order", active: false },
        { number: 4, label: "Payment", active: false }
    ];

    function generateSeats(): Seat[] {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const seatsPerRow = 12;
        const allSeats: Seat[] = [];

        rows.forEach((row) => {
            for (let i = 1; i <= seatsPerRow; i++) {
                // Randomly book some seats for demo
                const randomBooked = Math.random() > 0.8;
                allSeats.push({
                    id: `${row}${i}`,
                    row,
                    number: i,
                    status: randomBooked ? 'booked' : 'available'
                });
            }
        });

        return allSeats;
    }

    const handleSeatClick = (seatId: string) => {
        setSeats(prevSeats =>
            prevSeats.map(seat => {
                if (seat.id === seatId && seat.status !== 'booked') {
                    return {
                        ...seat,
                        status: seat.status === 'selected' ? 'available' : 'selected'
                    };
                }
                return seat;
            })
        );
    };

    const getSeatColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-slate-600 hover:bg-slate-500 cursor-pointer';
            case 'selected':
                return 'bg-teal-500 hover:bg-teal-600 cursor-pointer';
            case 'booked':
                return 'bg-slate-800 cursor-not-allowed';
            default:
                return 'bg-slate-600';
        }
    };

    const groupedSeats = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) {
            acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
    }, {} as Record<string, Seat[]>);

    const selectedSeats = seats.filter(seat => seat.status === 'selected');

    return (
        <div className="min-h-screen bg-[#0A1128] text-white p-4 md:p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    Choose Your Seats
                </h1>
                <p className="text-slate-300 text-center text-lg">
                    Select your preferred seats from the map below. Click on available seats to add them to your booking.
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

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                {/* Screen */}
                <div className="mb-8">
                    <div className="bg-slate-400 h-2 rounded-full max-w-4xl mx-auto mb-2"></div>
                    <p className="text-center text-slate-400 text-sm">SCREEN</p>
                </div>

                {/* Seating Map */}
                <div className="bg-slate-900 rounded-2xl p-6 md:p-8 mb-6">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {Object.entries(groupedSeats).map(([row, rowSeats]) => (
                            <div key={row} className="flex items-center gap-2">
                                <span className="text-slate-400 font-bold w-8 text-center">{row}</span>
                                <div className="flex gap-2 flex-1 justify-center">
                                    {rowSeats.map((seat) => (
                                        <button
                                            key={seat.id}
                                            onClick={() => handleSeatClick(seat.id)}
                                            disabled={seat.status === 'booked'}
                                            className={`w-8 h-8 rounded-lg transition-all ${getSeatColor(seat.status)}`}
                                            title={`Seat ${seat.id} - ${seat.status}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-slate-400 font-bold w-8 text-center">{row}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend and Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
                    {/* Legend */}
                    <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-600 rounded-lg"></div>
                            <span className="text-slate-300">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-teal-500 rounded-lg"></div>
                            <span className="text-slate-300">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-800 rounded-lg"></div>
                            <span className="text-slate-300">Booked</span>
                        </div>
                    </div>

                    {/* Selected Seats Info */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-slate-400 text-sm">Selected Seats</p>
                            <p className="text-white font-bold text-lg">
                                {selectedSeats.length > 0
                                    ? selectedSeats.map(s => s.id).join(', ')
                                    : 'None'}
                            </p>
                        </div>
                        <button
                            disabled={selectedSeats.length === 0}
                            onClick={() => {
                                if (selectedSeats.length === 0) return;
                                const seatsParam = encodeURIComponent(selectedSeats.map(s => s.id).join(','));
                                window.location.href = `/review-order?seats=${seatsParam}`;
                            }}
                            className={`px-8 py-3 rounded-full font-bold transition-colors ${
                                selectedSeats.length > 0
                                    ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer'
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseSeatsPage;