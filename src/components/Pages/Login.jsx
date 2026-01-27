import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiGithub, SiGoogle } from "react-icons/si";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("LOGIN DATA FOR BACKEND:", formData);

    };

    return (
        <div className="min-h-screen w-full bg-[#0F172A] relative overflow-hidden font-inter flex flex-col">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3B82F6] opacity-20 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#10B981] opacity-15 blur-[120px] rounded-full -z-10"></div>

            <header className="h-16 w-full flex items-center justify-between px-10 z-10">
                <Link to="/" className="text-2xl font-extrabold text-white">
                    Code<span className="text-[#3B82F6]">Verse</span>
                </Link>
                <div className="text-sm">
                    <span className="text-[#94A3B8]">Need an account? </span>
                    <Link to="/register" className="text-[#3B82F6] font-semibold hover:underline">Sign Up</Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-6 z-10">
                <div className="w-full max-w-[480px] bg-[#1E293B] border border-[#334155] rounded-[16px] shadow-2xl p-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-[#94A3B8] text-sm mb-8">Enter your details to access your coding workspace.</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="flex items-center justify-center gap-2 bg-[#0F172A] border border-[#334155] text-white py-2.5 rounded-lg hover:border-[#94A3B8] transition-all">
                            <SiGithub size={20} /> <span className="font-medium">GitHub</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-[#0F172A] border border-[#334155] text-white py-2.5 rounded-lg hover:border-[#94A3B8] transition-all">
                            <SiGoogle size={18} /> <span className="font-medium">Google</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[#94A3B8] text-sm font-medium mb-2">Email</label>
                            <input
                                type="email" required
                                placeholder="developer@example.com"
                                className="w-full bg-[#020617] border border-[#334155] text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#3B82F6] outline-none"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[#94A3B8] text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} required
                                    className="w-full bg-[#020617] border border-[#334155] text-white px-4 py-3 rounded-lg outline-none"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-3.5 rounded-lg transition-all">
                            Sign in
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;