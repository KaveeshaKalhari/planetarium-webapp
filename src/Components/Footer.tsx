import { Mail, Phone, MapPin, Rocket } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#0A1128] text-[#FEFCFB] mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Rocket className="w-6 h-6 text-[#1282A2]" />
                            <span className="text-lg font-semibold">Smart Planetarium</span>
                        </div>
                        <p className="text-[#FEFCFB]/70">
                            Experience the cosmos like never before. Book your journey through the stars.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/shows" className="text-[#FEFCFB]/70 hover:text-[#1282A2] transition-colors">Shows</a></li>
                            <li><a href="/blogs" className="text-[#FEFCFB]/70 hover:text-[#1282A2] transition-colors">Blogs</a></li>
                            <li><a href="/about" className="text-[#FEFCFB]/70 hover:text-[#1282A2] transition-colors">About Us</a></li>
                            <li><a href="/contact" className="text-[#FEFCFB]/70 hover:text-[#1282A2] transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-[#FEFCFB]/70">
                                <Mail className="w-4 h-4" />
                                <span>contact@smartplanetarium.edu</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#FEFCFB]/70">
                                <Phone className="w-4 h-4" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2 text-[#FEFCFB]/70">
                                <MapPin className="w-4 h-4" />
                                <span>123 University Ave, Science Building</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#FEFCFB]/10 mt-8 pt-8 text-center text-[#FEFCFB]/50">
                    <p>&copy; 2026 Smart Planetarium Booking & Experience Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
