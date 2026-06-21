import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Loader2, RefreshCw } from 'lucide-react';
import { AdminSidebar } from "../../components/AdminSidebar.tsx";

interface Blog {
    id: number;
    title: string;
    authorName: string;
    authorEmail: string;
    category: string;
    submittedAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason: string | null;
    excerpt: string;
    content: string;
    imageUrl: string | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const API_BASE = 'http://localhost:8080/api/v1/blogs';

function getAuthHeader(): string {
    const token = localStorage.getItem('authToken') || '';
    return `Bearer ${token}`;
}

export function BlogApproval() {
    const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([]);
    const [reviewedBlogs, setReviewedBlogs] = useState<Blog[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [rejectModal, setRejectModal] = useState<{ blogId: number; blogTitle: string } | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const [pendingRes, allRes] = await Promise.all([
                fetch(`${API_BASE}/admin/pending`, {
                    headers: { Authorization: getAuthHeader() },
                }),
                fetch(`${API_BASE}/admin/all`, {
                    headers: { Authorization: getAuthHeader() },
                }),
            ]);

            if (!pendingRes.ok || !allRes.ok) throw new Error('Failed to fetch blogs');

            const pending: Blog[] = await pendingRes.json();
            const all: Blog[] = await allRes.json();

            setPendingBlogs(pending);
            setReviewedBlogs(all.filter(b => b.status === 'APPROVED' || b.status === 'REJECTED'));
        } catch (err) {
            setError('Could not load blogs. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleApprove = async (blogId: number) => {
        setActionLoading(blogId);
        try {
            const res = await fetch(`${API_BASE}/admin/${blogId}/approve`, {
                method: 'PUT',
                headers: { Authorization: getAuthHeader() },
            });
            if (!res.ok) throw new Error();
            showToast('Blog approved! Author has been notified by email.', 'success');
            if (selectedBlog?.id === blogId) setSelectedBlog(null);
            await fetchBlogs();
        } catch {
            showToast('Failed to approve blog. Please try again.', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = (blogId: number, blogTitle: string) => {
        setRejectionReason('');
        setRejectModal({ blogId, blogTitle });
    };

    const confirmReject = async () => {
        if (!rejectModal) return;
        const { blogId } = rejectModal;
        setRejectModal(null);
        setActionLoading(blogId);
        try {
            const res = await fetch(`${API_BASE}/admin/${blogId}/reject`, {
                method: 'PUT',
                headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: rejectionReason.trim() }),
            });
            if (!res.ok) throw new Error();
            showToast('Blog rejected. Author has been notified.', 'success');
            if (selectedBlog?.id === blogId) setSelectedBlog(null);
            await fetchBlogs();
        } catch {
            showToast('Failed to reject blog. Please try again.', 'error');
        } finally {
            setActionLoading(null);
            setRejectionReason('');
        }
    };

    const handleDelete = async (blogId: number) => {
        if (!confirm('Are you sure you want to permanently delete this blog?')) return;
        setActionLoading(blogId);
        try {
            const res = await fetch(`${API_BASE}/admin/${blogId}`, {
                method: 'DELETE',
                headers: { Authorization: getAuthHeader() },
            });
            if (!res.ok) throw new Error();
            showToast('Blog deleted successfully.', 'success');
            if (selectedBlog?.id === blogId) setSelectedBlog(null);
            await fetchBlogs();
        } catch {
            showToast('Failed to delete blog. Please try again.', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const statusBadge = (status: Blog['status']) => {
        const map = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${map[status]}`}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                {/* Toast */}
                {toast && (
                    <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                        {toast.message}
                    </div>
                )}

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Blog Approval</h1>
                        <p className="text-[#0A1128]/70">Review and moderate user-submitted blogs</p>
                    </div>
                    <button
                        onClick={fetchBlogs}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-md transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-[#034078]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: lists */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Pending */}
                            <div>
                                <h2 className="text-xl font-semibold text-[#0A1128] mb-4">
                                    Pending Approval ({pendingBlogs.length})
                                </h2>
                                {pendingBlogs.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow p-10 text-center text-[#0A1128]/40">
                                        No pending blogs — all caught up!
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingBlogs.map((blog) => (
                                            <div key={blog.id} className="bg-white rounded-lg shadow-lg p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1 pr-4">
                                                        <h3 className="text-lg font-bold text-[#0A1128] mb-1">{blog.title}</h3>
                                                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#0A1128]/60">
                                                            <span>By <span className="font-medium">{blog.authorName}</span></span>
                                                            <span>•</span>
                                                            <span>{blog.authorEmail}</span>
                                                            <span>•</span>
                                                            <span>{blog.submittedAt}</span>
                                                        </div>
                                                    </div>
                                                    {statusBadge(blog.status)}
                                                </div>

                                                <p className="text-[#0A1128]/75 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

                                                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#0A1128]/10">
                                                    <button
                                                        onClick={() => setSelectedBlog(blog)}
                                                        className="flex items-center gap-2 px-4 py-2 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-md transition-colors text-sm"
                                                    >
                                                        <Eye className="w-4 h-4" /> Preview
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(blog.id)}
                                                        disabled={actionLoading === blog.id}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm disabled:opacity-60"
                                                    >
                                                        {actionLoading === blog.id
                                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                                            : <CheckCircle className="w-4 h-4" />}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(blog.id, blog.title)}
                                                        disabled={actionLoading === blog.id}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm disabled:opacity-60"
                                                    >
                                                        {actionLoading === blog.id
                                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                                            : <XCircle className="w-4 h-4" />}
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reviewed blogs table */}
                            <div>
                                <h2 className="text-xl font-semibold text-[#0A1128] mb-4">
                                    Reviewed Blogs ({reviewedBlogs.length})
                                </h2>
                                {reviewedBlogs.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow p-10 text-center text-[#0A1128]/40">
                                        No reviewed blogs yet.
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-[#0A1128]/5">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Title</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Author</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Reviewed</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Reason</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#0A1128]/10">
                                                {reviewedBlogs.map((blog) => (
                                                    <tr key={blog.id} className="hover:bg-[#0A1128]/5">
                                                        <td className="px-6 py-4 text-sm font-medium text-[#0A1128] max-w-[180px] truncate">{blog.title}</td>
                                                        <td className="px-6 py-4 text-sm text-[#0A1128]">{blog.authorName}</td>
                                                        <td className="px-6 py-4 text-sm text-[#0A1128]/70">{blog.reviewedAt ?? '—'}</td>
                                                        <td className="px-6 py-4">{statusBadge(blog.status)}</td>
                                                        <td className="px-6 py-4 text-sm text-[#0A1128]/70 max-w-[160px]">
                                                            {blog.rejectionReason
                                                                ? <span className="line-clamp-2 text-red-600/80 italic" title={blog.rejectionReason}>{blog.rejectionReason}</span>
                                                                : <span className="text-[#0A1128]/30">—</span>
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => setSelectedBlog(blog)}
                                                                    className="p-1 text-[#034078] hover:text-[#1282A2]"
                                                                    title="Preview"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(blog.id)}
                                                                    disabled={actionLoading === blog.id}
                                                                    className="p-1 text-red-500 hover:text-red-700 disabled:opacity-40"
                                                                    title="Delete"
                                                                >
                                                                    {actionLoading === blog.id
                                                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                                                        : <XCircle className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Preview Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                                {selectedBlog ? (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-[#0A1128]">Blog Preview</h3>
                                            <button onClick={() => setSelectedBlog(null)} className="text-[#0A1128]/40 hover:text-[#0A1128]">✕</button>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-[#0A1128]/60 mb-1">Title</p>
                                                <p className="font-medium text-[#0A1128]">{selectedBlog.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#0A1128]/60 mb-1">Author</p>
                                                <p className="text-sm text-[#0A1128]">{selectedBlog.authorName}</p>
                                                <p className="text-xs text-[#0A1128]/50">{selectedBlog.authorEmail}</p>
                                            </div>
                                            {selectedBlog.category && (
                                                <div>
                                                    <p className="text-xs text-[#0A1128]/60 mb-1">Category</p>
                                                    <span className="inline-block px-3 py-1 bg-[#1282A2]/10 text-[#1282A2] text-xs font-medium rounded-full">
                                                        {selectedBlog.category}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-xs text-[#0A1128]/60 mb-1">Submitted</p>
                                                <p className="text-sm text-[#0A1128]">{selectedBlog.submittedAt}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#0A1128]/60 mb-1">Status</p>
                                                {statusBadge(selectedBlog.status)}
                                            </div>
                                            {selectedBlog.reviewedBy && (
                                                <div>
                                                    <p className="text-xs text-[#0A1128]/60 mb-1">Reviewed by</p>
                                                    <p className="text-sm text-[#0A1128]">{selectedBlog.reviewedBy}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-xs text-[#0A1128]/60 mb-1">Excerpt</p>
                                                <p className="text-sm text-[#0A1128]/80 leading-relaxed">{selectedBlog.excerpt}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#0A1128]/60 mb-2">Featured Image</p>
                                                {selectedBlog.imageUrl ? (
                                                    <img
                                                        src={selectedBlog.imageUrl}
                                                        alt="Blog featured"
                                                        className="w-full h-40 object-cover rounded-lg border border-[#0A1128]/10"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-24 bg-[#0A1128]/5 border border-[#0A1128]/10 rounded-lg">
                                                        <p className="text-xs text-[#0A1128]/40">No image provided</p>
                                                    </div>
                                                )}
                                            </div>
                                            {selectedBlog.status === 'PENDING' && (
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={() => handleApprove(selectedBlog.id)}
                                                        disabled={actionLoading === selectedBlog.id}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm disabled:opacity-60"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(selectedBlog.id, selectedBlog.title)}
                                                        disabled={actionLoading === selectedBlog.id}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm disabled:opacity-60"
                                                    >
                                                        <XCircle className="w-4 h-4" /> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Eye className="w-12 h-12 text-[#0A1128]/20 mx-auto mb-3" />
                                        <p className="text-[#0A1128]/50 text-sm">Select a blog to preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Rejection Reason Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[#0A1128]">Reject Blog</h3>
                            <button onClick={() => setRejectModal(null)} className="text-[#0A1128]/40 hover:text-[#0A1128] text-xl leading-none">&#x2715;</button>
                        </div>
                        <p className="text-sm text-[#0A1128]/70 mb-1">
                            You are rejecting: <span className="font-semibold text-[#0A1128]">"{rejectModal.blogTitle}"</span>
                        </p>
                        <p className="text-sm text-[#0A1128]/60 mb-4">
                            The author will see this reason in their notifications.
                        </p>
                        <label className="block text-sm font-medium text-[#0A1128] mb-2">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            placeholder="e.g. Content does not meet our guidelines, please revise and resubmit..."
                            rows={4}
                            className="w-full border-2 border-[#0A1128]/20 rounded-lg px-3 py-2 text-sm text-[#0A1128] resize-none focus:outline-none focus:border-red-400 transition-colors"
                        />
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setRejectModal(null)}
                                className="flex-1 py-2 border-2 border-[#0A1128]/20 text-[#0A1128]/60 hover:border-[#0A1128]/40 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={!rejectionReason.trim()}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <XCircle className="w-4 h-4" /> Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}