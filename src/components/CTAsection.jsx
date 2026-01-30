import { FaPlay } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function CTASection() {
    return (
        <section className="h-[300px] bg-gradient-to-b from-[#1E3A8A] to-black flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-white text-3xl md:text-[32px] font-bold mb-8">
                Ready to compile your first Code?
            </h2>
            <Link to="/playground" className="flex items-center justify-center gap-2 bg-white text-[#0F172A] px-8 py-3 rounded-lg font-bold">
                <FaPlay />
                <span>Start Coding</span>
            </Link>
        </section>
    );
}