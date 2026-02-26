import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineArrowLeft,
    HiOutlineCommandLine,
    HiOutlineMagnifyingGlass,
    HiOutlineTrash
} from "react-icons/hi2";
import { toast } from 'sonner';

export default function AllCodes() {
    const [savedCodes, setSavedCodes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // 1. BACKEND INTEGRATION: Fetch all snippets
    useEffect(() => {
        const fetchAllCodes = async () => {
            try {
                // Adjust this URL to match your Express backend route
                const response = await fetch("http://localhost:5000/api/playground/all");
                const data = await response.json();

                // DEBUG: Check what your MongoDB is sending
                console.log("💾 Received Saved Codes:", data);
                setSavedCodes(data);
            } catch (error) {
                console.error("Fetch failed:", error);
                toast.error("Could not sync with database");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllCodes();
    }, []);

    // 2. DELETE LOGIC: Remove code from MongoDB
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this code?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/playground/delete/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                // Update UI by removing the deleted item from state
                setSavedCodes(savedCodes.filter(item => item._id !== id));
                toast.success("Code deleted permanently");
            }
        } catch (error) {
            toast.error("Failed to delete code");
        }
    };

    const filteredCodes = savedCodes.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.language.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#CBD5E1] font-inter pb-20">
            {/* Header Area */}
            <div className="bg-[#1E293B]/50 border-b border-[#334155] py-10 px-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <Link to="/" className="text-[#94A3B8] hover:text-white flex items-center gap-2 mb-4 transition-all">
                            <HiOutlineArrowLeft /> Back to Home
                        </Link>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Your CodeVerse Archive</h1>
                        <p className="text-[#94A3B8] mt-1 italic">Everything you've built, saved in one place.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
                        <input
                            type="text"
                            placeholder="Filter by title or language..."
                            className="w-full bg-[#020617] border border-[#334155] rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-10 mt-12">
                <div className="overflow-hidden rounded-2xl border border-[#334155] bg-[#1E293B]/20 backdrop-blur-sm shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#1E293B]/80 text-[#64748B] text-[10px] uppercase font-bold tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Language</th>
                                <th className="px-6 py-4">Solving Time</th>
                                <th className="px-6 py-4 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#334155]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-blue-500 font-bold tracking-widest text-xs uppercase">Connecting to MongoDB...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCodes.map((item) => (
                                <tr key={item._id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-5 text-white font-bold">{item.title}</td>
                                    <td className="px-6 py-5">
                                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded text-[10px] font-black uppercase border border-blue-500/20">
                                            {item.language}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 font-mono text-sm text-[#94A3B8]">
                                        {formatTime(item.timeTaken || 0)}
                                    </td>
                                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                                        {/* This Link takes you back to the playground to edit that specific code */}
                                        <Link
                                            to={`/playground/${item._id}`}
                                            className="text-white bg-[#3B82F6] px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
                                        >
                                            <HiOutlineCommandLine /> Edit Code
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-400 bg-red-400/5 border border-red-400/20 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                            title="Delete permanently"
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!isLoading && filteredCodes.length === 0 && (
                        <div className="py-24 text-center">
                            <p className="text-[#475569] font-medium">No results found in your code history.</p>
                            <Link to="/playground" className="text-blue-500 text-sm mt-2 block hover:underline">Start a new project &rarr;</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}