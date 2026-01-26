import { useState } from 'react';
import { Send, AlertCircle, Trash2 } from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface Conversation {
    id: number;
    user: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    flagged: boolean;
}

interface ChatMessage {
    id: number;
    user: string;
    text: string;
    timestamp: string;
    isAdmin: boolean;
}

export function AdminChat() {
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [message, setMessage] = useState('');

    const conversations: Conversation[] = [
        {
            id: 1,
            user: 'Sarah Johnson',
            lastMessage: 'Thanks for the help!',
            timestamp: '10:35 AM',
            unread: 0,
            flagged: false
        },
        {
            id: 2,
            user: 'Michael Chen',
            lastMessage: 'Can you help me with my booking?',
            timestamp: '9:20 AM',
            unread: 2,
            flagged: false
        },
        {
            id: 3,
            user: 'Emily Rodriguez',
            lastMessage: 'inappropriate content here',
            timestamp: 'Yesterday',
            unread: 1,
            flagged: true
        }
    ];

    const messages: ChatMessage[] = selectedConversation ? [
        {
            id: 1,
            user: 'Michael Chen',
            text: 'Hi, I need help with my booking for tomorrow',
            timestamp: '9:15 AM',
            isAdmin: false
        },
        {
            id: 2,
            user: 'Admin',
            text: 'Hello! I\'d be happy to help. Can you provide your booking reference number?',
            timestamp: '9:16 AM',
            isAdmin: true
        },
        {
            id: 3,
            user: 'Michael Chen',
            text: 'Yes, it\'s PB2026012501',
            timestamp: '9:18 AM',
            isAdmin: false
        },
        {
            id: 4,
            user: 'Admin',
            text: 'I can see your booking for "Journey to the Stars" at 7:00 PM. How can I assist you?',
            timestamp: '9:20 AM',
            isAdmin: true
        },
        {
            id: 5,
            user: 'Michael Chen',
            text: 'Can you help me with my booking?',
            timestamp: '9:20 AM',
            isAdmin: false
        }
    ] : [];

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    const handleDeleteMessage = (messageId: number) => {
        console.log('Deleting message:', messageId);
    };

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Chat Moderation</h1>
                    <p className="text-[#0A1128]/70">Monitor and moderate community conversations</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-4 border-b border-[#0A1128]/10">
                                <h3 className="font-semibold text-[#0A1128]">Conversations</h3>
                            </div>
                            <div className="divide-y divide-[#0A1128]/10 max-h-[600px] overflow-y-auto">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`w-full text-left p-4 hover:bg-[#0A1128]/5 transition-colors ${
                                            selectedConversation?.id === conv.id ? 'bg-[#1282A2]/10' : ''
                                        } ${conv.flagged ? 'border-l-4 border-red-500' : ''}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-[#0A1128]">{conv.user}</span>
                                            {conv.unread > 0 && (
                                                <span className="bg-[#1282A2] text-white text-xs px-2 py-0.5 rounded-full">
                          {conv.unread}
                        </span>
                                            )}
                                            {conv.flagged && (
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-[#0A1128]/70 truncate">{conv.lastMessage}</p>
                                        <p className="text-xs text-[#0A1128]/50 mt-1">{conv.timestamp}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="lg:col-span-2">
                        {selectedConversation ? (
                            <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
                                {/* Chat Header */}
                                <div className="bg-[#0A1128] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{selectedConversation.user}</h3>
                                        <p className="text-sm text-white/70">Active now</p>
                                    </div>
                                    {selectedConversation.flagged && (
                                        <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Flagged</span>
                                        </div>
                                    )}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] group relative`}>
                                                {!msg.isAdmin && (
                                                    <p className="text-xs font-medium text-[#034078] mb-1">{msg.user}</p>
                                                )}
                                                <div
                                                    className={`rounded-lg px-4 py-3 ${
                                                        msg.isAdmin
                                                            ? 'bg-[#1282A2] text-white'
                                                            : 'bg-[#0A1128]/5 text-[#0A1128]'
                                                    }`}
                                                >
                                                    <p>{msg.text}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-xs text-[#0A1128]/50">{msg.timestamp}</p>
                                                    {!msg.isAdmin && (
                                                        <button
                                                            onClick={() => handleDeleteMessage(msg.id)}
                                                            className="opacity-0 group-hover:opacity-100 ml-2 text-red-500 hover:text-red-700 transition-opacity"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
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
                        ) : (
                            <div className="bg-white rounded-lg shadow-lg h-[600px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#0A1128]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-8 h-8 text-[#0A1128]/30" />
                                    </div>
                                    <p className="text-[#0A1128]/50">Select a conversation to view messages</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
