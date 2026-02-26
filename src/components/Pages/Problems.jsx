// import React from 'react';

// const Problems = () => {
//     return (
//         <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-[#0d1117] text-white">
//             <div className="text-center">
//                 <h1 className="text-2xl font-bold">.....I dont know what to put or do in this page.....</h1>
//                 <h1 className='text-5xl font-bold'>HeHeHe</h1>
//             </div>

//             <div className="text-center">
//                 <h1 className="text-2xl font-bold text-gray-400">Will see in FUTURE</h1>
//             </div>
//         </div>
//     );
// };

// export default Problems;

import React, { useState, useEffect } from 'react';
import { HiOutlineBookOpen, HiOutlineVideoCamera, HiOutlineCodeBracketSquare, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { toast } from 'sonner';

const Problems = () => {
    const [resources, setResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // BACKEND INTEGRATION: Fetch educational content posted by admin
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/resources/all");
                const data = await response.json();
                setResources(data);
            } catch (error) {
                console.error("Fetch error:", error);
                // Fallback demo data for UI testing
                setResources([
                    {
                        title: "C++ Inheritance & Polymorphism",
                        category: "C++",
                        description: "Learn how to reuse code and create hierarchical relationships between classes.",
                        docLink: "https://en.cppreference.com/w/cpp/language/derived_class",
                        videoLink: "https://www.youtube.com/results?search_query=cpp+inheritance",
                        postedDate: "2026-02-20"
                    },
                    {
                        title: "Mastering MERN Stack Authentication",
                        category: "Web Dev",
                        description: "A complete guide to securing your CodeVerse app using JWT and Cookies.",
                        docLink: "https://jwt.io/introduction",
                        videoLink: "https://www.youtube.com/results?search_query=mern+stack+auth",
                        postedDate: "2026-02-22"
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResources();
    }, []);

    const filteredResources = resources.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#CBD5E1] font-inter pb-20">
            {/* Header Section */}
            <div className="bg-[#1E293B]/50 border-b border-[#334155] py-16 px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl font-black text-white mb-4">Learning Resources</h1>
                    <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
                        Access official documentation and video tutorials curated by CodeVerse admins to master your coding skills.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-10 relative max-w-xl mx-auto">
                        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] text-xl" />
                        <input
                            type="text"
                            placeholder="Search by topic or language (e.g. C++, Inheritance)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#020617] border border-[#334155] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-white shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Resources Grid */}
            <main className="max-w-6xl mx-auto mt-12 px-8">
                {isLoading ? (
                    <div className="text-center py-20 animate-pulse text-blue-500 font-bold tracking-tighter">
                        LOADING CURATED CONTENT...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((item, index) => (
                            <div key={index} className="bg-[#1E293B]/20 border border-[#334155] p-6 rounded-2xl flex flex-col hover:border-blue-500/50 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-blue-500/20">
                                        {item.category}
                                    </span>
                                    <span className="text-[#475569] text-[10px] font-mono">{item.postedDate}</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 flex-grow">
                                    {item.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <a
                                        href={item.docLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white py-2.5 rounded-lg text-xs font-bold transition-all border border-[#334155]"
                                    >
                                        <HiOutlineBookOpen className="text-blue-400 text-lg" />
                                        Docs
                                    </a>
                                    <a
                                        href={item.videoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] py-2.5 rounded-lg text-xs font-bold transition-all border border-[#ef4444]/20"
                                    >
                                        <HiOutlineVideoCamera className="text-lg" />
                                        Watch
                                    </a>
                                </div>

                                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-[#0F172A] py-3 rounded-lg text-sm font-black hover:bg-gray-200 transition-all">
                                    <HiOutlineCodeBracketSquare className="text-lg" />
                                    Try in Playground
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredResources.length === 0 && (
                    <div className="text-center py-20 text-[#475569]">
                        No resources found matching your search.
                    </div>
                )}
            </main>
        </div>
    );
};

export default Problems;