import { useEffect, useRef, useState } from 'react';
import { Send, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import {AdminSidebar} from "../../components/AdminSidebar.tsx";
import {
    adminGetChatUsers,
    adminGetUserMessages,
    adminReplyToUser,
    type ChatMessageDTO,
} from '../../services/api';


export function AdminChat() {
    const [usernames, setUsernames] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
    const [message, setMessage] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    // 1. Load the list of users who have open chat threads
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminGetChatUsers();
                setUsernames(data);
            } catch {
                setError('Failed to load chat users.');
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    // 2. Load messages whenever a user is selected
    useEffect(() => {
        if (!selectedUser) return;
        const fetchMessages = async () => {
            setLoadingMessages(true);
            setError('');
            try {
                const data = await adminGetUserMessages(selectedUser);
                setMessages(data);
            } catch {
                setError('Failed to load messages.');
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchMessages();
    }, [selectedUser]);

    // 3. Auto-scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (sentAt?: string) => {
        if (!sentAt) return '';
        return new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

     // 4. Admin sends a reply
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser || sending) return;
        setSending(true);
        setError('');
        try {
            const saved = await adminReplyToUser(selectedUser, message.trim());
            setMessages(prev => [...prev, saved]);
            setMessage('');
        } catch {
            setError('Failed to send reply.');
        } finally {
            setSending(false);
        }
    };

   return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Chat Moderation</h1>
                    <p className="text-[#0A1128]/70">Monitor and respond to user conversations</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Left: User list ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-4 border-b border-[#0A1128]/10">
                                <h3 className="font-semibold text-[#0A1128]">Conversations</h3>
                            </div>

                            {loadingUsers ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="w-6 h-6 text-[#1282A2] animate-spin" />
                                </div>
                            ) : usernames.length === 0 ? (
                                <p className="text-center text-[#0A1128]/50 p-8 text-sm">No conversations yet.</p>
                            ) : (
                                <div className="divide-y divide-[#0A1128]/10 max-h-[600px] overflow-y-auto">
                                    {usernames.map((username) => (
                                        <button
                                            key={username}
                                            onClick={() => setSelectedUser(username)}
                                            className={`w-full text-left p-4 hover:bg-[#0A1128]/5 transition-colors ${
                                                selectedUser === username ? 'bg-[#1282A2]/10' : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#034078] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                    {username[0].toUpperCase()}
                                                </div>
                                                <span className="font-medium text-[#0A1128]">{username}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Chat window ── */}
                    <div className="lg:col-span-2">
                        {selectedUser ? (
                            <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
                                {/* Header */}
                                <div className="bg-[#0A1128] text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#1282A2] rounded-full flex items-center justify-center font-bold text-lg">
                                        {selectedUser[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{selectedUser}</h3>
                                        <p className="text-sm text-white/70">School program inquiry</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {loadingMessages ? (
                                        <div className="flex justify-center items-center h-full">
                                            <Loader2 className="w-8 h-8 text-[#1282A2] animate-spin" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-[#0A1128]/40 text-center">
                                            <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                                            <p>No messages in this thread yet.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className="max-w-[70%]">
                                                    {msg.sender === 'user' && (
                                                        <p className="text-xs font-medium text-[#034078] mb-1">{msg.username}</p>
                                                    )}
                                                    <div className={`rounded-lg px-4 py-3 ${
                                                        msg.sender === 'admin'
                                                            ? 'bg-[#1282A2] text-white'
                                                            : 'bg-[#0A1128]/5 text-[#0A1128]'
                                                    }`}>
                                                        <p>{msg.text}</p>
                                                    </div>
                                                    <p className={`text-xs text-[#0A1128]/50 mt-1 ${msg.sender === 'admin' ? 'text-right' : ''}`}>
                                                        {formatTime(msg.sentAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mx-4 mb-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* Reply input */}
                                <div className="border-t border-[#0A1128]/10 p-4">
                                    <form onSubmit={handleSend} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your reply..."
                                            disabled={sending}
                                            className="flex-1 px-4 py-3 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1282A2] disabled:opacity-60"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !message.trim()}
                                            className="px-6 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            Reply
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-lg h-[600px] flex items-center justify-center">
                                <div className="text-center text-[#0A1128]/40">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>Select a conversation to view messages</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}