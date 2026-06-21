import { useState, useEffect } from "react";
import { getUpcomingShows, type ShowDTO } from "../services/api";
import { Calendar, Clock, Users, Info, ChevronRight, Globe, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar.tsx";

interface SelectedShow {
    show: ShowDTO;
    time: string;
}

export default function ShowAvailability() {
    const [shows, setShows] = useState<ShowDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShow, setSelectedShow] = useState<SelectedShow | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUpcomingShows()
            .then(setShows)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSelectShow = (show: ShowDTO) => {
        if (show.availableSeats === 0) return;
        setSelectedShow({ show, time: show.showTime === 'morning' ? '10:00 AM' : '02:00 PM' });
    };

    const handleProceed = () => {
        if (selectedShow) {
            navigate('/seat-selection', {
                state: {
                    showId: selectedShow.show.id,
                    showDetails: {
                        date: selectedShow.show.showDate,
                        time: selectedShow.time,
                        language: selectedShow.show.language,
                        audienceType: selectedShow.show.audienceType,
                        grade: selectedShow.show.grade,
                        pricePerSeat: selectedShow.show.pricePerSeat,
                    }
                }
            });
        }
    };

    const getAvailabilityLabel = (show: ShowDTO): string => {
        if (show.availableSeats === 0) return 'Full';
        if (show.availableSeats <= 15) return 'Limited';
        return 'Available';
    };

    const getAvailabilityColor = (label: string) => {
        switch (label) {
            case 'Available': return 'text-[#1282A2] bg-[#1282A2]/10';
            case 'Limited': return 'text-orange-500 bg-orange-500/10';
            case 'Full': return 'text-gray-400 bg-gray-100';
            default: return '';
        }
    };

    const isSelected = (show: ShowDTO) => {
        return selectedShow?.show.id === show.id;
    };

    const isWeekend = (dateStr: string) => {
        const day = new Date(dateStr).getDay();
        return day === 0 || day === 6;
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return {
            day: d.getDate(),
            monthYear: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
        };
    };

    return (
        <div className="min-h-screen bg-[#FEFCFB]">
            <UserNavbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A1128] to-[#001F54] text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-8 h-8 text-[#1282A2]" />
                        <h1 className="text-3xl font-bold">Show Availability & Language Overview</h1>
                    </div>
                    <p className="text-gray-300 max-w-3xl">
                        Browse available planetarium show dates and times. Select your preferred date, show time, and language medium to proceed with your booking.
                    </p>
                </div>
            </div>

            {/* Information Notice */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-[#034078]/5 border border-[#034078]/20 rounded-lg p-6">
                    <div className="flex gap-4">
                        <Info className="w-6 h-6 text-[#034078] flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-[#0A1128] mb-2">Important Information</h3>
                            <ul className="text-sm text-[#001F54] space-y-2">
                                <li><span className="font-medium">Weekdays:</span> Reserved primarily for school programs with language-specific sessions (English, Sinhala, or Tamil).</li>
                                <li><span className="font-medium">Weekends:</span> Open to the general public with Standard Program presentations.</li>
                                <li><span className="font-medium">Show Times:</span> Two shows daily at 10:00 AM and 02:00 PM.</li>
                                <li><span className="font-medium">Availability:</span> Only dates and times with free seat slots are selectable.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Shows Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                {loading ? (
                    <div className="flex justify-center py-20 text-[#034078]">Loading shows...</div>
                ) : shows.length === 0 ? (
                    <div className="flex justify-center py-20 text-gray-400">No upcoming shows available.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shows.map((show) => {
                            const weekend = isWeekend(show.showDate);
                            const { day, monthYear, dayName } = formatDate(show.showDate);
                            const availLabel = getAvailabilityLabel(show);
                            const timeLabel = show.showTime === 'morning' ? '10:00 AM' : '02:00 PM';

                            return (
                                <div
                                    key={show.id}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Date Header */}
                                    <div className={`py-4 px-5 ${weekend ? 'bg-[#1282A2]/10' : 'bg-[#034078]/10'}`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-[#0A1128]">{day}</div>
                                                <div className="text-sm text-[#001F54] font-medium">{monthYear}</div>
                                                <div className="text-xs text-[#034078] mt-1">{dayName}</div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${weekend ? 'bg-[#1282A2] text-white' : 'bg-[#034078] text-white'}`}>
                                                {weekend ? 'Weekend' : 'Weekday'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Audience Type */}
                                    <div className="px-5 pt-4 pb-3 border-b border-gray-100">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-[#034078]" />
                                            <span className="font-medium text-[#001F54]">{show.audienceType}</span>
                                        </div>
                                    </div>

                                    {/* Show Time Slot */}
                                    <div className="p-5">
                                        <button
                                            onClick={() => handleSelectShow(show)}
                                            disabled={availLabel === 'Full'}
                                            className={`w-full text-left border rounded-lg p-4 transition-all ${isSelected(show)
                                                    ? 'border-[#1282A2] bg-[#1282A2]/5 shadow-md'
                                                    : availLabel === 'Full'
                                                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                                        : 'border-gray-200 hover:border-[#034078] hover:bg-[#034078]/5 cursor-pointer'
                                                }`}
                                        >
                                            {/* Time */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-[#034078]" />
                                                <span className="font-semibold text-[#0A1128]">{timeLabel}</span>
                                            </div>

                                            {/* Language */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <Globe className="w-4 h-4 text-[#001F54]" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-[#001F54]/60">Medium</span>
                                                    <span className="text-sm font-medium text-[#001F54]">{show.language}</span>
                                                </div>
                                            </div>

                                            {/* Grade (school programs only) */}
                                            {show.audienceType === 'School Program' && show.grade && (
                                                <div className="flex items-center gap-2 mb-3">
                                                    <GraduationCap className="w-4 h-4 text-[#034078]" />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-[#034078]/60">Reserved For</span>
                                                        <span className="text-sm font-semibold text-[#034078]">{show.grade}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Availability */}
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getAvailabilityColor(availLabel)}`}>
                                                    {availLabel}
                                                </span>
                                                {availLabel !== 'Full' && (
                                                    <span className="text-xs text-gray-500">{show.availableSeats} seats left</span>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selection Summary & Proceed Button */}
            {selectedShow && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-8">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Selected Date</div>
                                    <div className="font-semibold text-[#0A1128]">
                                        {new Date(selectedShow.show.showDate).toLocaleDateString('en-US', {
                                            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-gray-300"></div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Show Time</div>
                                    <div className="font-semibold text-[#0A1128]">{selectedShow.time}</div>
                                </div>
                                <div className="h-10 w-px bg-gray-300"></div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Language Medium</div>
                                    <div className="font-semibold text-[#0A1128]">{selectedShow.show.language}</div>
                                </div>
                                <div className="h-10 w-px bg-gray-300"></div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Program Type</div>
                                    <div className="font-semibold text-[#0A1128]">{selectedShow.show.audienceType}</div>
                                </div>
                                {selectedShow.show.audienceType === 'School Program' && selectedShow.show.grade && (
                                    <>
                                        <div className="h-10 w-px bg-gray-300"></div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Reserved For</div>
                                            <div className="font-semibold text-[#0A1128]">{selectedShow.show.grade}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={handleProceed}
                                className="bg-[#1282A2] hover:bg-[#034078] text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg"
                            >
                                Proceed to Booking
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}