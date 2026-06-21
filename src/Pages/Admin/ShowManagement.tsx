import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, X, Monitor } from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShowDTO {
    id?: number;
    title: string;
    description: string;
    showDate: string;
    showTime: string;        // "morning" | "afternoon"
    sessionType: string;     // "SCHOOL" | "PUBLIC_SINHALA" | "PUBLIC_TAMIL" | "PUBLIC_ENGLISH"
    audienceType: string;    // "School Program" | "Public Program"
    language: string;        // "Sinhala" | "Tamil" | "English"
    grade?: string;
    programType?: string;
    totalSeats: number;
    availableSeats?: number;
    pricePerSeat: number;
    duration: number;
    status: string;
}

const SESSION_TYPES = [
    { value: 'SCHOOL', label: 'School Session', audience: 'School Program', language: 'Sinhala' },
    { value: 'PUBLIC_SINHALA', label: 'Public — Sinhala Medium', audience: 'Public Program', language: 'Sinhala' },
    { value: 'PUBLIC_TAMIL', label: 'Public — Tamil Medium', audience: 'Public Program', language: 'Tamil' },
    { value: 'PUBLIC_ENGLISH', label: 'Public — English Medium', audience: 'Public Program', language: 'English' },
];

const emptyForm = (): ShowDTO => ({
    title: '', description: '', showDate: '', showTime: 'morning',
    sessionType: '', audienceType: '', language: '', grade: '',
    programType: '', totalSeats: 224, pricePerSeat: 150, duration: 45, status: 'UPCOMING',
});

// School sessions: Rs. 150/seat — Public sessions (any medium): Rs. 250/seat
const priceForSessionType = (sessionType: string): number =>
    sessionType === 'SCHOOL' ? 150 : 250;

// ─── Date rule helpers ────────────────────────────────────────────────────────

function getWeekOfMonth(dateStr: string): number {
    const d = new Date(dateStr);
    return Math.floor((d.getDate() - 1) / 7) + 1;
}

function getDayOfWeek(dateStr: string): number {
    return new Date(dateStr).getDay(); // 0=Sun, 1=Mon, 6=Sat
}

function validateDateForSession(sessionType: string, showDate: string, showTime: string): string {
    if (!sessionType || !showDate) return '';
    const day = getDayOfWeek(showDate);
    const week = getWeekOfMonth(showDate);
    const isWeekend = day === 0 || day === 6;
    const isSat = day === 6;
    const isSun = day === 0;

    switch (sessionType) {
        case 'SCHOOL':
            if (isWeekend) return 'School sessions must be on weekdays (Mon–Fri).';
            break;
        case 'PUBLIC_SINHALA':
            if (!isWeekend) return 'Public Sinhala sessions must be on a Saturday or Sunday.';
            if (isSat && week === 2) return '2nd Saturday is reserved for Tamil & English sessions.';
            if (isSun && week === 4) return '4th Sunday is reserved for Tamil & English sessions.';
            break;
        case 'PUBLIC_TAMIL':
            if (!(isSat && week === 2) && !(isSun && week === 4))
                return 'Tamil sessions must be on 2nd Saturday or 4th Sunday.';
            if (showTime !== 'morning') return 'Tamil sessions must be the morning slot.';
            break;
        case 'PUBLIC_ENGLISH':
            if (!(isSat && week === 2) && !(isSun && week === 4))
                return 'English sessions must be on 2nd Saturday or 4th Sunday.';
            if (showTime !== 'afternoon') return 'English sessions must be the afternoon slot.';
            break;
    }
    return '';
}

// ─── Session type badge color ─────────────────────────────────────────────────

function sessionBadge(sessionType: string) {
    switch (sessionType) {
        case 'SCHOOL': return 'bg-blue-100 text-blue-800';
        case 'PUBLIC_SINHALA': return 'bg-yellow-100 text-yellow-800';
        case 'PUBLIC_TAMIL': return 'bg-purple-100 text-purple-800';
        case 'PUBLIC_ENGLISH': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-700';
    }
}

function sessionLabel(sessionType: string) {
    return SESSION_TYPES.find(s => s.value === sessionType)?.label ?? sessionType;
}

// ─── API calls ────────────────────────────────────────────────────────────────

