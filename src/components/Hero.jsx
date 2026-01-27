import { FaPlay } from "react-icons/fa6";
import heroImage from "../assets/HeroImage.png";

export default function Hero() {
    return (
        <section className="bg-[#0F172A] min-h-[500px] flex items-center px-10 py-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                    <span className="bg-blue-500/10 text-[#60A5FA] px-3 py-1 rounded-full text-xs font-medium">New: Python 3.11 Support</span>
                    <h1 className="text-6xl font-black text-white mt-4 leading-tight">Compile, Run, and Deploy.</h1>
                    <p className="text-[#94A3B8] text-lg mt-6 max-w-lg">Master algorithms with our next-gen online judge. Support for 40+ languages and real-time feedback.</p>
                    <div className="mt-10 flex space-x-4">
                        <button className="flex items-center justify-center gap-2 bg-white text-[#0F172A] px-8 py-3 rounded-lg font-bold">
                            <FaPlay />
                            <span>Start Coding</span>
                        </button>
                        <button className="border border-[#334155] text-white px-8 py-3 rounded-lg font-medium hover:bg-white/5">Recent Code</button>
                    </div>
                </div>
                {/* Right side Visual/IDE goes here */}
                <div className="relative">
                    <img
                        src={heroImage}
                        alt="CodeVerse IDE Preview"
                        className="rounded-xl border border-[#334155] shadow-2xl w-full h-auto object-cover"
                    />
                    <div className="absolute -inset-1 bg-blue-500/20 blur-2xl rounded-full -z-10"></div>
                </div>
            </div>
        </section>
    );
}