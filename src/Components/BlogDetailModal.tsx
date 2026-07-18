import { type FC } from "react";

interface BlogPost {
    id: number;
    title: string;
    description: string;
    image: string;
    tag: string;
}

type BlogDetailModalProps = {
    blog: BlogPost | null;
    onClose: () => void;
};

const BlogDetailModal: FC<BlogDetailModalProps> = ({
    blog,
    onClose,
}) => {
    if (!blog) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#0F1834] border border-[#219EBC66] rounded-3xl max-w-2xl w-full overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-xl"
                >
                    ✕
                </button>

                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-72 object-cover"
                />

                <div className="p-8">
                    <span className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-widest bg-[#219EBC22] text-[#219EBC] border border-[#219EBC66] mb-4">
                        {blog.tag}
                    </span>

                    <h2
                        className="text-white text-3xl font-bold mb-4"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        {blog.title}
                    </h2>

                    <p className="text-slate-300 leading-8">
                        {blog.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailModal;