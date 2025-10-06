import React, { useState } from "react";
import Navbar from "../Components/Navbar.tsx";

const blogs = [
    {
        title: "The Wonders of the Orion Nebula",
        description:
            "Dive into the heart of the Orion Nebula, a stellar nursery teeming with young stars and glowing gas.",
        image:
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    },
    {
        title: "The Future of Space Tourism",
        description:
            "Explore the exciting possibilities and challenges of space tourism, making space accessible to everyone.",
        image:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
        title: "Understanding Black Holes",
        description:
            "Unravel the mysteries of black holes, regions of spacetime where gravity is so strong that nothing can escape.",
        image:
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
];

const BlogCard = ({ blog }: { blog: typeof blogs[0] }) => (
    <div className="bg-[#0a1a3c] border-2 border-cyan-400 rounded-lg p-4 w-80 flex flex-col items-center text-white">
        <img src={blog.image} alt={blog.title} className="h-40 w-full object-cover rounded mb-4" />
        <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
        <p className="text-sm">{blog.description}</p>
    </div>
);

const BlogPage: React.FC = () => {
    const [start, setStart] = useState(0);

    const prev = () => setStart((s) => (s === 0 ? blogs.length - 3 : s - 1));
    const next = () => setStart((s) => (s === blogs.length - 3 ? 0 : s + 1));

    return (
        <div className="min-h-screen bg-[#0A1128] text-white flex flex-col pt-20">
        <Navbar />
            <div className="text-center mt-6">
                <h1 className="text-[64px] font-semibold mb-4">Cosmos Blogs</h1>
                <p className="text-white-300 mb-6 px-4">
                    Explore the latest articles, news, and discoveries in the world of astronomy. From deep-sky wonders to the future of space exploration, our blog is your portal to the universe.
                </p>
            </div>
            <div className="flex items-center justify-center mt-8">
                <button onClick={prev} className="text-white text-3xl px-4 hover:text-cyan-400">&#60;</button>
                <div className="flex space-x-8">
                    {blogs.slice(start, start + 3).map((blog, idx) => (
                        <BlogCard blog={blog} key={idx} />
                    ))}
                </div>
                <button onClick={next} className="text-white text-3xl px-4 hover:text-cyan-400">&#62;</button>
            </div>
        </div>
    );
};

export default BlogPage;