const BASE = 'http://localhost:8080/api/v1/shows';
const authHeader = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('authToken')}`
});
async function apiGetAll(): Promise<ShowDTO[]> {
    const res = await fetch(`${BASE}/admin/all`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch shows');
    return res.json();
}
async function apiCreate(dto: ShowDTO): Promise<ShowDTO> {
    const res = await fetch(`${BASE}/admin`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(dto),
    });
    const text = await res.text();                          // ← read as text first
    if (!res.ok) {
        const msg = text ? JSON.parse(text).message : `Error ${res.status}`;
        throw new Error(msg || 'Failed to create show');
    }
    return text ? JSON.parse(text) : dto;                   // ← safe parse
}

async function apiUpdate(id: number, dto: ShowDTO): Promise<ShowDTO> {
    const res = await fetch(`${BASE}/admin/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(dto),
    });
    const text = await res.text();
    if (!res.ok) {
        const msg = text ? JSON.parse(text).message : `Error ${res.status}`;
        throw new Error(msg || 'Failed to update show');
    }
    return text ? JSON.parse(text) : dto;
}

async function apiDelete(id: number): Promise<void> {
    await fetch(`${BASE}/admin/${id}`, { method: 'DELETE', headers: authHeader() });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShowManagement() {
    const [shows, setShows] = useState<ShowDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShow, setEditingShow] = useState<ShowDTO | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<ShowDTO | null>(null);
    const [form, setForm] = useState<ShowDTO>(emptyForm());
    const [dateError, setDateError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [filterSession, setFilterSession] = useState('ALL');

    useEffect(() => {
        apiGetAll().then(setShows).catch(console.error).finally(() => setLoading(false));
    }, []);

    const openAdd = () => {
        setEditingShow(null);
        setForm(emptyForm());
        setDateError('');
        setSubmitError('');
        setShowModal(true);
    };

    const openEdit = (show: ShowDTO) => {
        setEditingShow(show);
        setForm({
            ...show,
            showDate: show.showDate ? String(show.showDate) : '',
        });
        setDateError('');
        setSubmitError('');
        setShowModal(true);
    };

    const handleSessionTypeChange = (sessionType: string) => {
        const meta = SESSION_TYPES.find(s => s.value === sessionType);
        // Auto-lock time for Tamil/English
        const showTime =
            sessionType === 'PUBLIC_TAMIL' ? 'morning' :
                sessionType === 'PUBLIC_ENGLISH' ? 'afternoon' :
                    form.showTime;
        // School sessions: Rs. 150/seat — Public sessions (any medium): Rs. 250/seat
        const pricePerSeat = sessionType ? priceForSessionType(sessionType) : form.pricePerSeat;
        const next = {
            ...form,
            sessionType,
            audienceType: meta?.audience ?? '',
            language: meta?.language ?? '',
            showTime,
            pricePerSeat,
        };
        setForm(next);
        setDateError(validateDateForSession(sessionType, next.showDate, next.showTime));
    };

    const handleDateChange = (showDate: string) => {
        const next = { ...form, showDate };
        setForm(next);
        setDateError(validateDateForSession(next.sessionType, showDate, next.showTime));
    };

    const handleTimeChange = (showTime: string) => {
        const next = { ...form, showTime };
        setForm(next);
        setDateError(validateDateForSession(next.sessionType, next.showDate, showTime));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateDateForSession(form.sessionType, form.showDate, form.showTime);
        if (err) { setDateError(err); return; }
        setSubmitError('');
        try {
            if (editingShow?.id) {
                const updated = await apiUpdate(editingShow.id, form);
                setShows(prev => prev.map(s => s.id === editingShow.id ? updated : s));
            } else {
                const created = await apiCreate(form);
                setShows(prev => [...prev, created]);
            }
            setShowModal(false);
        } catch (err: unknown) {
            setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
        }
    };

    const confirmDeleteAction = async () => {
        if (!confirmDelete?.id) return;
        await apiDelete(confirmDelete.id);
        setShows(prev => prev.filter(s => s.id !== confirmDelete.id));
        setConfirmDelete(null);
    };

    const filtered = filterSession === 'ALL' ? shows : shows.filter(s => s.sessionType === filterSession);

    // Tamil/English time is locked — disable the time selector
    const timeIsLocked = form.sessionType === 'PUBLIC_TAMIL' || form.sessionType === 'PUBLIC_ENGLISH';
    // School sessions need grade field
    const isSchool = form.sessionType === 'SCHOOL';

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0A1128] mb-1">Show Management</h1>
                        <p className="text-[#0A1128]/70">Manage all planetarium show sessions</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-lg transition-colors font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Show
                    </button>
                </div>

                {/* Schedule legend */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'School Session', sub: 'Weekdays (Mon–Fri)', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                        { label: 'Public — Sinhala', sub: 'All weekends except special days', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
                        { label: 'Public — Tamil', sub: '2nd Sat & 4th Sun — Morning', color: 'bg-purple-50 border-purple-200 text-purple-800' },
                        { label: 'Public — English', sub: '2nd Sat & 4th Sun — Afternoon', color: 'bg-green-50 border-green-200 text-green-800' },
                    ].map(item => (
                        <div key={item.label} className={`p-3 rounded-lg border ${item.color}`}>
                            <p className="font-semibold text-sm">{item.label}</p>
                            <p className="text-xs opacity-75 mt-0.5">{item.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {['ALL', 'SCHOOL', 'PUBLIC_SINHALA', 'PUBLIC_TAMIL', 'PUBLIC_ENGLISH'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterSession(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterSession === f
                                ? 'bg-[#034078] text-white'
                                : 'bg-white text-[#0A1128] border border-[#0A1128]/20 hover:border-[#1282A2]'
                                }`}
                        >
                            {f === 'ALL' ? 'All Shows' : sessionLabel(f)}
                        </button>
                    ))}
                </div>

                {loading && <p className="text-center text-[#0A1128]/50 py-10">Loading shows...</p>}

                {/* Table */}
                {!loading && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#0A1128] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold w-72">Show</th>
                                    <th className="px-6 py-4 text-left font-semibold">Session Type</th>
                                    <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                                    <th className="px-6 py-4 text-left font-semibold">Seats</th>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-[#0A1128]/40">
                                            No shows found.
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((show, index) => (
                                    <tr
                                        key={show.id}
                                        className={`border-b border-[#0A1128]/10 hover:bg-[#FEFCFB] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#FEFCFB]/50'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-[#0A1128]">{show.title}</p>
                                            <p className="text-xs text-[#0A1128]/50 line-clamp-1 max-w-xs">{show.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sessionBadge(show.sessionType)}`}>
                                                {sessionLabel(show.sessionType)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-[#0A1128]">
                                                <Calendar className="w-3.5 h-3.5 text-[#1282A2]" />
                                                <span>{String(show.showDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-[#0A1128]/60 mt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{show.showTime === 'morning' ? '10:00 AM' : '03:00 PM'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#0A1128]">
                                            {show.availableSeats ?? show.totalSeats} / {show.totalSeats}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${show.status === 'UPCOMING' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {show.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openEdit(show)} className="p-2 hover:bg-[#034078]/10 rounded-md transition-colors" title="Edit">
                                                    <Edit className="w-4 h-4 text-[#034078]" />
                                                </button>
                                                <button onClick={() => setConfirmDelete(show)} className="p-2 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add / Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal header */}
                            <div className="sticky top-0 bg-white border-b border-[#0A1128]/10 px-8 py-5 flex justify-between items-center z-10">
                                <h2 className="text-2xl font-bold text-[#0A1128]">
                                    {editingShow ? 'Edit Show' : 'Add New Show'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#0A1128]/5 rounded-md transition-colors">
                                    <X className="w-5 h-5 text-[#0A1128]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">

                                {/* Session Type — first so other fields can auto-fill */}
                                <div>
                                    <Label className="text-[#0A1128] font-semibold">
                                        Session Type <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        {SESSION_TYPES.map(s => (
                                            <button
                                                key={s.value}
                                                type="button"
                                                onClick={() => handleSessionTypeChange(s.value)}
                                                className={`p-3 rounded-lg border-2 text-left transition-all ${form.sessionType === s.value
                                                    ? 'border-[#1282A2] bg-[#1282A2]/8'
                                                    : 'border-[#0A1128]/15 hover:border-[#1282A2]/50'
                                                    }`}
                                            >
                                                <p className="font-semibold text-sm text-[#0A1128]">{s.label}</p>
                                                <p className="text-xs text-[#0A1128]/50 mt-0.5">{s.language}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {/* Date rule hint */}
                                    {form.sessionType && (
                                        <p className="text-xs text-[#1282A2] mt-2 bg-[#1282A2]/8 px-3 py-2 rounded-md">
                                            {form.sessionType === 'SCHOOL' && '📅 Weekdays only (Mon–Fri)'}
                                            {form.sessionType === 'PUBLIC_SINHALA' && '📅 Any Saturday or Sunday (except 2nd Sat & 4th Sun)'}
                                            {form.sessionType === 'PUBLIC_TAMIL' && '📅 2nd Saturday or 4th Sunday — Morning slot only'}
                                            {form.sessionType === 'PUBLIC_ENGLISH' && '📅 2nd Saturday or 4th Sunday — Afternoon slot only'}
                                        </p>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <Label className="text-[#0A1128] font-semibold">
                                        Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="e.g., Journey Through the Solar System"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20 focus:border-[#1282A2]"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-[#0A1128] font-semibold">Description</Label>
                                    <Textarea
                                        placeholder="Brief description of the show..."
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                        rows={3}
                                    />
                                </div>

                                {/* Date + Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-[#0A1128] font-semibold">
                                            Date <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="date"
                                            value={form.showDate}
                                            onChange={e => handleDateChange(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}   // ← add this
                                            className={`mt-2 w-full px-4 py-2.5 bg-[#FEFCFB] border rounded-md text-[#0A1128] text-sm focus:outline-none focus:ring-2 focus:ring-[#1282A2] cursor-pointer ${dateError ? 'border-red-400' : 'border-[#0A1128]/20'}`}
                                            required
                                        />
                                        {dateError && (
                                            <p className="text-xs text-red-500 mt-1">{dateError}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-[#0A1128] font-semibold">
                                            Time Slot <span className="text-red-500">*</span>
                                            {timeIsLocked && <span className="text-xs text-[#1282A2] ml-2 font-normal">(auto-set)</span>}
                                        </Label>
                                        <select
                                            value={form.showTime}
                                            onChange={e => handleTimeChange(e.target.value)}
                                            disabled={timeIsLocked}
                                            className={`mt-2 w-full px-4 py-2.5 border rounded-md text-[#0A1128] text-sm focus:outline-none focus:ring-2 focus:ring-[#1282A2] ${timeIsLocked ? 'bg-[#0A1128]/5 cursor-not-allowed' : 'bg-[#FEFCFB] border-[#0A1128]/20'}`}
                                            required
                                        >
                                            <option value="morning">Morning — 10:00 AM</option>
                                            <option value="afternoon">Afternoon — 03:00 PM</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Grade — school only */}
                                {isSchool && (
                                    <div>
                                        <Label className="text-[#0A1128] font-semibold">Grade / Age Group</Label>
                                        <Input
                                            type="text"
                                            placeholder="e.g., Grade 6–8"
                                            value={form.grade ?? ''}
                                            onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                                            className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                        />
                                    </div>
                                )}

                                {/* Seats, Price, Duration */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-[#0A1128] font-semibold">Total Seats</Label>
                                        <Input
                                            type="number"
                                            value={form.totalSeats}
                                            onChange={e => setForm(f => ({ ...f, totalSeats: Number(e.target.value) }))}
                                            className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                            min={1} max={224}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[#0A1128] font-semibold">Price per Seat (Rs)</Label>
                                        <Input
                                            type="number"
                                            value={form.pricePerSeat}
                                            onChange={e => setForm(f => ({ ...f, pricePerSeat: Number(e.target.value) }))}
                                            className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                            min={0}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-[#0A1128] font-semibold">Duration (min)</Label>
                                        <Input
                                            type="number"
                                            value={form.duration}
                                            onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
                                            className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                            min={1}
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <Label className="text-[#0A1128] font-semibold">Status</Label>
                                    <select
                                        value={form.status}
                                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="mt-2 w-full px-4 py-2.5 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-md text-[#0A1128] text-sm focus:outline-none focus:ring-2 focus:ring-[#1282A2]"
                                    >
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>

                                {/* Submit error from backend */}
                                {submitError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-sm text-red-600">{submitError}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-4 pt-4 border-t border-[#0A1128]/10">
                                    <button
                                        type="submit"
                                        disabled={!!dateError || !form.sessionType}
                                        className="flex-1 py-3 bg-[#1282A2] hover:bg-[#034078] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                                    >
                                        {editingShow ? 'Update Show' : 'Create Show'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 border-2 border-[#034078] text-[#034078] hover:bg-[#034078]/5 rounded-lg transition-colors font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation */}
                {confirmDelete && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                        <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl overflow-hidden">
                            <div className="h-1.5 w-full bg-red-500" />
                            <div className="p-8">
                                <div className="flex justify-center mb-5">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <Trash2 className="w-7 h-7 text-red-600" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#0A1128] text-center mb-2">Delete Show</h3>
                                <p className="text-[#0A1128]/60 text-sm text-center mb-1">Are you sure you want to delete</p>
                                <p className="text-[#0A1128] font-semibold text-center mb-2">"{confirmDelete.title}"</p>
                                <p className="text-xs text-[#0A1128]/50 text-center mb-6">
                                    {String(confirmDelete.showDate)} — {confirmDelete.showTime === 'morning' ? '10:00 AM' : '03:00 PM'}
                                </p>
                                <p className="text-xs text-red-500 text-center mb-6">This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmDelete(null)}
                                        className="flex-1 py-2.5 border border-[#0A1128]/20 text-[#0A1128]/70 hover:bg-[#0A1128]/5 rounded-lg transition-colors font-medium text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDeleteAction}
                                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold text-sm"
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}