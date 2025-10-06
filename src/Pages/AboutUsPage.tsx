import React from "react";
import Navbar from "../Components/Navbar.tsx";

const team = [
    {
        name: "Dr. Anya Sharma",
        role: "CEO & Founder",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Ethan Carter",
        role: "Head of Technology",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Olivia Bennett",
        role: "Director of Outreach",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
];

const AboutUsPage: React.FC = () => (
    <div className="min-h-screen bg-[#070c23] text-white font-sans pt-20">
        {/* Navbar */}
        <Navbar />
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-[64px] font-semibold mb-4">About Planetarium</h1>
            <p className="text-center text-gray-300 mb-8">
                Discover the story behind our mission to bring the wonders of the universe closer to you.
            </p>

            <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
                    <p className="text-gray-200 mb-6">
                        <span className="font-bold">At Cosmos,</span> our mission is to make the wonders of the universe accessible to everyone. We strive to create a platform that not only facilitates easy booking of planetarium experiences but also enriches understanding and appreciation of astronomy and space exploration.
                    </p>
                    <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
                    <p className="text-gray-200">
                        Our vision is to become the leading platform for planetarium bookings and space-related experiences globally. We aim to inspire curiosity, connect people, foster a community of space enthusiasts, and support planetariums in reaching wider audiences.
                    </p>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <img
                        src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=500&q=80"
                        alt="Planetarium"
                        className="rounded-xl border-2 border-blue-400 shadow-lg w-full max-w-md"
                    />
                </div>
            </div>

            {/* Team Section */}
            <h2 className="text-2xl font-bold text-center mb-2">Meet Our Team</h2>
            <p className="text-center text-gray-300 mb-8">
                Our team is composed of passionate individuals with diverse backgrounds in astronomy, technology, and education.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-10">
                {team.map((member) => (
                    <div key={member.name} className="flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full bg-[#f3e6e3] flex items-center justify-center mb-3 overflow-hidden">
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-36 h-36 object-cover rounded-full"
                            />
                        </div>
                        <div className="text-white font-semibold text-lg text-center">{member.name}</div>
                        <div className="text-gray-400 text-sm text-center">{member.role}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default AboutUsPage;
