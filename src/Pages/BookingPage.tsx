import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

const PlanetariumBooking = () => {
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 13)); // September 13, 2025
    const [selectedTime, setSelectedTime] = useState('10:00 AM');
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8)); // September 2025

    const steps = [
        { number: 1, label: 'Select Show', active: true },
        { number: 2, label: 'Choose Seats', active: false },
        { number: 3, label: 'Review Order', active: false },
        { number: 4, label: 'Payment', active: false },
    ];

    const showtimes = [
        '10:00 AM',
        '12:00 PM',
        '2:00 AM',
        '4:00 AM',
        '6:00 AM',
        'More',
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
    };

    const formatDateForInput = (date: Date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    return (
        <div className="min-h-screen bg-[#0A1128] text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="max-w-6xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Ticket Booking
                    </h1>
                    <p className="text-slate-300 text-center text-lg">
                        Follow the steps below to complete your booking for an unforgettable journey through the planetarium
                    </p>
                </div>
                <div className="max-w-6xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Ticket Booking
                    </h1>
                    <p className="text-slate-300 text-center text-lg">
                        Follow the steps below to complete your booking for an unforgettable journey through the planetarium
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
                <div className="bg-slate-300 rounded-2xl p-6 md:p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Side - Show Card */}
                        <div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800&h=600&fit=crop"
                                    alt="Galaxies Nebulae"
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">Galaxies Nebulae</h3>
                                    <p className="text-slate-400 text-sm">
                                        Explore the vibrant clouds of gas and dust where stars are born.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Date & Time Selection */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Select Date & Showtime</h2>

                            {/* Date Input */}
                            <div className="mb-6 relative">
                                <input
                                    type="text"
                                    value={formatDateForInput(selectedDate)}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-400 focus:border-blue-500 focus:outline-none text-slate-800 cursor-pointer"
                                />
                                <Calendar className="absolute right-4 top-3.5 text-slate-600" size={20} />
                            </div>

                            {/* Calendar */}
                            <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="p-1 hover:bg-slate-100 rounded"
                                    >
                                        <ChevronLeft size={20} className="text-slate-600" />
                                    </button>
                                    <span className="font-semibold text-slate-800">{monthName}</span>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-1 hover:bg-slate-100 rounded"
                                    >
                                        <ChevronRight size={20} className="text-slate-600" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                                        <div key={day} className="text-xs font-semibold text-slate-500 py-2">
                                            {day}
                                        </div>
                                    ))}
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const isSelected = selectedDate.getDate() === day &&
                                            selectedDate.getMonth() === currentMonth.getMonth() &&
                                            selectedDate.getFullYear() === currentMonth.getFullYear();
                                        return (
                                            <button
                                                key={day}
                                                onClick={() => handleDateSelect(day)}
                                                className={`py-2 text-sm rounded-full transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-500 text-white font-bold'
                                                        : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Showtime Buttons */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {showtimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                                            selectedTime === time
                                                ? 'bg-blue-400 text-slate-900'
                                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                        }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>

                            {/* Continue Button */}
                            <button
                              type="button"
                              onClick={() => { window.location.href = '/choose-seats'; }}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                              Continue
                              <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanetariumBooking;