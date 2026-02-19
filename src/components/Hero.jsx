import { FaPlay, FaTrophy, FaMedal } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Hero() {
    const [topPerformers, setTopPerformers] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("URL"); // yata url hal backend ko user utaunxa
                const data = await response.json();
                setTopPerformers(data);
            } catch (error) {
                console.error("Leaderboard fetch failed:", error);
                setTopPerformers([
                    { name: "LowkeyGUY", score: 100, time: "00:45" },
                    { name: "NexusDev", score: 100, time: "01:12" },
                    { name: "CodeAlpha", score: 95, time: "00:58" }
                ]);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <section className="bg-[#0F172A] min-h-[600px] flex items-center px-10 py-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                <div>
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-500/10 text-[#60A5FA] px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                            New language support: Java SE 25
                        </span>
                        <span className="bg-blue-500/10 text-[#60A5FA] px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                            Live Contest: To Sum Challenge
                        </span>
                    </div>
                    <h1 className="text-6xl font-black text-white mt-4 leading-tight">
                        Compile, Run, and <span className="text-blue-500">Compete.</span>
                    </h1>
                    <p className="text-[#94A3B8] text-lg mt-6 max-w-lg">
                        Master algorithms on our high-performance judge. Join thousands of developers and climb the global leaderboard.
                    </p>
                    <div className="mt-10 flex space-x-4">
                        <Link to="/playground" className="flex items-center justify-center gap-2 bg-white text-[#0F172A] px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all">
                            <FaPlay />
                            <span>Start Coding</span>
                        </Link>
                        <Link to="/leaderboard" className="border border-[#334155] text-white px-8 py-3 rounded-lg font-medium hover:bg-white/5 transition-all">
                            View Rankings
                        </Link>
                    </div>
                </div>

                <div className="relative bg-[#1E293B]/30 border border-[#334155] p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-white font-bold text-xl flex items-center gap-2">
                            <FaTrophy className="text-yellow-500" /> Current Leaders
                        </h3>
                        <span className="text-[#94A3B8] text-xs font-mono uppercase tracking-widest">Two Sum Contest</span>
                    </div>

                    <div className="space-y-4">
                        {topPerformers.map((user, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${index === 0 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-[#0F172A]/50 border-[#334155]'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                            index === 1 ? 'bg-gray-300 text-black' :
                                                'bg-[#CD7F32] text-black'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        {index === 0 && <FaTrophy className="absolute -top-2 -right-2 text-yellow-500 text-sm animate-bounce" />}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{user.name}</p>
                                        <p className="text-[#94A3B8] text-xs">Score: {user.score}/100</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-mono font-bold text-sm">{user.time}</p>
                                    <p className="text-[#94A3B8] text-[10px] uppercase tracking-tighter">Time Taken</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute -inset-1 bg-blue-500/10 blur-3xl rounded-full -z-10"></div>
                </div>
            </div>
        </section>
    );
}