import { BoltIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { GiStopwatch } from "react-icons/gi";


export default function Features() {
    const features = [
        {
            title: "Competitive Contests",
            desc: "Solve coding challenges to earn leaderboard glory. Fastest solutions rank highest.",
            icon: <GiStopwatch className="h-8 w-8 text-yellow-400" />,
        },
        {
            title: "Multi-Language Support",
            desc: "From C to Java, we support a vast array of compilers and interpreters.",
            icon: <GlobeAltIcon className="h-8 w-8 text-blue-400" />,
        },
        {
            title: "Deep Analytics",
            desc: "Visualize your code, gives it a score, and which help for fair leaderboard glory.",
            icon: <ChartBarIcon className="h-8 w-8 text-green-400" />,
        }
    ];

    return (
        <section className="py-24 bg-[#0F172A]">
            <div className="max-w-7xl mx-auto px-10">
                <h2 className="text-center text-4xl font-bold text-white mb-16">Why Students Choose CodeEngine</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="bg-[#1E293B] p-10 rounded-2xl border border-transparent hover:border-[#3B82F6] transition-all group">
                            <div className="mb-6">{f.icon}</div>
                            <h3 className="text-white text-2xl font-bold mb-4">{f.title}</h3>
                            <p className="text-[#94A3B8] leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}