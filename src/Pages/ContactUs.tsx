import React, { useState } from 'react';
import { Mail, Phone, Hash, Twitter, Instagram, Facebook } from 'lucide-react';
import Navbar from "../Components/Navbar.tsx";

const ContactUsPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-[#0A1128]">
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto pt-16 pb-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-slate-300">
                        We're here to help! Reach out to us with any questions or feedback.
                    </p>
                </div>

                {/* Contact Form and Info Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-slate-900 border-2 border-teal-500 rounded-2xl p-6">
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-white font-semibold mb-2 text-lg">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your Name"
                                    className="w-full px-4 py-3 bg-slate-800 border-0 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-white font-semibold mb-2 text-lg">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-slate-800 border-0 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block text-white font-semibold mb-2 text-lg">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Enter your message"
                                    rows={8}
                                    className="w-full px-4 py-3 bg-slate-800 border-0 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors text-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </div>

                    {/* Other Ways to Reach Us */}
                    <div className="bg-slate-900 border-2 border-teal-500 rounded-2xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">
                            Other Ways to Reach Us
                        </h2>

                        <div className="space-y-8">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-transparent border-2 border-teal-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="text-teal-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Email</h3>
                                    <a href="mailto:planetarium@gmail.com" className="text-slate-300 hover:text-teal-400 transition-colors">
                                        planetarium@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-transparent border-2 border-teal-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="text-teal-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Phone</h3>
                                    <a href="tel:+94111234567" className="text-slate-300 hover:text-teal-400 transition-colors">
                                        +94 11 123 4567
                                    </a>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-transparent border-2 border-teal-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Hash className="text-teal-400" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1">Social Media</h3>
                                    <p className="text-slate-300 mb-4">Connect with us on social media</p>

                                    {/* Social Icons */}
                                    <div className="flex gap-4">
                                        <a
                                            href="#"
                                            className="w-12 h-12 bg-transparent border-2 border-white rounded-full flex items-center justify-center hover:bg-teal-500 hover:border-teal-500 transition-all"
                                            aria-label="Twitter"
                                        >
                                            <Twitter className="text-white" size={20} />
                                        </a>
                                        <a
                                            href="#"
                                            className="w-12 h-12 bg-transparent border-2 border-white rounded-full flex items-center justify-center hover:bg-teal-500 hover:border-teal-500 transition-all"
                                            aria-label="Instagram"
                                        >
                                            <Instagram className="text-white" size={20} />
                                        </a>
                                        <a
                                            href="#"
                                            className="w-12 h-12 bg-transparent border-2 border-white rounded-full flex items-center justify-center hover:bg-teal-500 hover:border-teal-500 transition-all"
                                            aria-label="Facebook"
                                        >
                                            <Facebook className="text-white" size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;