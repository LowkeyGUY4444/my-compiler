import { BoltIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Features() {
    const features = [
        {
            title: "Instant Judging",
            desc: "Code is evaluated against test cases in milliseconds with detailed runtime analysis.",
            icon: <BoltIcon className="h-8 w-8 text-yellow-400" />,
        },
        {
            title: "50+ Languages",
            desc: "From Assembly to Zig, we support a vast array of compilers and interpreters.",
            icon: <GlobeAltIcon className="h-8 w-8 text-blue-400" />,
        },
        {
            title: "Deep Analytics",
            desc: "Visualize your code performance, memory usage, and compare with other solutions.",
            icon: <ChartBarIcon className="h-8 w-8 text-green-400" />,
        }
    ];

    return (
        <section className="py-24 bg-[#0F172A]">
            <div className="max-w-7xl mx-auto px-10">
                <h2 className="text-center text-4xl font-bold text-white mb-16">Why Developers Choose CodeVerse</h2>
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