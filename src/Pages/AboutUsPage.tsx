import React from 'react';
import Navbar from "../Components/Navbar.tsx";
import audience from "../assets/audience.png";

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
}

const AboutUsPage: React.FC = () => {
    const teamMembers: TeamMember[] = [
        {
            id: 1,
            name: "Dr. Anya Sharma",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
        },
        {
            id: 2,
            name: "Ethan Carter",
            role: "Head of Technology",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
        },
        {
            id: 3,
            name: "Olivia Bennett",
            role: "Director of Outreach",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A1128]">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 mt-6">
                        About Planetarium
                    </h1>
                    <p className="text-lg text-slate-300 max-w-4xl mx-auto">
                        Discover the story behind our mission to bring the wonders of the universe closer to you.
                    </p>
                </div>

                {/* Mission and Vision Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Left Column - Mission and Vision */}
                    <div className="space-y-8">
                        {/* Our Mission */}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Our Mission
                            </h2>
                            <p className="text-slate-300 leading-relaxed">
                                At Cosmos, our mission is to make the wonders of the universe accessible to everyone. We strive to create a space where curiosity meets discovery, offering not just a planetarium experience but also enriches understanding and appreciation of astronomy and space exploration.
                            </p>
                        </div>

                        {/* Our Vision */}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Our Vision
                            </h2>
                            <p className="text-slate-300 leading-relaxed">
                                Our vision is to become the leading platform for planetarium bookings and space-related experiences. We aim to connect people with the cosmos, inspire a new generation of space explorers, and make the wonders of the universe accessible to all. We dream of fostering a community of space enthusiasts and support planetariums in reaching wider audiences.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="flex items-center justify-center">
                        <div className="border-2 border-teal-500 rounded-2xl overflow-hidden w-full h-full min-h-[400px]">
                            <img
                                src={audience}
                                alt="Planetarium"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Meet Our Team Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Meet Our Team
                    </h2>
                    <p className="text-lg text-slate-300 max-w-4xl mx-auto">
                        Our team is composed of passionate individuals with diverse backgrounds in astronomy, technology, and education.
                    </p>
                </div>

                {/* Team Members Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto pb-16">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="flex flex-col items-center">
                            {/* Avatar */}
                            <div className="w-48 h-48 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-orange-200 to-orange-300">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Name and Role */}
                            <h3 className="text-xl font-bold text-white mb-1">
                                {member.name}
                            </h3>
                            <p className="text-slate-300 text-sm">
                                {member.role}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;