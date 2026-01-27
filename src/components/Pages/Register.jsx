import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleUsernameChange = (e) => {
        // This Regex removes any numeric digits (0-9)
        const value = e.target.value.replace(/[0-9]/g, '');
        setFormData({ ...formData, username: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("REGISTER DATA FOR BACKEND:", formData);
    };

    return (
        <div className="min-h-screen w-full bg-[#0F172A] relative overflow-hidden font-inter flex flex-col">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3B82F6] opacity-10 blur-[120px] rounded-full -z-10"></div>

            <header className="h-16 w-full flex items-center justify-between px-10 z-10">
                <Link to="/" className="text-2xl font-extrabold text-white">Code<span className="text-[#3B82F6]">Verse</span></Link>
                <div className="text-sm">
                    <span className="text-[#94A3B8]">Already have an account? </span>
                    <Link to="/login" className="text-[#3B82F6] font-semibold hover:underline">Log In</Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-6 z-10">
                <div className="w-full max-w-[480px] bg-[#1E293B] border border-[#334155] rounded-[16px] shadow-2xl p-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Join CodeVerse</h1>
                    <p className="text-[#94A3B8] text-sm mb-8">Start solving problems and climbing the leaderboard.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[#94A3B8] text-sm font-medium mb-2">Username (Letters Only)</label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                className="w-full bg-[#020617] border border-[#334155] text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none"
                                placeholder="coding_wizard"
                                onChange={handleUsernameChange}
                            />
                        </div>
                        <div>
                            <label className="block text-[#94A3B8] text-sm font-medium mb-2">Email</label>
                            <input
                                type="email" required
                                className="w-full bg-[#020617] border border-[#334155] text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none"
                                placeholder="dev@example.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[#94A3B8] text-sm font-medium mb-2">Password</label>
                            <input
                                type="password" required
                                className="w-full bg-[#020617] border border-[#334155] text-white px-4 py-3 rounded-lg outline-none"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-lg transition-all">
                            Create Free Account
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;