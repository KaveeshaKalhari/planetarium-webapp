import { useState } from "react";
import { Calendar, Clock, Users, Info, ChevronRight, Globe, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar.tsx";

// Mock data for available shows
const generateAvailableShows = () => {
    const shows = [];
    const today = new Date();
    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'];

    for (let i = 0; i < 21; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Morning and afternoon shows
        const morningSlots = Math.floor(Math.random() * 3); // 0 = Full, 1 = Limited, 2 = Available
        const afternoonSlots = Math.floor(Math.random() * 3);

        shows.push({
            date: date,
            dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
            isWeekend,
            audienceType: isWeekend ? 'Public Program' : 'School Program',
            showTimes: [
                {
                    time: '10:00 AM',
                    language: isWeekend ? 'Standard Program' : ['English', 'Sinhala', 'Tamil'][i % 3],
                    availability: morningSlots === 0 ? 'Full' : morningSlots === 1 ? 'Limited' : 'Available',
                    slotsLeft: morningSlots === 0 ? 0 : morningSlots === 1 ? 15 : 45,
                    grade: isWeekend ? null : grades[i % grades.length] // Assign specific grade for school programs
                },
                {
                    time: '02:00 PM',
                    language: isWeekend ? 'Standard Program' : ['Tamil', 'English', 'Sinhala'][i % 3],
                    availability: afternoonSlots === 0 ? 'Full' : afternoonSlots === 1 ? 'Limited' : 'Available',
                    slotsLeft: afternoonSlots === 0 ? 0 : afternoonSlots === 1 ? 12 : 50,
                    grade: isWeekend ? null : grades[(i + 1) % grades.length] // Assign different grade for afternoon
                }
            ]
        });
    }

    return shows;
};

interface SelectedShow {
    date: Date;
    time: string;
    language: string;
    audienceType: string;
    grade?: string;
}

export default function ShowAvailability() {
    const [availableShows] = useState(generateAvailableShows());
    const [selectedShow, setSelectedShow] = useState<SelectedShow | null>(null);
    const navigate = useNavigate();

    const handleSelectShow = (show: any, showTime: any) => {
        if (showTime.availability === 'Full') return;

        setSelectedShow({
            date: show.date,
            time: showTime.time,
            language: showTime.language,
            audienceType: show.audienceType,
            grade: showTime.grade
        });
    };

    const handleProceed = () => {
        if (selectedShow) {
            // Navigate to seat selection with show details
            navigate('/seat-selection', {
                state: {
                    showDetails: {
                        date: selectedShow.date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        }),
                        time: selectedShow.time,
                        language: selectedShow.language,
                        audienceType: selectedShow.audienceType,
                        grade: selectedShow.grade
                    }
                }
            });
        }
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'Available':
                return 'text-[#1282A2] bg-[#1282A2]/10';
            case 'Limited':
                return 'text-orange-500 bg-orange-500/10';
            case 'Full':
                return 'text-gray-400 bg-gray-100';
            default:
                return '';
        }
    };

    const isSelected = (show: any, showTime: any) => {
        return selectedShow &&
            selectedShow.date.getTime() === show.date.getTime() &&
            selectedShow.time === showTime.time;
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableShows.map((show, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Date Header */}
                            <div className={`py-4 px-5 ${show.isWeekend ? 'bg-[#1282A2]/10' : 'bg-[#034078]/10'}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-[#0A1128]">
                                            {show.date.getDate()}
                                        </div>
                                        <div className="text-sm text-[#001F54] font-medium">
                                            {show.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-[#034078] mt-1">
                                            {show.dayName}
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${show.isWeekend ? 'bg-[#1282A2] text-white' : 'bg-[#034078] text-white'}`}>
                                        {show.isWeekend ? 'Weekend' : 'Weekday'}
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

                            {/* Show Times */}
                            <div className="p-5 space-y-3">
                                {show.showTimes.map((showTime, timeIdx) => (
                                    <button
                                        key={timeIdx}
                                        onClick={() => handleSelectShow(show, showTime)}
                                        disabled={showTime.availability === 'Full'}
                                        className={`w-full text-left border rounded-lg p-4 transition-all ${
                                            isSelected(show, showTime)
                                                ? 'border-[#1282A2] bg-[#1282A2]/5 shadow-md'
                                                : showTime.availability === 'Full'
                                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                                    : 'border-gray-200 hover:border-[#034078] hover:bg-[#034078]/5 cursor-pointer'
                                        }`}
                                    >
                                        {/* Time */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-[#034078]" />
                                            <span className="font-semibold text-[#0A1128]">{showTime.time}</span>
                                        </div>

                                        {/* Language Medium */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Globe className="w-4 h-4 text-[#001F54]" />
                                            <div className="flex flex-col">
                                                <span className="text-xs text-[#001F54]/60">Medium</span>
                                                <span className="text-sm font-medium text-[#001F54]">{showTime.language}</span>
                                            </div>
                                        </div>

                                        {/* Grade Info for School Programs */}
                                        {!show.isWeekend && showTime.grade && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <GraduationCap className="w-4 h-4 text-[#034078]" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-[#034078]/60">Reserved For</span>
                                                    <span className="text-sm font-semibold text-[#034078]">
                            {showTime.grade}
                          </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Availability Status */}
                                        <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getAvailabilityColor(showTime.availability)}`}>
                        {showTime.availability}
                      </span>
                                            {showTime.availability !== 'Full' && (
                                                <span className="text-xs text-gray-500">
                          {showTime.slotsLeft} seats left
                        </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selection Summary & Proceed Button */}
            {selectedShow && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between gap-6">
                            {/* Selection Summary */}
                            <div className="flex items-center gap-8">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Selected Date</div>
                                    <div className="font-semibold text-[#0A1128]">
                                        {selectedShow.date.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
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
                                    <div className="font-semibold text-[#0A1128]">{selectedShow.language}</div>
                                </div>
                                <div className="h-10 w-px bg-gray-300"></div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Program Type</div>
                                    <div className="font-semibold text-[#0A1128]">{selectedShow.audienceType}</div>
                                </div>
                                {selectedShow.audienceType === 'School Program' && selectedShow.grade && (
                                    <>
                                        <div className="h-10 w-px bg-gray-300"></div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Reserved For</div>
                                            <div className="font-semibold text-[#0A1128]">{selectedShow.grade}</div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Proceed Button */}
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