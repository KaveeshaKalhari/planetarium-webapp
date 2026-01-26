import { useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

export function BlogApproval() {
    const [selectedBlog, setSelectedBlog] = useState<any>(null);

    const pendingBlogs = [
        {
            id: 1,
            title: 'Understanding Gravitational Waves',
            author: 'John Parker',
            email: 'john.parker@email.com',
            category: 'Deep Space',
            submittedDate: 'Jan 24, 2026',
            wordCount: 1250,
            excerpt: 'Gravitational waves are ripples in spacetime caused by some of the most violent and energetic processes in the Universe...',
            content: 'Full blog content here...',
            status: 'Pending',
            image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800'
        },
        {
            id: 2,
            title: 'The Future of Space Exploration',
            author: 'Rachel Green',
            email: 'rachel.green@email.com',
            category: 'Technology',
            submittedDate: 'Jan 23, 2026',
            wordCount: 980,
            excerpt: 'As we look toward the next decade, space exploration is entering an exciting new era with private companies and international collaboration...',
            content: 'Full blog content here...',
            status: 'Pending',
            image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800'
        },
        {
            id: 3,
            title: 'Mars Colonization Challenges',
            author: 'David Kim',
            email: 'david.kim@email.com',
            category: 'Exoplanets',
            submittedDate: 'Jan 22, 2026',
            wordCount: 1540,
            excerpt: 'Establishing a permanent human presence on Mars presents numerous technical, biological, and psychological challenges...',
            content: 'Full blog content here...',
            status: 'Pending',
            image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800'
        }
    ];

    const approvedBlogs = [
        {
            id: 4,
            title: 'Understanding Black Holes',
            author: 'Dr. Sarah Johnson',
            category: 'Deep Space',
            approvedDate: 'Jan 20, 2026',
            status: 'Approved'
        },
        {
            id: 5,
            title: 'The Life Cycle of Stars',
            author: 'Prof. Michael Chen',
            category: 'Stellar Physics',
            approvedDate: 'Jan 18, 2026',
            status: 'Approved'
        }
    ];

    const handleApprove = (blogId: number) => {
        console.log('Approving blog:', blogId);
    };

    const handleReject = (blogId: number) => {
        console.log('Rejecting blog:', blogId);
    };

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Blog Approval</h1>
                    <p className="text-[#0A1128]/70">Review and moderate user-submitted blogs</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Blogs List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-[#0A1128] mb-4">Pending Approval ({pendingBlogs.length})</h2>
                            <div className="space-y-4">
                                {pendingBlogs.map((blog) => (
                                    <div key={blog.id} className="bg-white rounded-lg shadow-lg p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-[#0A1128] mb-1">{blog.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-[#0A1128]/60">
                                                    <span>By {blog.author}</span>
                                                    <span>•</span>
                                                    <span>{blog.category}</span>
                                                    <span>•</span>
                                                    <span>{blog.wordCount} words</span>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        Pending
                      </span>
                                        </div>

                                        <p className="text-[#0A1128]/80 mb-4">{blog.excerpt}</p>

                                        <div className="flex items-center gap-3 pt-4 border-t border-[#0A1128]/10">
                                            <button
                                                onClick={() => setSelectedBlog(blog)}
                                                className="flex items-center gap-2 px-4 py-2 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-md transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => handleApprove(blog.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(blog.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recently Approved */}
                        <div>
                            <h2 className="text-xl font-semibold text-[#0A1128] mb-4">Recently Approved</h2>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-[#0A1128]/5">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#0A1128]/10">
                                    {approvedBlogs.map((blog) => (
                                        <tr key={blog.id} className="hover:bg-[#0A1128]/5">
                                            <td className="px-6 py-4 text-sm font-medium text-[#0A1128]">{blog.title}</td>
                                            <td className="px-6 py-4 text-sm text-[#0A1128]">{blog.author}</td>
                                            <td className="px-6 py-4 text-sm text-[#0A1128]">{blog.category}</td>
                                            <td className="px-6 py-4 text-sm text-[#0A1128]">{blog.approvedDate}</td>
                                            <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            {blog.status}
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                            {selectedBlog ? (
                                <div>
                                    <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Blog Preview</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-[#0A1128]/60 mb-1">Title</p>
                                            <p className="font-medium text-[#0A1128]">{selectedBlog.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#0A1128]/60 mb-1">Author</p>
                                            <p className="text-sm text-[#0A1128]">{selectedBlog.author}</p>
                                            <p className="text-xs text-[#0A1128]/50">{selectedBlog.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#0A1128]/60 mb-1">Category</p>
                                            <span className="inline-block px-3 py-1 bg-[#1282A2]/10 text-[#1282A2] text-xs font-medium rounded-full">
                        {selectedBlog.category}
                      </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#0A1128]/60 mb-1">Submitted</p>
                                            <p className="text-sm text-[#0A1128]">{selectedBlog.submittedDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#0A1128]/60 mb-1">Word Count</p>
                                            <p className="text-sm text-[#0A1128]">{selectedBlog.wordCount} words</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#0A1128]/60 mb-1">Excerpt</p>
                                            <p className="text-sm text-[#0A1128]/80">{selectedBlog.excerpt}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs text-[#0A1128]/60">Featured Image</p>
                                            </div>
                                            <div className="relative">
                                                {selectedBlog.image ? (
                                                    <img
                                                        src={selectedBlog.image}
                                                        alt="Blog featured"
                                                        className="w-full h-40 object-cover rounded-lg border border-[#0A1128]/10"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-40 bg-[#0A1128]/5 border border-[#0A1128]/10 rounded-lg">
                                                        <p className="text-xs text-[#0A1128]/40">No image provided</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Eye className="w-12 h-12 text-[#0A1128]/20 mx-auto mb-3" />
                                    <p className="text-[#0A1128]/50">Select a blog to preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}