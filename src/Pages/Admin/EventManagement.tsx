import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Image, X } from 'lucide-react';
import { AdminSidebar } from "../../components/AdminSidebar.tsx";
import { Label } from '../../components/ui/label.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Input } from '../../components/ui/input.tsx';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    endTime: string;
    location: string;
    category: 'Astronomy' | 'Space Science' | 'Activity' | 'Special Day' | 'Special Show';
    status: 'Upcoming' | 'Archived';
    bannerImage: string | null;
}

export function EventManagement() {
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] =
        useState<Event | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    const events: Event[] = [
        {
            id: 1,
            title: 'Solar Eclipse Viewing',
            description: 'Witness a rare solar eclipse through our advanced telescopes and learn about the science behind this celestial phenomenon.',
            date: '2026-02-15',
            time: '2:00 PM',
            endTime: '5:00 PM',
            location: 'Main Observatory Deck',
            category: 'Astronomy',
            status: 'Upcoming',
            bannerImage: null
        },
        {
            id: 2,
            title: 'World Space Week Celebration',
            description: 'Join us for a week-long celebration of space exploration and astronomy with special shows and exhibits.',
            date: '2026-10-04',
            time: '10:00 AM',
            endTime: '6:00 PM',
            location: 'Entire Planetarium Complex',
            category: 'Special Day',
            status: 'Upcoming',
            bannerImage: null
        },
        {
            id: 3,
            title: 'Astronomy Night with Experts',
            description: 'Join our expert astronomers for a special Q&A session followed by guided telescope viewing.',
            date: '2026-01-30',
            time: '8:00 PM',
            endTime: '10:00 PM',
            location: 'Main Planetarium Hall',
            category: 'Astronomy',
            status: 'Upcoming',
            bannerImage: null
        },
        {
            id: 4,
            title: 'Student Workshop: Constellation Mapping',
            description: 'A hands-on educational workshop where students learn to identify constellations and use star charts.',
            date: '2026-01-15',
            time: '2:00 PM',
            endTime: '4:30 PM',
            location: 'Education Center',
            category: 'Activity',
            status: 'Archived',
            bannerImage: null
        },
        {
            id: 5,
            title: 'Journey Through the Solar System',
            description: 'A special immersive planetarium show featuring cutting-edge visualizations of our solar system.',
            date: '2026-03-15',
            time: '6:00 PM',
            endTime: '7:30 PM',
            location: 'Main Dome Theater',
            category: 'Special Show',
            status: 'Upcoming',
            bannerImage: null
        }
    ];

    const handleAddEvent = () => {
        setEditingEvent(null);
        setShowModal(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setShowModal(true);
    };

    const handleDeleteEvent = (eventId: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            // Delete logic here
            console.log('Deleting event:', eventId);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission logic here
        console.log('Form submitted');
        setShowModal(false);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Astronomy':
                return 'bg-[#1282A2] text-white';
            case 'Space Science':
                return 'bg-[#034078] text-white';
            case 'Activity':
                return 'bg-[#001F54] text-white';
            case 'Special Day':
                return 'bg-purple-600 text-white';
            case 'Special Show':
                return 'bg-[#0A1128] text-white';
            default:
                return 'bg-gray-200 text-gray-800';
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
                        <p className="text-[#0A1128]/70">Create and manage planetarium events</p>
                    </div>
                    <button
                        onClick={handleAddEvent}
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
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            viewMode === 'table'
                                ? 'bg-[#034078] text-white'
                                : 'bg-white text-[#0A1128] border border-[#0A1128]/20'
                        }`}
                    >
                        Table View
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-[#034078] text-white'
                                : 'bg-white text-[#0A1128] border border-[#0A1128]/20'
                        }`}
                    >
                        Grid View
                    </button>
                </div>

                {/* Table View */}
                {viewMode === 'table' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#0A1128] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Event Title</th>
                                <th className="px-6 py-4 text-left font-semibold">Category</th>
                                <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                                <th className="px-6 py-4 text-left font-semibold">Location</th>
                                <th className="px-6 py-4 text-left font-semibold">Status</th>
                                <th className="px-6 py-4 text-center font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {events.map((event, index) => (
                                <tr
                                    key={event.id}
                                    className={`border-b border-[#0A1128]/10 hover:bg-[#FEFCFB] transition-colors ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-[#FEFCFB]/50'
                                    }`}
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-[#0A1128]">{event.title}</p>
                                            <p className="text-sm text-[#0A1128]/60 line-clamp-1">{event.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="text-[#0A1128] font-medium">
                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-[#0A1128]/60">{event.time} - {event.endTime}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-[#0A1128]">{event.location}</p>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === 'Upcoming'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                      }`}>
                        {event.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditEvent(event)}
                                                className="p-2 hover:bg-[#034078]/10 rounded-md transition-colors"
                                                title="Edit Event"
                                            >
                                                <Edit className="w-4 h-4 text-[#034078]" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="p-2 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete Event"
                                            >
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
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#1282A2] hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#0A1128] mb-2">{event.title}</h3>
                                        <p className="text-sm text-[#0A1128]/70 line-clamp-2 mb-3">{event.description}</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        <button
                                            onClick={() => handleEditEvent(event)}
                                            className="p-2 hover:bg-[#034078]/10 rounded-md transition-colors"
                                        >
                                            <Edit className="w-4 h-4 text-[#034078]" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="p-2 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-[#0A1128]/70">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#0A1128]/70">
                                        <Clock className="w-4 h-4" />
                                        <span>{event.time} - {event.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#0A1128]/70">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-[#0A1128]/10">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'Upcoming'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                  }`}>
                    {event.status}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Event Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-[#0A1128]/10 px-8 py-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-[#0A1128]">
                                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-[#0A1128]/5 rounded-md transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#0A1128]" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                {/* Event Title */}
                                <div>
                                    <Label htmlFor="title" className="text-[#0A1128] font-semibold">
                                        Event Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="e.g., Solar Eclipse Viewing"
                                        defaultValue={editingEvent?.title}
                                        className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20 focus:border-[#1282A2]"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <Label htmlFor="category" className="text-[#0A1128] font-semibold">
                                        Category <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="category"
                                        defaultValue={editingEvent?.category || ''}
                                        className="mt-2 w-full px-4 py-2.5 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1282A2] text-[#0A1128]"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        <option value="Astronomy">Astronomy</option>
                                        <option value="Space Science">Space Science</option>
                                        <option value="Activity">Activity</option>
                                        <option value="Special Day">Special Day</option>
                                        <option value="Special Show">Special Show</option>
                                    </select>
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="date" className="text-[#0A1128] font-semibold">
                                            Date <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            defaultValue={editingEvent?.date}
                                            className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="time" className="text-[#0A1128] font-semibold">
                                            Start Time <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            defaultValue={editingEvent?.time}
                                            className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endTime" className="text-[#0A1128] font-semibold">
                                            End Time <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="endTime"
                                            type="time"
                                            defaultValue={editingEvent?.endTime}
                                            className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <Label htmlFor="location" className="text-[#0A1128] font-semibold">
                                        Location <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        placeholder="e.g., Main Planetarium Hall"
                                        defaultValue={editingEvent?.location}
                                        className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description" className="text-[#0A1128] font-semibold">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the event and what attendees can expect..."
                                        defaultValue={editingEvent?.description}
                                        className="mt-2 bg-[#FEFCFB] border-[#0A1128]/20"
                                        rows={4}
                                        required
                                    />
                                </div>

                                {/* Banner Image Upload */}
                                <div>
                                    <Label htmlFor="bannerImage" className="text-[#0A1128] font-semibold">
                                        Banner Image (Optional)
                                    </Label>
                                    <div className="mt-2 border-2 border-dashed border-[#0A1128]/20 rounded-lg p-6 text-center hover:border-[#1282A2] transition-colors">
                                        <Image className="w-12 h-12 text-[#0A1128]/30 mx-auto mb-3" />
                                        <p className="text-sm text-[#0A1128]/70 mb-2">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-[#0A1128]/50">
                                            PNG, JPG up to 5MB
                                        </p>
                                        <input
                                            id="bannerImage"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
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
                                        defaultValue={editingEvent?.status || 'Upcoming'}
                                        className="mt-2 w-full px-4 py-2.5 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1282A2] text-[#0A1128]"
                                        required
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-4 pt-4 border-t border-[#0A1128]/10">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-lg transition-colors font-semibold"
                                    >
                                        {editingEvent ? 'Update Event' : 'Create Event'}
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
            </div>
        </div>
    );
}