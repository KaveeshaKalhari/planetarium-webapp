import React from "react";
import Navbar from "../Components/Navbar";

const ContactUs: React.FC = () => (
    <div className="min-h-screen bg-[#0A1128] text-white flex flex-col pt-20">
        <Navbar />
        <div className="max-w-5xl mx-auto mt-10 px-4">
            <h1 className="text-[64px] font-semibold mb-4">Contact Us</h1>
            <p className="text-center text-white -300 mb-8">
                We're here to help! Reach out to us with any questions or feedback.
            </p>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
                {/* Contact Form */}
                <form className="flex flex-col gap-4 bg-transparent w-full max-w-md">
                    <div>
                        <label className="text-white block mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your Name"
                            className="w-full px-4 py-2 rounded bg-[#1a2340] text-white focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded bg-[#1a2340] text-white focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Message</label>
                        <textarea
                            placeholder="Enter your message"
                            className="w-full px-4 py-2 rounded bg-[#1a2340] text-white h-24 resize-none focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-sky-900 text-white py-2 rounded hover:bg-sky-800 mt-2"
                    >
                        Submit
                    </button>
                </form>
                {/* Contact Info Card */}
                <div className="bg-transparent border-2 border-cyan-400 rounded-lg p-6 w-full max-w-md text-white flex flex-col justify-center">
                    <h2 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h2>
                    <div className="flex items-center mb-3">
            <span className="mr-3">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 12v1a4 4 0 01-8 0v-1" />
                <rect width="20" height="14" x="2" y="5" rx="2" />
              </svg>
            </span>
                        <span>Email</span>
                        <span className="ml-auto text-cyan-300">contactteam@gmail.com</span>
                    </div>
                    <div className="flex items-center mb-3">
            <span className="mr-3">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92V19a2 2 0 01-2 2c-9.94 0-18-8.06-18-18A2 2 0 015 2h2.09a2 2 0 012 1.72c.13 1.06.37 2.09.72 3.08a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.99.35 2.02.59 3.08.72A2 2 0 0122 16.92z" />
              </svg>
            </span>
                        <span>Phone</span>
                        <span className="ml-auto text-cyan-300">+94 11 123 4567</span>
                    </div>
                    <div className="flex items-center mb-3">
            <span className="mr-3">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
              </svg>
            </span>
                        <span>Social Media</span>
                        <span className="ml-auto text-cyan-300">Connect with us on social media</span>
                    </div>
                    <div className="flex space-x-4 mt-4 justify-center">
                        <a href="#" className="text-cyan-400 hover:text-cyan-300">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.46 6c-.77.35-1.6.59-2.47.69a4.3 4.3 0 001.88-2.37c-.83.5-1.75.87-2.72 1.07A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.15 1.64 4.15c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.83 1.92 3.61a4.28 4.28 0 01-1.94-.54v.05c0 2.09 1.49 3.83 3.47 4.23-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.11 2.9 3.97 2.93A8.6 8.6 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19-.01-.38-.02-.57A8.7 8.7 0 0024 4.59a8.48 8.48 0 01-2.54.7z" />
                            </svg>
                        </a>
                        <a href="#" className="text-cyan-400 hover:text-cyan-300">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.06 8.01 8.96v-6.34h-2.41v-2.62h2.41V9.41c0-2.39 1.44-3.7 3.64-3.7 1.06 0 2.17.19 2.17.19v2.39h-1.22c-1.2 0-1.57.75-1.57 1.52v1.83h2.67l-.43 2.62h-2.24v6.34c4.41-.9 8.01-4.55 8.01-8.96 0-5.5-4.46-9.96-9.96-9.96z" />
                            </svg>
                        </a>
                        <a href="#" className="text-cyan-400 hover:text-cyan-300">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21.94 7.04a8.13 8.13 0 01-2.36.65 4.13 4.13 0 001.81-2.27 8.19 8.19 0 01-2.6.99A4.11 4.11 0 0012 4c-2.27 0-4.11 1.84-4.11 4.11 0 .32.04.64.11.94A11.67 11.67 0 013 5.13a4.11 4.11 0 001.27 5.48 4.07 4.07 0 01-1.86-.51v.05c0 2.02 1.44 3.7 3.36 4.08-.35.1-.72.16-1.1.16-.27 0-.53-.03-.78-.08.53 1.65 2.07 2.85 3.89 2.88A8.24 8.24 0 012 19.54a11.62 11.62 0 006.29 1.84c7.55 0 11.69-6.26 11.69-11.69 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022 6.13a8.13 8.13 0 01-2.36.65z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ContactUs;
