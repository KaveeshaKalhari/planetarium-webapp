import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, X, Search, ChevronDown } from 'lucide-react';
import { AdminSidebar } from "../../components/AdminSidebar.tsx";
import { Label } from '../../components/ui/label.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Input } from '../../components/ui/input.tsx';
import { getAllEventsAdmin, createEvent, updateEvent, deleteEvent, type EventDTO } from '../../services/api';

// ─── Emoji Picker ────────────────────────────────────────────────────────────

const EMOJI_CATEGORIES = [
    {
        label: '🌌 Celestial',
        emojis: ['☀️', '🌙', '🌕', '🌑', '🌟', '⭐', '💫', '✨', '🌠', '🌌', '🪐', '☄️', '🌞', '🌛', '🌜', '🌝', '🌚', '⚡', '🌈', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '🌬️', '🌫️'],
    },
    {
        label: '🌿 Nature',
        emojis: ['🌊', '🏔️', '🗻', '🌋', '🏜️', '🌲', '🌳', '🌴', '🌵', '🍃', '🍀', '🌸', '🌺', '🌻', '🌹', '🌾', '🍄', '🦋', '🦅', '🦉', '🐬', '🐳', '🦈', '🐉', '🦁', '🐺', '🦊', '🐘', '🌏', '🌍'],
    },
    {
        label: '🔭 Science',
        emojis: ['🔭', '🔬', '⚗️', '🧪', '🧬', '🧲', '💡', '🔋', '⚙️', '🛸', '🚀', '🛰️', '📡', '🌡️', '🧭', '⏰', '⏱️', '📊', '🔢', '💎', '🔮', '🎯', '🏆', '📌', '🗺️'],
    },
];

interface EmojiPickerProps {
    value: string;
    onChange: (emoji: string) => void;
}

