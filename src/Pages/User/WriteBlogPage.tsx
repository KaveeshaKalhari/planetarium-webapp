import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, AlertCircle, Upload, X, Loader2, CheckCircle } from 'lucide-react';
import { Input } from "../../components/ui/input.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { Label } from "../../components/ui/label.tsx";
import UserNavbar from "../../components/UserNavbar.tsx";
import { submitBlog } from '../../services/api.ts';

const TITLE_MIN = 10;
const TITLE_MAX = 100;
const CONTENT_MIN = 100;
const CONTENT_MAX = 5000;

export function WriteBlogPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null as File | null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const validate = (): string | null => {
        if (formData.title.length < TITLE_MIN)
            return `Title must be at least ${TITLE_MIN} characters.`;
        if (formData.title.length > TITLE_MAX)
            return `Title must not exceed ${TITLE_MAX} characters.`;
        if (formData.content.length < CONTENT_MIN)
            return `Content must be at least ${CONTENT_MIN} characters.`;
        if (formData.content.length > CONTENT_MAX)
            return `Content must not exceed ${CONTENT_MAX} characters.`;
        if (!formData.image)                          // ← add this
            return 'A featured image is required.';
        return null;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        try {
            await submitBlog({
                title: formData.title,
                category: '',
                content: formData.content,
                imageUrl: imagePreview ?? null,
            });

            setSubmitted(true);
            // Redirect to blog page after 2 seconds
            setTimeout(() => navigate('/user-blog'), 2000);

        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Failed to submit blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-[#0A1128] flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#1282A2] p-4 rounded-full">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0A1128] mb-3">
                        Blog Submitted!
                    </h2>
                    <p className="text-[#0A1128]/70 mb-4">
                        Your blog has been submitted for review. Our admin team will approve it shortly.
                        You will be notified once it is published.
                    </p>
                    <p className="text-sm text-[#0A1128]/40">Redirecting to blogs page...</p>
                </div>
            </div>
        );
    }

    // ── Main form ─────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0A1128]">
            <UserNavbar />

            <div className="min-h-screen bg-[#FEFCFB]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0A1128] to-[#001F54] text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <PenSquare className="w-8 h-8" />
                            <div>
                                <h1 className="text-4xl font-bold">Write a Blog</h1>
                                <p className="text-white/90 mt-1">Share your knowledge with the community</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* Approval notice */}
                    <div className="bg-[#1282A2]/10 border border-[#1282A2]/20 p-4 rounded-lg mb-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-[#1282A2] mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-[#0A1128] mb-1">Approval Process</p>
                                <p className="text-sm text-[#0A1128]/80">
                                    All blog submissions are reviewed by our admin team before publication.
                                    You will be notified via email once your blog is approved.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Title */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <Label htmlFor="title">Blog Title</Label>
                                    <span className={`text-xs ${formData.title.length > TITLE_MAX ? 'text-red-500' :
                                        formData.title.length >= TITLE_MIN ? 'text-green-600' :
                                            'text-[#0A1128]/40'
                                        }`}>
                                        {formData.title.length} / {TITLE_MAX}
                                    </span>
                                </div>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Enter an engaging title for your blog"
                                    value={formData.title}
                                    maxLength={TITLE_MAX}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={`mt-1 bg-[#FEFCFB] border-[#0A1128]/20 ${formData.title.length > 0 && formData.title.length < TITLE_MIN ? 'border-red-400' :
                                        formData.title.length >= TITLE_MIN ? 'border-green-400' : ''
                                        }`}
                                    required
                                />
                                {formData.title.length > 0 && formData.title.length < TITLE_MIN && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Minimum {TITLE_MIN} characters ({TITLE_MIN - formData.title.length} more needed)
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <Label htmlFor="content">Content</Label>
                                    <span className={`text-xs ${formData.content.length > CONTENT_MAX ? 'text-red-500' :
                                        formData.content.length >= CONTENT_MIN ? 'text-green-600' :
                                            'text-[#0A1128]/40'
                                        }`}>
                                        {formData.content.length} / {CONTENT_MAX}
                                    </span>
                                </div>
                                <Textarea
                                    id="content"
                                    placeholder="Write your blog content here..."
                                    value={formData.content}
                                    maxLength={CONTENT_MAX}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className={`mt-1 bg-[#FEFCFB] border-[#0A1128]/20 min-h-[400px] ${formData.content.length > 0 && formData.content.length < CONTENT_MIN ? 'border-red-400' :
                                        formData.content.length >= CONTENT_MIN ? 'border-green-400' : ''
                                        }`}
                                    required
                                />
                                <div className="flex justify-between mt-1">
                                    {formData.content.length > 0 && formData.content.length < CONTENT_MIN ? (
                                        <p className="text-xs text-red-500">
                                            Minimum {CONTENT_MIN} characters ({CONTENT_MIN - formData.content.length} more needed)
                                        </p>
                                    ) : (
                                        <p className="text-xs text-[#0A1128]/60">
                                            Minimum {CONTENT_MIN} characters required
                                        </p>
                                    )}
                                    {formData.content.length >= CONTENT_MIN && (
                                        <p className="text-xs text-green-600">✓ Looks good</p>
                                    )}
                                </div>
                            </div>

                            {/* Image upload */}
                            <div>
                                <Label htmlFor="image">Featured Image <span className="text-red-500">*</span></Label>
                                <div className="mt-1">
                                    {!imagePreview ? (
                                        <label
                                            htmlFor="image"
                                            className="flex items-center justify-center gap-2 py-8 px-4 border-2 border-dashed border-[#0A1128]/20 rounded-lg cursor-pointer hover:border-[#1282A2] hover:bg-[#1282A2]/5 transition-colors"
                                        >
                                            <Upload className="w-5 h-5 text-[#1282A2]" />
                                            <span className="text-sm text-[#0A1128]/60">
                                                Click to upload image or drag and drop
                                            </span>
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-w-md w-full h-auto rounded-lg border border-[#0A1128]/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-sm text-[#0A1128]/60 mt-2">
                                        Recommended: 1200x600px, JPG or PNG, max 5MB
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading || formData.title.length < TITLE_MIN || formData.content.length < CONTENT_MIN || !formData.image}
                                    className="flex-1 py-3 bg-[#1282A2] hover:bg-[#034078] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-md transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {loading
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                        : 'Submit for Approval'
                                    }
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/user-blog')}
                                    className="flex-1 py-3 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-md transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Writing guidelines */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold text-[#0A1128] mb-3">Writing Guidelines</h3>
                        <ul className="space-y-2 text-sm text-[#0A1128]/80">
                            <li>• Ensure your content is original and fact-checked</li>
                            <li>• Include proper citations for scientific claims</li>
                            <li>• Write in clear, accessible language suitable for a general audience</li>
                            <li>• Avoid plagiarism — all submissions are checked for originality</li>
                            <li>• Be respectful and maintain academic integrity</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}