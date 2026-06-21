import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Sparkles, AlertCircle, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyChatMessages, sendChatMessage, type ChatMessageDTO,  } from '../services/api';

export function ChatPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    const customizationRequest = sessionStorage.getItem('customizationRequest') === 'true';
    const bookingDate = sessionStorage.getItem('bookingDate');
    const bookingTime = sessionStorage.getItem('bookingTime');
    const bookingLanguage = sessionStorage.getItem('bookingLanguage');

    // Block access for non-school users
    if (!customizationRequest) {
        return (
            <div className="min-h-screen bg-[#FEFCFB] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                    <div className="bg-[#1282A2]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-[#1282A2]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0A1128] mb-3">Access Restricted</h2>
                    <p className="text-[#0A1128]/70 mb-6">
                        The customization chat is only available when booking a school program on weekdays.
                        Please start a booking to access this feature.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/select-datetime')}
                            className="w-full px-6 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-lg font-semibold transition-colors"
                        >
                            Start Booking
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full px-6 py-3 bg-[#0A1128]/10 hover:bg-[#0A1128]/20 text-[#0A1128] rounded-lg font-semibold transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Load previous messages on mount
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getMyChatMessages();
                setMessages(data);
            } catch {
                setError('Could not load messages. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (sentAt?: string) => {
        if (!sentAt) return '';
        return new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || sending) return;

        setSending(true);
        setError('');
        try {
            const saved = await sendChatMessage({
                text: message.trim(),
                bookingDate: bookingDate || undefined,
                bookingTime: bookingTime || undefined,
                bookingLanguage: bookingLanguage || undefined,
            });
            setMessages(prev => [...prev, saved]);
            setMessage('');
        } catch {
            setError('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEFCFB]">
            <div className="bg-gradient-to-r from-[#0A1128] to-[#001F54] text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-2">Chat with Our Team</h1>
                    <p className="text-white/90">Customize your planetarium experience with expert guidance</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* School Customization Notice */}
                <div className="bg-gradient-to-r from-[#034078] to-[#001F54] rounded-lg shadow-lg p-6 mb-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="bg-[#1282A2] p-3 rounded-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-2">School Program Customization Request</h3>
                                <p className="text-white/90 text-sm mb-4">
                                    You're here to discuss customizing a school planetarium experience. Our team will help you tailor the show to your educational needs.
                                </p>

                                {bookingDate && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                        <p className="text-xs text-white/70 mb-2">Your preliminary booking details:</p>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-white/60">Date:</span>
                                                <p className="font-medium">{new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                            {bookingTime && (
                                                <div>
                                                    <span className="text-white/60">Time:</span>
                                                    <p className="font-medium">{bookingTime === 'morning' ? '10:00 AM' : '3:00 PM'}</p>
                                                </div>
                                            )}
                                            {bookingLanguage && (
                                                <div>
                                                    <span className="text-white/60">Language:</span>
                                                    <p className="font-medium capitalize">{bookingLanguage}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-white/60">Type:</span>
                                                <p className="font-medium">School Program</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-white/70 mt-3">
                                    💡 Tip: Mention your grade level, group size, and specific curriculum topics for personalized recommendations
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                sessionStorage.removeItem('customizationRequest');
                                navigate('/select-datetime');
                            }}
                            className="text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Booking
                        </button>
                    </div>
                </div>

                {/* Chat Window */}
                <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
                    {/* Chat Header */}
                    <div className="bg-[#0A1128] text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1282A2] rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Smart Planetarium Support Team</h3>
                            <p className="text-sm text-white/70">We typically reply within minutes</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {loading && (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="w-8 h-8 text-[#1282A2] animate-spin" />
                            </div>
                        )}

                        {!loading && messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-[#0A1128]/50">
                                <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                                <p className="font-medium">No messages yet</p>
                                <p className="text-sm mt-1">Start the conversation below to customize your school program.</p>
                            </div>
                        )}

                        {!loading && messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%]`}>
                                    {msg.sender === 'admin' && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-6 h-6 bg-[#034078] rounded-full flex items-center justify-center">
                                                <MessageSquare className="w-3 h-3 text-white" />
                                            </div>
                                            <p className="text-xs font-medium text-[#034078]">Support Team</p>
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-3 ${
                                            msg.sender === 'user'
                                                ? 'bg-[#1282A2] text-white'
                                                : 'bg-[#0A1128]/5 text-[#0A1128]'
                                        }`}
                                    >
                                        <p>{msg.text}</p>
                                    </div>
                                    <p className={`text-xs text-[#0A1128]/50 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {formatTime(msg.sentAt)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div ref={bottomRef} />
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mx-4 mb-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Message Input */}
                    <div className="border-t border-[#0A1128]/10 p-4">
                        <form onSubmit={handleSend} className="flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                disabled={sending}
                                className="flex-1 px-4 py-3 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1282A2] disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={sending || !message.trim()}
                                className="px-6 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}