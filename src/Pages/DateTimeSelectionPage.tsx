import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Info, Globe, ChevronLeft, ChevronRight, ArrowRight, MessageSquare} from 'lucide-react';
import { BookingStepper } from '../components/BookingStepper';

export function DateTimeSelectionPage() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Show times
    const showTimes = [
        { id: 'morning', time: '10:00 AM', label: 'Morning Show' },
        { id: 'afternoon', time: '3:00 PM', label: 'Afternoon Show' }
    ];

    // Languages for weekday shows
    const languages = [
        { id: 'english', name: 'English', icon: '🇬🇧' },
        { id: 'sinhala', name: 'Sinhala', icon: '🇱🇰' },
        { id: 'tamil', name: 'Tamil', icon: '🇱🇰' }
    ];

    // Check if date is a weekday (Monday-Friday)
    const isWeekday = (date: Date) => {
        const day = date.getDay();
        return day >= 1 && day <= 5; // 1 = Monday, 5 = Friday
    };

    // Check if date is weekend (Saturday-Sunday)
    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    };

    // Get calendar days for current month
    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        // Reset language if switching from weekday to weekend
        if (isWeekend(date)) {
            setSelectedLanguage('');
        }
    };

    const handleContinue = () => {
        if (selectedDate && selectedTime && (isWeekend(selectedDate) || selectedLanguage)) {
            // Store booking details
            sessionStorage.setItem('bookingDate', selectedDate.toISOString());
            sessionStorage.setItem('bookingTime', selectedTime);
            if (selectedLanguage) {
                sessionStorage.setItem('bookingLanguage', selectedLanguage);
            }
            navigate('/seat-selection');
        }
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const isSameDay = (date1: Date | null, date2: Date | null) => {
        if (!date1 || !date2) return false;
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const calendarDays = getCalendarDays();
    const canContinue = selectedDate && selectedTime && (isWeekend(selectedDate) || selectedLanguage);

    return (
        <div className="min-h-screen bg-[#FEFCFB]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A1128] to-[#001F54] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold mb-2">Select Date & Show Time</h1>
                    <p className="text-white/90">Choose your preferred date and time for the planetarium show</p>
                </div>
            </div>

            {/* Booking Stepper */}
            <BookingStepper currentStep={1} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Program Type Info Banner */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#034078]/10 border-l-4 border-[#034078] p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="bg-[#034078] p-2 rounded">
                                <CalendarIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0A1128] mb-1">School Program – Weekdays</h3>
                                <p className="text-sm text-[#0A1128]/70">Monday to Friday | Educational shows for students</p>
                                <p className="text-xs text-[#0A1128]/60 mt-1">Language selection available</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1282A2]/10 border-l-4 border-[#1282A2] p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="bg-[#1282A2] p-2 rounded">
                                <CalendarIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0A1128] mb-1">Public Program – Weekends</h3>
                                <p className="text-sm text-[#0A1128]/70">Saturday & Sunday | Open to general public</p>
                                <p className="text-xs text-[#0A1128]/60 mt-1">Standard show in Sinhala</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Calendar */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#0A1128]">Select Date</h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={previousMonth}
                                    className="p-2 hover:bg-[#0A1128]/5 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-[#0A1128]" />
                                </button>
                                <div className="text-center min-w-[180px]">
                                    <p className="font-bold text-[#0A1128]">
                                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                    </p>
                                </div>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-[#0A1128]/5 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-[#0A1128]" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="mb-6">
                            {/* Day names */}
                            <div className="grid grid-cols-7 gap-2 mb-3">
                                {dayNames.map(day => (
                                    <div key={day} className="text-center text-sm font-semibold text-[#0A1128]/60 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar days */}
                            <div className="grid grid-cols-7 gap-2">
                                {calendarDays.map((date, index) => {
                                    if (!date) {
                                        return <div key={`empty-${index}`} className="aspect-square" />;
                                    }

                                    const isSelected = isSameDay(date, selectedDate);
                                    const isPast = isPastDate(date);
                                    const dateIsWeekday = isWeekday(date);
                                    //const dateIsWeekend = isWeekend(date);

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => !isPast && handleDateSelect(date)}
                                            disabled={isPast}
                                            className={`
                        aspect-square rounded-lg text-sm font-medium transition-all
                        ${isPast
                                                ? 'text-[#0A1128]/20 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-[#1282A2] text-white shadow-lg scale-105'
                                                    : dateIsWeekday
                                                        ? 'bg-[#034078]/5 text-[#0A1128] hover:bg-[#034078]/20 border border-[#034078]/20'
                                                        : 'bg-[#1282A2]/5 text-[#0A1128] hover:bg-[#1282A2]/20 border border-[#1282A2]/20'
                                            }
                      `}
                                        >
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <span>{date.getDate()}</span>
                                                {!isPast && !isSelected && (
                                                    <span className="text-[8px] mt-0.5 opacity-70">
                            {dateIsWeekday ? 'School' : 'Public'}
                          </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 pt-6 border-t border-[#0A1128]/10">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-[#034078]/20 border border-[#034078]/40"></div>
                                <span className="text-xs text-[#0A1128]/70">Weekday (School)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-[#1282A2]/20 border border-[#1282A2]/40"></div>
                                <span className="text-xs text-[#0A1128]/70">Weekend (Public)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Time & Language Selection */}
                    <div className="space-y-6">
                        {/* Show Time Selection */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-[#1282A2]" />
                                <h3 className="font-bold text-[#0A1128]">Select Show Time</h3>
                            </div>

                            <div className="space-y-3">
                                {showTimes.map(show => (
                                    <button
                                        key={show.id}
                                        onClick={() => setSelectedTime(show.id)}
                                        disabled={!selectedDate}
                                        className={`
                      w-full p-4 rounded-lg border-2 transition-all text-left
                      ${!selectedDate
                                            ? 'border-[#0A1128]/10 bg-[#0A1128]/5 text-[#0A1128]/40 cursor-not-allowed'
                                            : selectedTime === show.id
                                                ? 'border-[#1282A2] bg-[#1282A2]/10 shadow-md'
                                                : 'border-[#0A1128]/20 hover:border-[#1282A2] hover:bg-[#1282A2]/5'
                                        }
                    `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-[#0A1128]">{show.time}</p>
                                                <p className="text-sm text-[#0A1128]/60">{show.label}</p>
                                            </div>
                                            {selectedTime === show.id && (
                                                <div className="w-6 h-6 rounded-full bg-[#1282A2] flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs text-[#0A1128]/50 mt-4 text-center">
                                Duration: 45 minutes
                            </p>
                        </div>

                        {/* Language Selection (Weekdays Only) */}
                        {selectedDate && isWeekday(selectedDate) && (
                            <div className="bg-white rounded-lg shadow-lg p-6 animate-in fade-in duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <Globe className="w-5 h-5 text-[#034078]" />
                                    <h3 className="font-bold text-[#0A1128]">Select Language</h3>
                                    <span className="text-xs px-2 py-0.5 bg-[#034078]/10 text-[#034078] rounded-full">
                    Weekday Only
                  </span>
                                </div>

                                <div className="space-y-2">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.id}
                                            onClick={() => setSelectedLanguage(lang.id)}
                                            className={`
                        w-full p-3 rounded-lg border-2 transition-all text-left
                        ${selectedLanguage === lang.id
                                                ? 'border-[#034078] bg-[#034078]/10 shadow-md'
                                                : 'border-[#0A1128]/20 hover:border-[#034078] hover:bg-[#034078]/5'
                                            }
                      `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{lang.icon}</span>
                                                    <span className="font-medium text-[#0A1128]">{lang.name}</span>
                                                </div>
                                                {selectedLanguage === lang.id && (
                                                    <div className="w-5 h-5 rounded-full bg-[#034078] flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Full Width */}
                {selectedDate && (
                    <div className="grid lg:grid-cols-2 gap-6 mt-8">
                        {/* Chat/Customization Option - Available for All Users */}
                        <div className={`rounded-lg shadow-lg p-6 text-white animate-in fade-in duration-300 border-2 ${
                            isWeekday(selectedDate)
                                ? 'bg-gradient-to-br from-[#034078] to-[#001F54] border-[#1282A2]/30'
                                : 'bg-gradient-to-br from-[#1282A2] to-[#034078] border-[#034078]/30'
                        }`}>
                            <div className="flex items-start gap-3 mb-4">
                                <div className="bg-[#1282A2] p-2 rounded-lg">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white">
                                            {isWeekday(selectedDate) ? 'Need Customization?' : 'Have Questions?'}
                                        </h3>
                                        <span className="text-xs px-2 py-0.5 bg-[#1282A2]/30 text-white rounded-full border border-[#1282A2]/50">
                      {isWeekday(selectedDate) ? 'School Groups' : 'Chat Support'}
                    </span>
                                    </div>
                                    <p className="text-sm text-white/80 mb-3">
                                        {isWeekday(selectedDate)
                                            ? 'Customize your educational experience with our team'
                                            : 'Chat with our team for assistance or special requests'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
                                <p className="text-xs text-white/90 mb-2 font-medium">
                                    {isWeekday(selectedDate) ? 'Available customizations:' : 'We can help with:'}
                                </p>
                                {isWeekday(selectedDate) ? (
                                    <ul className="text-xs text-white/80 space-y-1.5">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Tailored content for specific grade levels
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Integration with your curriculum objectives
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Extended Q&A sessions with educators
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Special group rates for large bookings
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Pre-show and post-show materials
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="text-xs text-white/80 space-y-1.5">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            General inquiries about shows and programs
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Group booking assistance and special rates
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Accessibility requirements and accommodations
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Birthday party and event planning
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#1282A2]"></div>
                                            Technical support and booking help
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    // Store current booking details before navigating to chat
                                    if (selectedDate) {
                                        sessionStorage.setItem('bookingDate', selectedDate.toISOString());
                                        sessionStorage.setItem('bookingTime', selectedTime || '');
                                        sessionStorage.setItem('bookingLanguage', selectedLanguage || '');
                                        sessionStorage.setItem('customizationRequest', isWeekday(selectedDate) ? 'true' : 'false');
                                    }
                                    navigate('/chat');
                                }}
                                className="w-full py-3 bg-white hover:bg-white/90 text-[#034078] rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Chat with Our Team
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <p className="text-xs text-white/60 text-center mt-3">
                                Or continue with standard booking
                            </p>
                        </div>

                        {/* Selected Details Summary & Actions */}
                        <div className="space-y-6">
                            {/* Selection Summary */}
                            <div className="bg-gradient-to-br from-[#0A1128] to-[#001F54] rounded-lg shadow-lg p-6 text-white">
                                <h3 className="font-bold mb-4">Your Selection</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                        <span className="text-white/70">Date</span>
                                        <span className="font-medium">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                        <span className="text-white/70">Program Type</span>
                                        <span className="font-medium">{isWeekday(selectedDate) ? 'School Program' : 'Public Program'}</span>
                                    </div>
                                    {selectedTime && (
                                        <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                            <span className="text-white/70">Show Time</span>
                                            <span className="font-medium">{showTimes.find(s => s.id === selectedTime)?.time}</span>
                                        </div>
                                    )}
                                    {selectedLanguage && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Language</span>
                                            <span className="font-medium">{languages.find(l => l.id === selectedLanguage)?.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Information Note */}
                            <div className="bg-[#1282A2]/10 border border-[#1282A2]/20 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-[#1282A2] mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-[#0A1128]/70 space-y-1">
                                        <p>• Weekday shows are tailored for school groups</p>
                                        <p>• Weekend shows are open to all ages</p>
                                        <p>• Each show is 45 minutes in duration</p>
                                        <p>• Seats can be selected on the next page</p>
                                    </div>
                                </div>
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={handleContinue}
                                disabled={!canContinue}
                                className={`
                  w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2
                  ${canContinue
                                    ? 'bg-[#1282A2] hover:bg-[#034078] text-white shadow-lg hover:shadow-xl'
                                    : 'bg-[#0A1128]/10 text-[#0A1128]/30 cursor-not-allowed'
                                }
                `}
                            >
                                Continue to Seat Selection
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            {!canContinue && (
                                <p className="text-xs text-center text-[#0A1128]/50">
                                    {!selectedTime && 'Please select a show time'}
                                    {selectedTime && isWeekday(selectedDate) && !selectedLanguage && 'Please select a language for weekday shows'}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}