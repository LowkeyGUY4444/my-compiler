// import React from 'react';

// const Ranking = () => {
//     return (
//         <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-[#0d1117] text-white">
//             <div className="text-center">
//                 <h1 className="text-2xl font-bold">Ranking will be shown here.............</h1>
//                 <h1 className='text-5xl font-bold'></h1>
//             </div>

//             <div className="text-center">
//                 <h1 className="text-2xl font-bold text-gray-400">Will see in FUTURE</h1>
//             </div>
//         </div>
//     );
// };

// export default Ranking;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineTrophy, HiOutlineArrowLeft, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FaMedal } from "react-icons/fa6";

const Ranking = () => {
    const [rankings, setRankings] = useState([]); // Master list from DB
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // BACKEND INTEGRATION: Fetch all contest results
    useEffect(() => {
        const fetchRankings = async () => {
            try {
                // This endpoint should return users sorted by score (DESC) and time (ASC)
                const response = await fetch("http://localhost:5000/api/contest/leaderboard-all");
                const data = await response.json();
                setRankings(data);
            } catch (error) {
                console.error("Failed to fetch rankings:", error);
                // Fallback for UI testing if backend is offline
                setRankings([
                    { name: "LowkeyGUY", score: 100, timeTaken: 45, language: "python" },
                    { name: "NexusDev", score: 100, timeTaken: 72, language: "cpp" },
                    { name: "CodeAlpha", score: 95, timeTaken: 58, language: "javascript" },
                    { name: "Ankit Thapa", score: 80, timeTaken: 120, language: "java" },
                    { name: "Amit Kumar", score: 75, timeTaken: 90, language: "c" }
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRankings();
    }, []);

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Filter logic for the search bar
    const filteredRankings = rankings.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full bg-[#0F172A] text-[#CBD5E1] font-inter pb-20">
            {/* Header Section */}
            <div className="bg-[#1E293B]/50 border-b border-[#334155] py-10 px-8">
                <div className="max-w-5xl mx-auto">
                    <Link to="/" className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-all mb-6 w-fit">
                        <HiOutlineArrowLeft /> Back to Home
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-white flex items-center gap-3">
                                <HiOutlineTrophy className="text-yellow-500" /> Global Rankings
                            </h1>
                            <p className="text-[#94A3B8] mt-2">The fastest and most accurate minds in CodeVerse.</p>
                        </div>
                        <div className="relative">
                            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
                            <input
                                type="text"
                                placeholder="Search coder..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#020617] border border-[#334155] rounded-lg py-2 pl-10 pr-4 outline-none focus:border-blue-500 text-sm w-full md:w-64"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Table */}
            <main className="max-w-5xl mx-auto mt-10 px-8">
                <div className="bg-[#1E293B]/20 border border-[#334155] rounded-2xl overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1E293B]/50 text-[#94A3B8] text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Language</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#334155]">
                            {filteredRankings.map((user) => {
                                // PERSISTENT RANK CALCULATION
                                // We find the user's index in the MASTER 'rankings' list, not the filtered one.
                                const globalRankIndex = rankings.findIndex(r => r.name === user.name);

                                return (
                                    <tr key={user.name} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-sm">
                                            {globalRankIndex === 0 ? <FaMedal className="text-yellow-500 text-xl" title="1st Place" /> :
                                                globalRankIndex === 1 ? <FaMedal className="text-gray-400 text-xl" title="2nd Place" /> :
                                                    globalRankIndex === 2 ? <FaMedal className="text-[#CD7F32] text-xl" title="3rd Place" /> :
                                                        `#${globalRankIndex + 1}`}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="text-white font-bold">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] bg-[#020617] border border-[#334155] px-2 py-1 rounded uppercase font-bold text-[#60A5FA]">
                                                {user.language}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-mono text-sm text-[#94A3B8]">
                                            {formatTime(user.timeTaken)}
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-white text-lg">
                                            {user.score}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredRankings.length === 0 && !isLoading && (
                        <div className="py-20 text-center text-[#475569] bg-[#020617]/50">
                            No contestants found matching "{searchTerm}"
                        </div>
                    )}

                    {isLoading && (
                        <div className="py-20 text-center text-blue-500 animate-pulse font-bold tracking-widest">
                            FETCHING GLOBAL RANKINGS...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Ranking;