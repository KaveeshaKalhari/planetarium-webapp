import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from "../Components/Navbar.tsx";

interface BlogPost {
    id: number;
    title: string;
    description: string;
    image: string;
}

const CosmosBlogsPage: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const blogPosts: BlogPost[] = [
        {
            id: 1,
            title: "The Wonders of the Orion Nebula",
            description: "Dive into the heart of the Orion Nebula, a stellar nursery teeming with young stars and glowing gas.",
            image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop"
        },
        {
            id: 2,
            title: "The Future of Space Tourism",
            description: "Explore the exciting possibilities and challenges of space tourism, making space accessible to everyone.",
            image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop"
        },
        {
            id: 3,
            title: "Understanding Black Holes",
            description: "Unravel the mysteries of black holes, regions of spacetime where gravity is so strong that nothing can escape.",
            image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=600&h=400&fit=crop"
        },
        {
            id: 4,
            title: "Mars Exploration Mission",
            description: "Discover the latest findings from Mars rovers and the potential for human colonization of the Red Planet.",
            image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&h=400&fit=crop"
        },
        {
            id: 5,
            title: "The Beauty of Saturn's Rings",
            description: "Learn about the composition and formation of Saturn's magnificent ring system and its moons.",
            image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&h=400&fit=crop"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % (blogPosts.length - 2));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + (blogPosts.length - 2)) % (blogPosts.length - 2));
    };

    const visiblePosts = blogPosts.slice(currentSlide, currentSlide + 3);

    return (
        <div className="min-h-screen bg-[#0A1128]">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Cosmos Blogs
                    </h1>
                    <p className="text-lg text-slate-300 max-w-4xl mx-auto">
                        Explore the latest articles, news, and discoveries in the world of astronomy. From deep-sky wonders to the future of space exploration, our blog is your portal to the universe.
                    </p>
                </div>

                {/* Blog Cards Carousel */}
                <div className="relative">
                    <div className="flex items-center justify-center gap-6">
                        {/* Previous Button */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 z-10 w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="text-white" size={28} />
                        </button>

                        {/* Blog Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-16">
                            {visiblePosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-slate-900 border-2 border-teal-500 rounded-2xl overflow-hidden hover:border-teal-400 transition-all cursor-pointer group"
                                >
                                    {/* Image */}
                                    <div className="overflow-hidden bg-slate-800">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold text-white mb-3">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {post.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 z-10 w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
                            aria-label="Next"
                        >
                            <ChevronRight className="text-white" size={28} />
                        </button>
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: blogPosts.length - 2 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                currentSlide === index ? 'bg-teal-500 w-8' : 'bg-slate-600'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CosmosBlogsPage;