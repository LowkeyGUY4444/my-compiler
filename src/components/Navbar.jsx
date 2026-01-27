import React, { useState } from 'react';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <nav className="sticky top-0 h-16 w-full flex items-center justify-between px-10 bg-[#1E293B]/80 backdrop-blur-md border-b border-[#334155] z-50">
                <Link to="/" className="text-2xl font-extrabold text-white">
                    Code<span className="text-[#3B82F6]">Verse</span>
                </Link>

                <div className="hidden md:flex space-x-8 text-[#94A3B8] font-medium">
                    <Link to="/problems" className="hover:text-white">Problems</Link>
                    <Link to="/contests" className="hover:text-white">Contests</Link>
                    <Link to="/playground" className="hover:text-white">Playground</Link>
                </div>

                {/* Profile Icon */}
                <div className="flex items-center">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-[#94A3B8] hover:text-white transition-colors"
                    >
                        <HiOutlineUserCircle size={32} />
                    </button>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60]"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar Content */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-[#1E293B] z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-white text-xl font-bold">Account</h2>
                        <button onClick={closeSidebar} className="text-[#94A3B8] hover:text-white">
                            <IoClose size={28} />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Link
                            to="/login"
                            onClick={closeSidebar}
                            className="w-full py-3 text-center text-white border border-[#334155] rounded-lg font-semibold hover:bg-white/5 transition-all"
                        >
                            Log in
                        </Link>
                    </div>

                    <p className="text-[#64748B] text-xs mt-10 text-center">
                        Join CodeVerse to track your progress and compete in contests.
                    </p>
                </div>
            </div>
        </>
    );
}