function EmojiPicker({ value, onChange }: EmojiPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const allEmojis = EMOJI_CATEGORIES.flatMap(c => c.emojis);
    const filtered = search
        ? allEmojis.filter(e => e.includes(search))
        : null;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-md hover:border-[#1282A2] focus:outline-none focus:ring-2 focus:ring-[#1282A2] transition-colors"
            >
                <span className="text-2xl w-8 text-center">{value || '➕'}</span>
                <span className="text-[#0A1128]/60 text-sm flex-1 text-left">
                    {value ? 'Click to change emoji' : 'Select an emoji'}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#0A1128]/40 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-[#0A1128]/15 rounded-lg shadow-xl overflow-hidden">
                    {/* Search */}
                    <div className="p-3 border-b border-[#0A1128]/10">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FEFCFB] border border-[#0A1128]/15 rounded-md">
                            <Search className="w-3.5 h-3.5 text-[#0A1128]/40" />
                            <input
                                type="text"
                                placeholder="Search emoji..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-[#0A1128] outline-none placeholder:text-[#0A1128]/40"
                                autoFocus
                            />
                            {search && (
                                <button type="button" onClick={() => setSearch('')}>
                                    <X className="w-3.5 h-3.5 text-[#0A1128]/40" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Also allow custom input */}
                    <div className="px-3 py-2 border-b border-[#0A1128]/10">
                        <input
                            type="text"
                            placeholder="Or paste / type any emoji..."
                            maxLength={4}
                            onChange={e => { if (e.target.value) { onChange(e.target.value); setOpen(false); } }}
                            className="w-full text-sm px-3 py-1.5 bg-[#FEFCFB] border border-[#0A1128]/15 rounded-md outline-none focus:border-[#1282A2] text-[#0A1128]"
                        />
                    </div>

                    <div className="max-h-64 overflow-y-auto p-3">
                        {filtered ? (
                            <div>
                                <p className="text-xs text-[#0A1128]/40 mb-2">Results</p>
                                <div className="grid grid-cols-8 gap-1">
                                    {filtered.map(emoji => (
                                        <button
                                            key={emoji} type="button"
                                            onClick={() => { onChange(emoji); setOpen(false); setSearch(''); }}
                                            className={`text-xl p-1.5 rounded hover:bg-[#1282A2]/10 transition-colors ${value === emoji ? 'bg-[#1282A2]/20 ring-1 ring-[#1282A2]' : ''}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            EMOJI_CATEGORIES.map(cat => (
                                <div key={cat.label} className="mb-4 last:mb-0">
                                    <p className="text-xs font-semibold text-[#0A1128]/50 mb-2">{cat.label}</p>
                                    <div className="grid grid-cols-8 gap-1">
                                        {cat.emojis.map(emoji => (
                                            <button
                                                key={emoji} type="button"
                                                onClick={() => { onChange(emoji); setOpen(false); }}
                                                className={`text-xl p-1.5 rounded hover:bg-[#1282A2]/10 transition-colors ${value === emoji ? 'bg-[#1282A2]/20 ring-1 ring-[#1282A2]' : ''}`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Badge Suggestions ────────────────────────────────────────────────────────

const BADGE_SUGGESTIONS = [
    'Rare Event', 'Special Event', 'Annual Event', 'Must See',
    'Family Friendly', 'Night Sky', 'Daytime Only', 'Expert Pick',
    'Featured', 'Limited View', 'Weather Dependent', 'Free Entry',
];

interface BadgeInputProps {
    value: string;
    onChange: (val: string) => void;
}

function BadgeInput({ value, onChange }: BadgeInputProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = value
        ? BADGE_SUGGESTIONS.filter(b => b.toLowerCase().includes(value.toLowerCase()) && b !== value)
        : BADGE_SUGGESTIONS;

    return (
        <div ref={ref} className="relative">
            <div className="mt-2 flex items-center border border-[#0A1128]/20 rounded-md bg-[#FEFCFB] focus-within:ring-2 focus-within:ring-[#1282A2] focus-within:border-[#1282A2] transition-all">
                <input
                    type="text"
                    id="badge"
                    placeholder="e.g., Rare Event"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setOpen(true)}
                    className="flex-1 px-4 py-2.5 bg-transparent text-[#0A1128] text-sm outline-none"
                />
                {value && (
                    <button type="button" onClick={() => { onChange(''); setOpen(false); }} className="pr-2">
                        <X className="w-4 h-4 text-[#0A1128]/40 hover:text-[#0A1128]" />
                    </button>
                )}
                <button type="button" onClick={() => setOpen(o => !o)} className="pr-3">
                    <ChevronDown className={`w-4 h-4 text-[#0A1128]/40 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {open && filtered.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-[#0A1128]/15 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-3 py-2 border-b border-[#0A1128]/10">
                        <p className="text-xs text-[#0A1128]/40 font-medium">Suggestions</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto py-1">
                        {filtered.map(suggestion => (
                            <button
                                key={suggestion} type="button"
                                onClick={() => { onChange(suggestion); setOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-[#0A1128] hover:bg-[#1282A2]/8 transition-colors flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#1282A2]/40 flex-shrink-0" />
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FormState {
    title: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    type: EventDTO['type'] | '';
    icon: string;
    badge: string;
    status: string;
}

const emptyForm = (): FormState => ({
    title: '', description: '', eventDate: '', startTime: '', endTime: '',
    type: '', icon: '', badge: '', status: 'upcoming',
});

export function EventManagement() {
    const [events, setEvents] = useState<EventDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventDTO | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [form, setForm] = useState<FormState>(emptyForm());
    const [timeError, setTimeError] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<EventDTO | null>(null);

    useEffect(() => {
        getAllEventsAdmin()
            .then(setEvents)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openAdd = () => {
        setEditingEvent(null);
        setForm(emptyForm());
        setTimeError('');
        setShowModal(true);
    };

    const openEdit = (event: EventDTO) => {
        setEditingEvent(event);
        // Convert display date "July 6, 2026" → "2026-07-06" for <input type="date">
        let dateValue = event.eventDate;
        const parsed = new Date(event.eventDate);
        if (!isNaN(parsed.getTime())) {
            dateValue = parsed.toISOString().split('T')[0];
        }
        // Convert "1:00 PM" → "13:00" for <input type="time">
        const toTime24 = (t: string) => {
            if (!t) return '';
            const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (!match) return t;
            let h = parseInt(match[1]);
            const m = match[2];
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && h !== 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            return `${String(h).padStart(2, '0')}:${m}`;
        };
        setForm({
            title: event.title,
            description: event.description,
            eventDate: dateValue,
            startTime: toTime24(event.startTime),
            endTime: toTime24(event.endTime),
            type: event.type,
            icon: event.icon,
            badge: event.badge ?? '',
            status: event.status,
        });
        setTimeError('');
        setShowModal(true);
    };

    const handleDeleteEvent = async (event: EventDTO) => {
        setConfirmDelete(event);
    };

    const confirmDeleteAction = async () => {
        if (!confirmDelete) return;
        await deleteEvent(confirmDelete.id);
        setEvents(prev => prev.filter(e => e.id !== confirmDelete.id));
        setConfirmDelete(null);
    };

    // Format date "2026-07-06" → "July 6, 2026"
    const formatDisplayDate = (iso: string) => {
        const d = new Date(iso + 'T00:00:00');
        return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Format time "13:00" → "1:00 PM"
    const formatDisplayTime = (t: string) => {
        if (!t) return '';
        const [hStr, mStr] = t.split(':');
        let h = parseInt(hStr);
        const m = mStr;
        const ampm = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${h}:${m} ${ampm}`;
    };

    const validateTimes = (start: string, end: string): string => {
        if (!start || !end) return '';
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startMins = sh * 60 + sm;
        const endMins = eh * 60 + em;
        if (endMins <= startMins) return 'End time must be after start time.';
        return '';
    };

    const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
        const next = { ...form, [field]: value };
        setForm(next);
        setTimeError(validateTimes(next.startTime, next.endTime));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const err = validateTimes(form.startTime, form.endTime);
        if (err) { setTimeError(err); return; }

        const data: Partial<EventDTO> = {
            title: form.title,
            description: form.description,
            eventDate: formatDisplayDate(form.eventDate),
            startTime: formatDisplayTime(form.startTime),
            endTime: formatDisplayTime(form.endTime),
            type: form.type as EventDTO['type'],
            icon: form.icon,
            badge: form.badge || undefined,
            status: form.status,
        };

        if (editingEvent) {
            const updated = await updateEvent(editingEvent.id, data);
            setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updated : ev));
        } else {
            const created = await createEvent(data);
            setEvents(prev => [...prev, created]);
        }
        setShowModal(false);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'yellow': return 'bg-yellow-100 text-yellow-800';
            case 'blue': return 'bg-blue-100 text-blue-800';
            case 'red': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'yellow': return 'Special Event';
            case 'blue': return 'Regular Event';
            case 'red': return 'Rare Event';
            default: return type;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Event Management</h1>
                        <p className="text-[#0A1128]/70">Manage upcoming natural phenomena &amp; celestial events</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-lg transition-colors font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Event
                    </button>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${viewMode === 'table' ? 'bg-[#034078] text-white' : 'bg-white text-[#0A1128] border border-[#0A1128]/20'}`}
                    >
                        Table View
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${viewMode === 'grid' ? 'bg-[#034078] text-white' : 'bg-white text-[#0A1128] border border-[#0A1128]/20'}`}
                    >
                        Grid View
                    </button>
                </div>

                {loading && <p className="text-center text-[#0A1128]/50 py-10">Loading events...</p>}

                {/* Table View */}
                {!loading && viewMode === 'table' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#0A1128] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold w-80">Event</th>
                                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                                    <th className="px-6 py-4 text-left font-semibold">Date &amp; Time</th>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event, index) => (
                                    <tr
                                        key={event.id}
                                        className={`border-b border-[#0A1128]/10 hover:bg-[#FEFCFB] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#FEFCFB]/50'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{event.icon}</span>
                                                <div>
                                                    <p className="font-semibold text-[#0A1128]">{event.title}</p>
                                                    <p className="text-sm text-[#0A1128]/60 line-clamp-1 max-w-xs">{event.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(event.type)}`}>
                                                {getTypeLabel(event.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <p className="text-[#0A1128] font-medium">{event.eventDate}</p>
                                                <p className="text-[#0A1128]/60">{event.startTime} – {event.endTime}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openEdit(event)} className="p-2 hover:bg-[#034078]/10 rounded-md transition-colors" title="Edit">
                                                    <Edit className="w-4 h-4 text-[#034078]" />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event); }} className="p-2 hover:bg-red-50 rounded-md transition-colors" title="Delete">
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

                {/* Grid View */}
                {!loading && viewMode === 'grid' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#1282A2] hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <span className="text-3xl">{event.icon}</span>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#0A1128] mb-1">{event.title}</h3>
                                            {event.badge && (
                                                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-[#1282A2]/10 text-[#1282A2] mb-2">
                                                    {event.badge}
                                                </span>
                                            )}
                                            <p className="text-sm text-[#0A1128]/70 line-clamp-2">{event.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                        <button onClick={() => openEdit(event)} className="p-2 hover:bg-[#034078]/10 rounded-md transition-colors">
                                            <Edit className="w-4 h-4 text-[#034078]" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event); }} className="p-2 hover:bg-red-50 rounded-md transition-colors">
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm mt-3">
                                    <div className="flex items-center gap-2 text-[#0A1128]/70">
                                        <Calendar className="w-4 h-4" />
                                        <span>{event.eventDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#0A1128]/70">
                                        <Clock className="w-4 h-4" />
                                        <span>{event.startTime} – {event.endTime}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-[#0A1128]/10 flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(event.type)}`}>
                                        {getTypeLabel(event.type)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-[#0A1128]/10 px-8 py-6 flex justify-between items-center z-10">
                                <h2 className="text-2xl font-bold text-[#0A1128]">
                                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#0A1128]/5 rounded-md transition-colors">
                                    <X className="w-5 h-5 text-[#0A1128]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">

                                {/* Title */}
                                <div>
                                    <Label htmlFor="title" className="text-[#0A1128] font-semibold">
                                        Event Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input id="title" type="text" placeholder="e.g., Solar Eclipse Viewing"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20 focus:border-[#1282A2]" required />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description" className="text-[#0A1128] font-semibold">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea id="description" placeholder="Describe the phenomenon..."
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20" rows={4} required />
                                </div>

                                {/* Date, Start Time, End Time */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* ── Date picker ── */}
                                    <div>
                                        <Label htmlFor="eventDate" className="text-[#0A1128] font-semibold">
                                            Date <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative mt-2">
                                            <input
                                                id="eventDate"
                                                type="date"
                                                value={form.eventDate}
                                                onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))}
                                                className="w-full px-4 py-2.5 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-md text-[#0A1128] text-sm focus:outline-none focus:ring-2 focus:ring-[#1282A2] focus:border-[#1282A2] cursor-pointer"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* ── Start Time ── */}
                                    <div>
                                        <Label htmlFor="startTime" className="text-[#0A1128] font-semibold">
                                            Start Time <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative mt-2">
                                            <input
                                                id="startTime"
                                                type="time"
                                                value={form.startTime}
                                                onChange={e => handleTimeChange('startTime', e.target.value)}
                                                className={`w-full px-4 py-2.5 bg-[#FEFCFB] border rounded-md text-[#0A1128] text-sm focus:outline-none focus:ring-2 focus:ring-[#1282A2] cursor-pointer ${timeError ? 'border-red-400 focus:ring-red-300' : 'border-[#0A1128]/20 focus:border-[#1282A2]'}`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* ── End Time ── */}
                                    <div>
                                        <Label htmlFor="endTime" className="text-[#0A1128] font-semibold">
                                            End Time <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative mt-2">
                                            <input
                                                id="endTime"
                                                type="time"
                                                value={form.endTime}
                                                onChange={e => handleTimeChange('endTime', e.target.value)}
                                                className={`w-full px-4 py-2.5 bg-[#FEFCFB] border rounded-md text-[#0A1128] text-sm focus:outline-none focus:ring-2 focus:ring-[#1282A2] cursor-pointer ${timeError ? 'border-red-400 focus:ring-red-300' : 'border-[#0A1128]/20 focus:border-[#1282A2]'}`}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Time validation error */}
                                {timeError && (
                                    <p className="flex items-center gap-1.5 text-sm text-red-600 -mt-3">
                                        <span className="inline-block w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold">!</span>
                                        {timeError}
                                    </p>
                                )}

                                {/* Type */}
                                <div>
                                    <Label htmlFor="type" className="text-[#0A1128] font-semibold">
                                        Event Type <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="type"
                                        value={form.type}
                                        onChange={e => setForm(f => ({ ...f, type: e.target.value as EventDTO['type'] }))}
                                        className="mt-2 w-full px-4 py-2.5 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1282A2] text-[#0A1128]"
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="yellow">Special Event (Yellow)</option>
                                        <option value="blue">Regular Event (Blue)</option>
                                        <option value="red">Rare Event (Red)</option>
                                    </select>
                                </div>

                                {/* Icon & Badge */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* ── Emoji Picker ── */}
                                    <div>
                                        <Label className="text-[#0A1128] font-semibold">
                                            Icon (emoji) <span className="text-red-500">*</span>
                                        </Label>
                                        <EmojiPicker
                                            value={form.icon}
                                            onChange={v => setForm(f => ({ ...f, icon: v }))}
                                        />
                                        {/* Hidden required validator */}
                                        <input type="text" value={form.icon} required readOnly tabIndex={-1}
                                            className="sr-only" aria-hidden="true" />
                                    </div>

                                    {/* ── Badge suggestions ── */}
                                    <div>
                                        <Label className="text-[#0A1128] font-semibold">
                                            Badge Label <span className="text-[#0A1128]/40 font-normal text-xs ml-1">(optional)</span>
                                        </Label>
                                        <BadgeInput
                                            value={form.badge}
                                            onChange={v => setForm(f => ({ ...f, badge: v }))}
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <Label htmlFor="status" className="text-[#0A1128] font-semibold">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="status"
                                        value={form.status}
                                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="mt-2 w-full px-4 py-2.5 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1282A2] text-[#0A1128]"
                                        required
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4 border-t border-[#0A1128]/10">
                                    <button
                                        type="submit"
                                        disabled={!!timeError}
                                        className="flex-1 py-3 bg-[#1282A2] hover:bg-[#034078] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                                    >
                                        {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 border-2 border-[#034078] text-[#034078] hover:bg-[#034078]/5 rounded-lg transition-colors font-semibold">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            {/* Delete Confirmation Dialog */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl overflow-hidden">
                        {/* Red accent bar */}
                        <div className="h-1.5 w-full bg-red-500" />

                        <div className="p-8">
                            {/* Icon */}
                            <div className="flex justify-center mb-5">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <Trash2 className="w-7 h-7 text-red-600" />
                                </div>
                            </div>

                            {/* Text */}
                            <h3 className="text-xl font-bold text-[#0A1128] text-center mb-2">Delete Event</h3>
                            <p className="text-[#0A1128]/60 text-sm text-center mb-1">
                                Are you sure you want to delete
                            </p>
                            <p className="text-[#0A1128] font-semibold text-center mb-6">
                                {confirmDelete.icon} "{confirmDelete.title}"
                            </p>
                            <p className="text-xs text-red-500 text-center mb-6">
                                This action cannot be undone.
                            </p>

                            {/* Buttons */}
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
    );
}