import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, AlertCircle, Upload, X } from 'lucide-react';
import {Input} from "../../components/ui/input.tsx";
import {Textarea} from "../../components/ui/textarea.tsx";
import {Label} from "../../components/ui/label.tsx";
import UserNavbar from "../../components/UserNavbar.tsx";

export function WriteBlogPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        image: null as File | null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Blog submitted:', formData);
        navigate('/blogs');
    };

    const categories = ['Deep Space', 'Stellar Physics', 'Exoplanets', 'Technology', 'Cosmology', 'Education'];

    return (
        <div className="min-h-screen bg-[#0A1128]">
            {/* Navigation */}
            <UserNavbar />
        <div className="min-h-screen bg-[#FEFCFB]">
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
                <div className="bg-[#1282A2]/10 border border-[#1282A2]/20 p-4 rounded-lg mb-8">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#1282A2] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-[#0A1128] mb-1">Approval Process</p>
                            <p className="text-sm text-[#0A1128]/80">
                                All blog submissions are reviewed by our admin team before publication. You will be notified via email once your blog is approved.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="title">Blog Title</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter an engaging title for your blog"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 bg-[#FEFCFB] border-[#0A1128]/20"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="mt-1 w-full px-3 py-2 bg-[#FEFCFB] border border-[#0A1128]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1282A2]"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Write your blog content here... Share your insights, discoveries, or knowledge about astronomy and space science."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="mt-1 bg-[#FEFCFB] border-[#0A1128]/20 min-h-[400px]"
                                required
                            />
                            <p className="text-sm text-[#0A1128]/60 mt-2">
                                Minimum 200 words recommended for quality content
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="image">Featured Image (Optional)</Label>
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

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-md transition-colors font-medium"
                            >
                                Submit for Approval
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/blogs')}
                                className="flex-1 py-3 border-2 border-[#034078] text-[#034078] hover:bg-[#034078] hover:text-white rounded-md transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-[#0A1128] mb-3">Writing Guidelines</h3>
                    <ul className="space-y-2 text-sm text-[#0A1128]/80">
                        <li>• Ensure your content is original and fact-checked</li>
                        <li>• Include proper citations for scientific claims</li>
                        <li>• Write in clear, accessible language suitable for a general audience</li>
                        <li>• Avoid plagiarism - all submissions are checked for originality</li>
                        <li>• Be respectful and maintain academic integrity</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    );
}