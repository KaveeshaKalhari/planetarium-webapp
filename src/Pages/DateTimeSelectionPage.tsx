import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Calendar as CalendarIcon, Clock, Info, Globe,
    ChevronLeft, ChevronRight, ArrowRight, MessageSquare, Sparkles,
    GraduationCap, MapPin, Phone, Mail, Users, FileText, X, AlertCircle,
} from 'lucide-react';
import { BookingStepper } from '../components/BookingStepper';
import { getUpcomingShows } from '../services/api';

interface ShowDTO {
    id: number; showDate: string; showTime: string; sessionType?: string;
    audienceType?: string; language?: string; title?: string; description?: string;
    totalSeats?: number; availableSeats?: number; pricePerSeat?: number;
    status?: string; duration?: number;
}

interface SchoolFormData {
    schoolName: string;
    schoolAddress: string;
    contactNumber: string;
    email: string;
    studentCount: string;
    gradeLevel: string;
    teacherName: string;
    otherInfo: string;
}

const emptySchoolForm: SchoolFormData = {
    schoolName: '', schoolAddress: '', contactNumber: '',
    email: '', studentCount: '', gradeLevel: '', teacherName: '', otherInfo: '',
};

export function DateTimeSelectionPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // If we arrived here via "← Back" from Seat Selection, this carries the
    // previously chosen show + school form so we can restore the selection.
    const incoming = location.state as { showId?: number; showDetails?: ShowDTO; schoolInfo?: SchoolFormData } | null;
    const incomingDate = incoming?.showDetails?.showDate
        ? new Date(`${incoming.showDetails.showDate}T00:00:00`)
        : null;

    const [selectedDate, setSelectedDate] = useState<Date | null>(incomingDate);
    const [selectedTime, setSelectedTime] = useState<string>(incoming?.showDetails?.showTime || '');
    const [selectedLanguage, setSelectedLanguage] = useState<string>(
        incoming?.showDetails?.language ? incoming.showDetails.language.toLowerCase() : ''
    );
    const [currentMonth, setCurrentMonth] = useState(incomingDate || new Date());
    const [loadingShows, setLoadingShows] = useState(false);
    const [noShowError, setNoShowError] = useState(false);
    const [availableShows, setAvailableShows] = useState<ShowDTO[]>([]);
    const [mounted, setMounted] = useState(false);
    const [calendarKey, setCalendarKey] = useState(0);

    // School form modal state
    const [showSchoolForm, setShowSchoolForm] = useState(false);
    const [schoolForm, setSchoolForm] = useState<SchoolFormData>(incoming?.schoolInfo || emptySchoolForm);
    const [schoolFormErrors, setSchoolFormErrors] = useState<Partial<SchoolFormData>>({});
    const [pendingShow, setPendingShow] = useState<ShowDTO | null>(null);

    useEffect(() => {
        setMounted(true);
        getUpcomingShows().then(setAvailableShows).catch(console.error);
    }, []);

    const toLocalDateString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const showTimes = [
        { id: 'morning', time: '10:00 AM', label: 'Morning Show' },
        { id: 'afternoon', time: '3:00 PM', label: 'Afternoon Show' }
    ];
    const languages = [
        { id: 'english', name: 'English', icon: '🇬🇧' },
        { id: 'sinhala', name: 'Sinhala', icon: '🇱🇰' },
        { id: 'tamil', name: 'Tamil', icon: '🇱🇰' }
    ];
    const gradeLevels = ['Grade 1-3', 'Grade 4-6', 'Grade 7-9', 'Grade 10-11', 'Grade 12-13', 'Mixed Grades'];

    const isWeekday = (date: Date) => { const d = date.getDay(); return d >= 1 && d <= 5; };
    const isWeekend = (date: Date) => { const d = date.getDay(); return d === 0 || d === 6; };
    const getDateSessionType = (date: Date): string => {
        const dateStr = toLocalDateString(date);
        const show = availableShows.find(s => s.showDate === dateStr);
        if (show?.sessionType) return show.sessionType;
        return isWeekday(date) ? 'SCHOOL' : 'PUBLIC_SINHALA';
    };
    const isSpecialDay = (date: Date): boolean => {
        const type = getDateSessionType(date);
        return type === 'PUBLIC_TAMIL' || type === 'PUBLIC_ENGLISH';
    };
    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const days: (Date | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let day = 1; day <= lastDay.getDate(); day++) days.push(new Date(year, month, day));
        return days;
    };
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date); setNoShowError(false);
        if (isWeekend(date)) setSelectedLanguage('');
    };

    // ── School form validation ──
    const validateSchoolForm = (): boolean => {
        const errors: Partial<SchoolFormData> = {};
        if (!schoolForm.schoolName.trim()) errors.schoolName = 'School name is required';
        if (!schoolForm.schoolAddress.trim()) errors.schoolAddress = 'Address is required';
        if (!schoolForm.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
        else if (!/^\+?[\d\s\-]{7,15}$/.test(schoolForm.contactNumber)) errors.contactNumber = 'Enter a valid phone number';
        if (!schoolForm.email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolForm.email)) errors.email = 'Enter a valid email address';
        if (!schoolForm.studentCount.trim()) errors.studentCount = 'Student count is required';
        else if (isNaN(Number(schoolForm.studentCount)) || Number(schoolForm.studentCount) < 1) errors.studentCount = 'Enter a valid number';
        if (!schoolForm.gradeLevel) errors.gradeLevel = 'Grade level is required';
        if (!schoolForm.teacherName.trim()) errors.teacherName = 'Teacher / contact name is required';
        setSchoolFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleContinue = async () => {
        if (!selectedDate) return;
        setLoadingShows(true); setNoShowError(false);
        try {
            const shows = await getUpcomingShows();
            const localDate = toLocalDateString(selectedDate);
            const match = shows.find(s => s.showDate === localDate && s.showTime === selectedTime);
            if (!match) { setNoShowError(true); return; }

            // If school session → show form first
            if (getDateSessionType(selectedDate) === 'SCHOOL') {
                setPendingShow(match);
                setShowSchoolForm(true);
            } else {
                navigate('/seat-selection', { state: { showId: match.id, showDetails: match } });
            }
        } catch { setNoShowError(true); }
        finally { setLoadingShows(false); }
    };

    const handleSchoolFormSubmit = () => {
        if (!validateSchoolForm()) return;
        if (!pendingShow) return;
        navigate('/seat-selection', {
            state: {
                showId: pendingShow.id,
                showDetails: pendingShow,
                schoolInfo: schoolForm,
            }
        });
    };

    const isSameDay = (d1: Date | null, d2: Date | null) => {
        if (!d1 || !d2) return false;
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    };
    const isPastDate = (date: Date) => { const t = new Date(); t.setHours(0, 0, 0, 0); return date < t; };
    const getDayLabel = (date: Date): string => {
        const type = getDateSessionType(date);
        switch (type) {
            case 'SCHOOL': return 'Sch'; case 'PUBLIC_TAMIL': return 'Tam';
            case 'PUBLIC_ENGLISH': return 'Eng'; default: return 'Pub';
        }
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const calendarDays = getCalendarDays();
    const isSchoolSession = selectedDate ? getDateSessionType(selectedDate) === 'SCHOOL' : false;
    const canContinue = selectedDate && selectedTime && (isWeekend(selectedDate) || selectedLanguage || isSchoolSession);

    const sf = (field: keyof SchoolFormData) => ({
        value: schoolForm[field],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setSchoolForm(prev => ({ ...prev, [field]: e.target.value }));
            if (schoolFormErrors[field]) setSchoolFormErrors(prev => ({ ...prev, [field]: '' }));
        },
    });

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#F0F6FA]">
            <style>{`
                @keyframes fadeSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes orbitGlow { 0%,100%{opacity:0.15} 50%{opacity:0.35} }
                @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
                @keyframes backdropIn { from{opacity:0} to{opacity:1} }
                .fade-up { animation: fadeSlideUp 0.4s ease both; }
                .modal-in { animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
                .backdrop-in { animation: backdropIn 0.2s ease both; }
            `}</style>

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-[#0A1128] via-[#001F54] to-[#034078] text-white relative overflow-hidden shrink-0">
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-white"
                            style={{
                                width: Math.random() * 2 + 0.5 + 'px', height: Math.random() * 2 + 0.5 + 'px',
                                top: Math.random() * 100 + '%', left: Math.random() * 100 + '%',
                                opacity: Math.random() * 0.4 + 0.1,
                                animation: `orbitGlow ${Math.random() * 3 + 2}s ease-in-out infinite`,
                                animationDelay: Math.random() * 3 + 's'
                            }} />
                    ))}
                </div>
                <div className={`max-w-7xl mx-auto px-6 py-3 relative z-10 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/user-home-page')}
                            className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 mr-2 transition-all active:scale-95"
                            title="Back to Home"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Back
                        </button>
                        <Sparkles className="w-3.5 h-3.5 text-[#219EBC]" />
                        <span className="text-xs font-semibold tracking-widest text-[#219EBC] uppercase">Step 1 of 4</span>
                        <span className="mx-3 text-white/20">|</span>
                        <h1 className="text-lg font-bold">Select Date &amp; Show Time</h1>
                        <span className="ml-2 text-white/50 text-xs hidden md:block">— your journey to the stars begins here</span>
                    </div>
                </div>
            </div>

            {/* ── Stepper ── */}
            <div className="shrink-0"><BookingStepper currentStep={1} /></div>

            {/* ── Main Content ── */}
            <div className={`flex-1 overflow-hidden transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="h-full max-w-7xl mx-auto px-4 py-3 grid grid-cols-12 gap-4">

                    {/* ── Calendar ── */}
                    <div className="col-span-4 bg-white rounded-xl shadow-sm border border-[#0A1128]/8 p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-[#0A1128] flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4 text-[#1282A2]" /> Select Date
                            </h2>
                            <div className="flex items-center gap-1 bg-[#0A1128]/5 rounded-lg p-0.5">
                                <button onClick={() => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)); setCalendarKey(k => k + 1); }}
                                    className="p-1 hover:bg-white rounded-md transition-all active:scale-95">
                                    <ChevronLeft className="w-3.5 h-3.5 text-[#0A1128]" />
                                </button>
                                <span className="text-xs font-semibold text-[#0A1128] px-2 min-w-[110px] text-center">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </span>
                                <button onClick={() => { setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)); setCalendarKey(k => k + 1); }}
                                    className="p-1 hover:bg-white rounded-md transition-all active:scale-95">
                                    <ChevronRight className="w-3.5 h-3.5 text-[#0A1128]" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-0.5 mb-1">
                            {dayNames.map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-[#0A1128]/40 py-1">{d}</div>
                            ))}
                        </div>

                        <div key={calendarKey} className="grid grid-cols-7 gap-0.5 flex-1">
                            {calendarDays.map((date, index) => {
                                if (!date) return <div key={`e-${index}`} />;
                                const isSelected = isSameDay(date, selectedDate);
                                const isPast = isPastDate(date);
                                const type = getDateSessionType(date);
                                const isSpecial = type === 'PUBLIC_TAMIL' || type === 'PUBLIC_ENGLISH';
                                const isToday = isSameDay(date, new Date());
                                const isSchool = type === 'SCHOOL';
                                return (
                                    <button key={index} onClick={() => !isPast && handleDateSelect(date)} disabled={isPast}
                                        className={`aspect-square rounded-lg text-[11px] font-semibold transition-all duration-150 relative flex flex-col items-center justify-center
                                            ${isPast ? 'text-[#0A1128]/15 cursor-not-allowed'
                                                : isSelected ? 'bg-[#1282A2] text-white shadow-md scale-105 z-10'
                                                    : isSchool ? 'bg-[#034078]/8 text-[#0A1128] hover:bg-[#034078]/20 border border-[#034078]/15'
                                                        : isSpecial ? 'bg-purple-100 text-[#0A1128] hover:bg-purple-200 border border-purple-300'
                                                            : 'bg-[#1282A2]/8 text-[#0A1128] hover:bg-[#1282A2]/20 border border-[#1282A2]/15'}`}>
                                        <span className={isToday && !isSelected ? 'text-[#1282A2] font-extrabold' : ''}>{date.getDate()}</span>
                                        {!isPast && !isSelected && <span className="text-[7px] opacity-50 leading-none">{getDayLabel(date)}</span>}
                                        {isToday && !isSelected && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1282A2]" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-[#0A1128]/8 flex-wrap">
                            {[
                                { bg: 'bg-[#034078]/15 border border-[#034078]/30', label: 'School' },
                                { bg: 'bg-[#1282A2]/15 border border-[#1282A2]/30', label: 'Public' },
                                { bg: 'bg-purple-100 border border-purple-300', label: 'Special' },
                            ].map(l => (
                                <div key={l.label} className="flex items-center gap-1">
                                    <div className={`w-2.5 h-2.5 rounded ${l.bg}`} />
                                    <span className="text-[10px] text-[#0A1128]/60">{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Show Time + Language ── */}
                    <div className="col-span-3 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: 'School', sub: 'Mon–Fri', bg: 'bg-[#034078]/8', border: 'border-[#034078]' },
                                { label: 'Public', sub: 'Weekends', bg: 'bg-[#1282A2]/8', border: 'border-[#1282A2]' },
                                { label: 'Tamil', sub: '2nd Sat AM', bg: 'bg-purple-50', border: 'border-purple-400' },
                                { label: 'English', sub: '2nd Sat PM', bg: 'bg-emerald-50', border: 'border-emerald-400' },
                            ].map(s => (
                                <div key={s.label} className={`${s.bg} border-l-2 ${s.border} p-2 rounded-lg flex items-center gap-2`}>
                                    <div>
                                        <p className="font-bold text-[#0A1128] text-[11px]">{s.label}</p>
                                        <p className="text-[10px] text-[#0A1128]/50">{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-[#0A1128]/8 p-3 flex-1">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Clock className="w-3.5 h-3.5 text-[#1282A2]" />
                                <h3 className="font-bold text-[#0A1128] text-sm">Show Time</h3>
                                <span className="text-[10px] text-[#0A1128]/40 ml-auto">45 min</span>
                            </div>
                            <div className="space-y-2">
                                {showTimes.map(show => {
                                    const sessionType = selectedDate ? getDateSessionType(selectedDate) : '';
                                    const isLockedOut = (sessionType === 'PUBLIC_TAMIL' && show.id === 'afternoon') || (sessionType === 'PUBLIC_ENGLISH' && show.id === 'morning');
                                    const isActive = selectedTime === show.id;
                                    return (
                                        <button key={show.id}
                                            onClick={() => { if (!isLockedOut) { setSelectedTime(show.id); setNoShowError(false); } }}
                                            disabled={!selectedDate || isLockedOut}
                                            className={`w-full p-2.5 rounded-lg border-2 transition-all duration-150 text-left flex items-center justify-between
                                                ${!selectedDate || isLockedOut ? 'border-[#0A1128]/8 bg-[#0A1128]/4 text-[#0A1128]/30 cursor-not-allowed'
                                                    : isActive ? 'border-[#1282A2] bg-[#1282A2]/8 shadow-sm'
                                                        : 'border-[#0A1128]/10 hover:border-[#1282A2]/50 hover:bg-[#1282A2]/4'}`}>
                                            <div className="flex items-center gap-2">
                                                {/* emoji removed */}
                                                <div>
                                                    <p className={`font-bold text-xs ${!selectedDate || isLockedOut ? 'text-[#0A1128]/30' : 'text-[#0A1128]'}`}>{show.time}</p>
                                                    <p className={`text-[10px] ${!selectedDate || isLockedOut ? 'text-[#0A1128]/20' : 'text-[#0A1128]/60'}`}>{show.label}</p>
                                                </div>
                                            </div>
                                            {isActive && <div className="w-4 h-4 rounded-full bg-[#1282A2] flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedDate && isWeekday(selectedDate) && !isSchoolSession && (
                            <div className="bg-white rounded-xl shadow-sm border border-[#0A1128]/8 p-3 fade-up">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Globe className="w-3.5 h-3.5 text-[#034078]" />
                                    <h3 className="font-bold text-[#0A1128] text-sm">Language</h3>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-[#034078]/10 text-[#034078] rounded-full ml-auto">Weekday</span>
                                </div>
                                <div className="space-y-1.5">
                                    {languages.map(lang => (
                                        <button key={lang.id} onClick={() => setSelectedLanguage(lang.id)}
                                            className={`w-full p-2 rounded-lg border-2 transition-all duration-150 text-left flex items-center justify-between
                                                ${selectedLanguage === lang.id ? 'border-[#034078] bg-[#034078]/8'
                                                    : 'border-[#0A1128]/10 hover:border-[#034078]/40 hover:bg-[#034078]/4'}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{lang.icon}</span>
                                                <span className="font-medium text-[#0A1128] text-xs">{lang.name}</span>
                                            </div>
                                            {selectedLanguage === lang.id && <div className="w-3.5 h-3.5 rounded-full bg-[#034078] flex items-center justify-center"><svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* School session badge */}
                        {isSchoolSession && (
                            <div className="bg-gradient-to-br from-[#034078]/10 to-[#034078]/5 border border-[#034078]/30 rounded-xl p-3 fade-up flex items-start gap-2">
                                <GraduationCap className="w-4 h-4 text-[#034078] mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold text-[#034078] text-xs">School Program Selected</p>
                                    <p className="text-[10px] text-[#034078]/70 mt-0.5">You'll fill in school details before proceeding to seat selection.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right: Summary + CTA ── */}
                    <div className="col-span-5 flex flex-col gap-3">

                        {selectedDate && isSpecialDay(selectedDate) && (
                            <div className="border border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 flex items-start gap-2 fade-up">
                                <div className="bg-purple-500 p-1.5 rounded-lg shrink-0"><Sparkles className="w-3 h-3 text-white" /></div>
                                <div>
                                    <p className="font-bold text-purple-900 text-xs">Special Language Session</p>
                                    <p className="text-[10px] text-purple-700 mt-0.5">
                                        {getDateSessionType(selectedDate) === 'PUBLIC_TAMIL' ? '🌐 Tamil Medium — Morning (10:00 AM)' : '🌐 English Medium — Afternoon (3:00 PM)'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedDate ? (
                            <div className="bg-gradient-to-br from-[#0A1128] to-[#001F54] rounded-xl shadow-lg p-4 text-white flex-1">
                                <h3 className="font-bold mb-3 text-[10px] tracking-widest uppercase text-white/50">Your Selection</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Date', value: selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) },
                                        { label: 'Program', value: getDateSessionType(selectedDate) === 'SCHOOL' ? '🎓 School Program' : getDateSessionType(selectedDate) === 'PUBLIC_TAMIL' ? 'Public — Tamil' : getDateSessionType(selectedDate) === 'PUBLIC_ENGLISH' ? 'Public — English' : 'Public — Sinhala' },
                                        ...(selectedTime ? [{ label: 'Time', value: showTimes.find(s => s.id === selectedTime)?.time || '' }] : []),
                                        ...(selectedLanguage ? [{ label: 'Language', value: languages.find(l => l.id === selectedLanguage)?.name || '' }] : []),
                                    ].map((row, i, arr) => (
                                        <div key={row.label} className={`flex justify-between items-start py-2 ${i < arr.length - 1 ? 'border-b border-white/10' : ''}`}>
                                            <span className="text-white/50 text-xs">{row.label}</span>
                                            <span className="font-semibold text-xs text-right max-w-[55%]">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                                {isSchoolSession && (
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <div className="flex items-center gap-1.5 text-[#219EBC] text-[10px]">
                                            <FileText className="w-3 h-3" />
                                            <span>School registration form required before seat selection</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-[#0A1128]/5 rounded-xl border-2 border-dashed border-[#0A1128]/15 flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <CalendarIcon className="w-8 h-8 text-[#0A1128]/20 mx-auto mb-2" />
                                    <p className="text-xs text-[#0A1128]/35">Select a date to see your booking summary</p>
                                </div>
                            </div>
                        )}

                        {selectedDate && isWeekday(selectedDate) && (
                            <div className="rounded-xl p-3 text-white bg-gradient-to-br from-[#034078] to-[#001F54] border border-[#1282A2]/20 shadow-md fade-up">
                                <div className="flex items-start gap-2 mb-2">
                                    <div className="bg-[#1282A2] p-1.5 rounded-lg shrink-0"><MessageSquare className="w-3.5 h-3.5 text-white" /></div>
                                    <div>
                                        <h3 className="font-bold text-white text-xs">Need a Custom School Session?</h3>
                                        <p className="text-[10px] text-white/60">Tailor content for your grade level</p>
                                    </div>
                                </div>
                                <button onClick={() => navigate('/chat')}
                                    className="w-full py-2 bg-white hover:bg-[#E8F4F8] text-[#034078] rounded-lg font-bold transition-all duration-150 flex items-center justify-center gap-1.5 text-xs">
                                    <MessageSquare className="w-3 h-3" /> Chat with Our Team <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        <div className="bg-[#1282A2]/8 border border-[#1282A2]/20 rounded-xl p-3">
                            <div className="flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 text-[#1282A2] mt-0.5 shrink-0" />
                                <ul className="text-[10px] text-[#0A1128]/60 space-y-1">
                                    <li>Weekday shows are tailored for school groups</li>
                                    <li>Weekend shows are open to all ages • 45 min duration</li>
                                    <li>Special Tamil &amp; English sessions on 2nd Sat &amp; 4th Sun</li>
                                </ul>
                            </div>
                        </div>

                        <button onClick={handleContinue} disabled={!canContinue || loadingShows}
                            className={`w-full py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm
                                ${canContinue && !loadingShows
                                    ? 'bg-gradient-to-r from-[#1282A2] to-[#219EBC] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                                    : 'bg-[#0A1128]/8 text-[#0A1128]/25 cursor-not-allowed'}`}>
                            {loadingShows ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Checking…</>)
                                : isSchoolSession
                                    ? (<>Fill School Details <ArrowRight className="w-4 h-4" /></>)
                                    : (<>Continue to Seat Selection <ArrowRight className="w-4 h-4" /></>)}
                        </button>

                        {noShowError && <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600 text-center">No show available for this slot. Please try another.</div>}
                        {!canContinue && !noShowError && <p className="text-[10px] text-center text-[#0A1128]/40">
                            {!selectedDate ? 'Select a date' : !selectedTime ? 'Select a show time' : selectedDate && isWeekday(selectedDate) && !selectedLanguage && !isSchoolSession ? 'Select a language' : ''}
                        </p>}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════
                School Registration Modal
            ═══════════════════════════════════════════════ */}
            {showSchoolForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-in"
                    style={{ backgroundColor: 'rgba(10,17,40,0.75)', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowSchoolForm(false); }}>

                    <div className="modal-in bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#034078] to-[#1282A2] rounded-t-2xl px-6 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-base">School Registration</h2>
                                    <p className="text-white/60 text-xs">Please fill in your school details to continue</p>
                                </div>
                            </div>
                            <button onClick={() => setShowSchoolForm(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-5 space-y-4">

                            {/* Row 1: School Name + Contact Number */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-[#0A1128]/70 uppercase tracking-wide flex items-center gap-1 mb-1">
                                        <GraduationCap className="w-3 h-3 text-[#1282A2]" /> School Name <span className="text-red-400">*</span>
                                    </label>
                                    <input type="text" placeholder="e.g. Royal College Colombo" {...sf('schoolName')}
                                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 outline-none transition-colors bg-[#F8FAFC] placeholder:text-[#0A1128]/30
                                            ${schoolFormErrors.schoolName ? 'border-red-400 bg-red-50' : schoolForm.schoolName ? 'border-[#1282A2]/50 bg-white' : 'border-[#E2E8F0] focus:border-[#1282A2]'}`} />
                                    {schoolFormErrors.schoolName && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{schoolFormErrors.schoolName}</p>}
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-[#0A1128]/70 uppercase tracking-wide flex items-center gap-1 mb-1">
                                        <Phone className="w-3 h-3 text-[#1282A2]" /> Contact Number <span className="text-red-400">*</span>
                                    </label>
                                    <input type="tel" placeholder="e.g. +94 11 234 5678" {...sf('contactNumber')}
                                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 outline-none transition-colors bg-[#F8FAFC] placeholder:text-[#0A1128]/30
                                            ${schoolFormErrors.contactNumber ? 'border-red-400 bg-red-50' : schoolForm.contactNumber ? 'border-[#1282A2]/50 bg-white' : 'border-[#E2E8F0] focus:border-[#1282A2]'}`} />
                                    {schoolFormErrors.contactNumber && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{schoolFormErrors.contactNumber}</p>}
                                </div>
                            </div>

                            {/* Row 2: School Address */}
                            <div>
                                <label className="text-[11px] font-semibold text-[#0A1128]/70 uppercase tracking-wide flex items-center gap-1 mb-1">
                                    <MapPin className="w-3 h-3 text-[#1282A2]" /> School Address <span className="text-red-400">*</span>
                                </label>
                                <input type="text" placeholder="Full address of the school" {...sf('schoolAddress')}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border-2 outline-none transition-colors bg-[#F8FAFC] placeholder:text-[#0A1128]/30
                                        ${schoolFormErrors.schoolAddress ? 'border-red-400 bg-red-50' : schoolForm.schoolAddress ? 'border-[#1282A2]/50 bg-white' : 'border-[#E2E8F0] focus:border-[#1282A2]'}`} />
                                {schoolFormErrors.schoolAddress && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{schoolFormErrors.schoolAddress}</p>}
                            </div>

                            {/* Row 3: Email + Teacher Name */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-[#0A1128]/70 uppercase tracking-wide flex items-center gap-1 mb-1">
                                        <Mail className="w-3 h-3 text-[#1282A2]" /> Email <span className="text-red-400">*</span>
                                    </label>
                                    <input type="email" placeholder="school@example.com" {...sf('email')}
                                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 outline-none transition-colors bg-[#F8FAFC] placeholder:text-[#0A1128]/30
                                            ${schoolFormErrors.email ? 'border-red-400 bg-red-50' : schoolForm.email ? 'border-[#1282A2]/50 bg-white' : 'border-[#E2E8F0] focus:border-[#1282A2]'}`} />
                                    {schoolFormErrors.email && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{schoolFormErrors.email}</p>}
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-[#0A1128]/70 uppercase tracking-wide flex items-center gap-1 mb-1">
                                        <Users className="w-3 h-3 text-[#1282A2]" /> Teacher / In-charge <span className="text-red-400">*</span>
                                    </label>
                                    <input type="text" placeholder="e.g. Mrs. Perera" {...sf('teacherName')}
                                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 outline-none transition-colors bg-[#F8FAFC] placeholder:text-[#0A1128]/30
                                            ${schoolFormErrors.teacherName ? 'border-red-400 bg-red-50' : schoolForm.teacherName ? 'border-[#1282A2]/50 bg-white' : 'border-[#E2E8F0] focus:border-[#1282A2]'}`} />
                                    {schoolFormErrors.teacherName && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{schoolFormErrors.teacherName}</p>}
                                </div>
                            </div>

                            {/* Row 4: Student Count + Grade Level */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-[#0A1128]/70 uppercase tracking-wide flex items-center gap-1 mb-1">
                                        <Users className="w-3 h-3 text-[#1282A2]" /> Student Count <span className="text-red-400">*</span>
                                    </label>
                                    <input type="number" min="1" placeholder="e.g. 40" {...sf('studentCount')}
                                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 outline-none transition-colors bg-[#F8FAFC] placeholder:text-[#0A1128]/30
                                            ${schoolFormErrors.studentCount ? 'border-red-400 bg-red-50' : schoolForm.studentCount ? 'border-[#1282A2]/50 bg-white' : 'border-[#E2E8F0] focus:border-[#1282A2]'}`} />
                                    {schoolFormErrors.studentCount && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{schoolFormErrors.studentCount}</p>}
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-[#0A1128]/70 uppercase tracking-wide flex items-center gap-1 mb-1">
                                        <GraduationCap className="w-3 h-3 text-[#1282A2]" /> Grade Level <span className="text-red-400">*</span>
                                    </label>
                                    <select value={schoolForm.gradeLevel}
                                        onChange={e => { setSchoolForm(prev => ({ ...prev, gradeLevel: e.target.value })); if (schoolFormErrors.gradeLevel) setSchoolFormErrors(prev => ({ ...prev, gradeLevel: '' })); }}
                                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 outline-none transition-colors bg-[#F8FAFC]
                                            ${schoolFormErrors.gradeLevel ? 'border-red-400 bg-red-50' : schoolForm.gradeLevel ? 'border-[#1282A2]/50 bg-white' : 'border-[#E2E8F0] focus:border-[#1282A2]'}`}>
                                        <option value="">Select grade level</option>
                                        {gradeLevels.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    {schoolFormErrors.gradeLevel && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{schoolFormErrors.gradeLevel}</p>}
                                </div>
                            </div>

                            {/* Row 5: Other Info */}
                            <div>
                                <label className="text-[11px] font-semibold text-[#0A1128]/70 uppercase tracking-wide flex items-center gap-1 mb-1">
                                    <FileText className="w-3 h-3 text-[#1282A2]" /> Other Information <span className="text-[#0A1128]/35 font-normal normal-case tracking-normal">(optional)</span>
                                </label>
                                <textarea placeholder="Special requirements, accessibility needs, curriculum topic focus, etc." rows={3}
                                    value={schoolForm.otherInfo}
                                    onChange={e => setSchoolForm(prev => ({ ...prev, otherInfo: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#E2E8F0] focus:border-[#1282A2] outline-none transition-colors bg-[#F8FAFC] placeholder:text-[#0A1128]/30 resize-none" />
                            </div>

                            {/* Notice */}
                            <div className="bg-[#EFF6FF] border border-[#BAE6FD] rounded-lg p-3 flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 text-[#1282A2] shrink-0 mt-0.5" />
                                <p className="text-[10px] text-[#0A1128]/70">
                                    School details help us tailor the show experience for your students. This information will be shared with our education team. <span className="text-red-400">*</span> Required fields.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-4 border-t border-[#E2E8F0] flex gap-3 shrink-0 rounded-b-2xl bg-[#F8FAFC]">
                            <button onClick={() => setShowSchoolForm(false)}
                                className="flex-1 py-2.5 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-xl transition-all duration-150 font-semibold text-sm">
                                Cancel
                            </button>
                            <button onClick={handleSchoolFormSubmit}
                                className="flex-1 py-2.5 bg-gradient-to-r from-[#1282A2] to-[#219EBC] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2">
                                <GraduationCap className="w-4 h-4" /> Proceed to Seat Selection <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}