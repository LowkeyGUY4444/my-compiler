export default function Footer() {
    return (
        <footer className="bg-[#020617] h-20 flex items-center border-t border-[#1E293B]">
            <div className="max-w-7xl mx-auto w-full px-10 flex justify-between items-center text-[#64748B] text-sm">
                {/* Left Content */}
                <div>
                    © 2026 <span className="text-white font-semibold">CodeEngine</span> Inc.
                </div>

                {/* Right Content */}
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Help</a>
                </div>
            </div>
        </footer>
    );
}