import { useState } from 'react';
import { Send, ArrowLeft, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
    id: number;
    sender: 'user' | 'team';
    text: string;
    timestamp: string;
}

export function ChatPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    // Check if user came for customization request
    const customizationRequest = sessionStorage.getItem('customizationRequest') === 'true';
    const bookingDate = sessionStorage.getItem('bookingDate');
    const bookingTime = sessionStorage.getItem('bookingTime');
    const bookingLanguage = sessionStorage.getItem('bookingLanguage');

    // Redirect if user tries to access directly without customization request
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

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'team',
            text: 'Hello! Welcome to Smart Planetarium. How can I help you customize your school program today?',
            timestamp: '10:30 AM'
        },
        {
            id: 2,
            sender: 'user',
            text: 'Hi! We are planning a visit for our 5th grade class of about 30 students.',
            timestamp: '10:32 AM'
        },
        {
            id: 3,
            sender: 'team',
            text: 'That sounds great! What topics are you currently covering in your curriculum? We can tailor the show to align with your lessons.',
            timestamp: '10:33 AM'
        }
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: 'user',
                text: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');
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
                {customizationRequest && (
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
                                                        <p className="font-medium capitalize">{bookingTime === 'morning' ? '10:00 AM' : '3:00 PM'}</p>
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
                )}

                {/* Chat Window - Full Width */}
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
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                                    {msg.sender === 'team' && (
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
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-[#0A1128]/10 p-4">
                        <form onSubmit={handleSend} className="flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1282A2]"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}