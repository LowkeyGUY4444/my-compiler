// import React, { useState, useEffect } from 'react';
// import { HiOutlineTrophy, HiOutlineStop, HiOutlinePlusCircle, HiOutlineExclamationTriangle } from "react-icons/hi2";
// import { toast } from 'sonner';

// const AdminDashboard = () => {
//     const [activeTab, setActiveTab] = useState('contest');
//     const [isContestLive, setIsContestLive] = useState(false);

//     // 1. BACKEND READY: Toggle Contest Status
//     const toggleContestStatus = async (status) => {
//         try {
//             const response = await fetch("http://localhost:5000/api/admin/contest-status", {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ live: status }),
//             });
//             if (response.ok) {
//                 setIsContestLive(status);
//                 toast.success(status ? "Contest is now LIVE" : "Contest ended successfully");
//             }
//         } catch (error) {
//             toast.error("Status update failed");
//         }
//     };

//     const [contestData, setContestData] = useState({
//         title: '', description: '', inputFormat: '', expectedOutput: '', difficulty: 'Easy'
//     });

//     const handleContestSubmit = async (e) => {
//         e.preventDefault();
//         // Check if a contest is already live before publishing new one
//         if (isContestLive) return toast.error("End the current contest before publishing a new one!");

//         try {
//             const response = await fetch("http://localhost:5000/api/admin/create-contest", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(contestData),
//             });
//             if (response.ok) {
//                 toast.success("Contest Published! Now turn it LIVE.");
//                 setContestData({ title: '', description: '', inputFormat: '', expectedOutput: '', difficulty: 'Easy' });
//             }
//         } catch (error) {
//             toast.error("Failed to publish");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#0F172A] text-[#CBD5E1] p-10">
//             <div className="max-w-4xl mx-auto space-y-8">

//                 {/* CONTEST CONTROL PANEL */}
//                 <section className="bg-[#1E293B]/40 border border-[#334155] p-6 rounded-2xl flex items-center justify-between">
//                     <div>
//                         <h2 className="text-white font-bold text-lg">Live Contest Control</h2>
//                         <p className="text-[#94A3B8] text-sm">Status: {isContestLive ? <span className="text-green-500 font-bold">LIVE</span> : <span className="text-red-500 font-bold">ENDED</span>}</p>
//                     </div>
//                     <div className="flex gap-4">
//                         {isContestLive ? (
//                             <button onClick={() => toggleContestStatus(false)} className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all">
//                                 <HiOutlineStop /> End Current Contest
//                             </button>
//                         ) : (
//                             <button onClick={() => toggleContestStatus(true)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-500 transition-all">
//                                 <HiOutlinePlusCircle /> Start / Make Live
//                             </button>
//                         )}
//                     </div>
//                 </section>

//                 {/* FORM SECTION */}
//                 <section className="bg-[#1E293B]/20 border border-[#334155] p-8 rounded-2xl">
//                     <h2 className="text-xl font-bold text-white mb-6">Create New Contest</h2>
//                     <form onSubmit={handleContestSubmit} className="space-y-4">
//                         <input value={contestData.title} onChange={(e) => setContestData({...contestData, title: e.target.value})} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 outline-none" placeholder="Problem Title" required />
//                         <textarea value={contestData.description} onChange={(e) => setContestData({...contestData, description: e.target.value})} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 h-32" placeholder="Task Description" required />
//                         <div className="grid grid-cols-2 gap-4">
//                             <input value={contestData.inputFormat} onChange={(e) => setContestData({...contestData, inputFormat: e.target.value})} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3" placeholder="Input (stdin)" required />
//                             <input value={contestData.expectedOutput} onChange={(e) => setContestData({...contestData, expectedOutput: e.target.value})} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3" placeholder="Expected Output" required />
//                         </div>
//                         <button type="submit" disabled={isContestLive} className={`w-full py-4 rounded-xl font-bold transition-all ${isContestLive ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
//                             {isContestLive ? "End Live Contest to Publish New One" : "Publish New Question"}
//                         </button>
//                     </form>
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineTrophy,
    HiOutlineBookOpen,
    HiOutlinePlusCircle,
    HiOutlineStop,
    HiOutlineDocumentText
} from "react-icons/hi2";
import { toast } from 'sonner';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('contest');
    const [isContestLive, setIsContestLive] = useState(false);

    // 1. BACKEND READY: Toggle Contest Status
    const toggleContestStatus = async (status) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/contest-status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ live: status }),
            });
            if (response.ok) {
                setIsContestLive(status);
                toast.success(status ? "Contest is now LIVE" : "Contest ended successfully");
            }
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    // States for Forms
    const [contestData, setContestData] = useState({
        title: '', description: '', inputFormat: '', expectedOutput: '', difficulty: 'Easy'
    });

    const [resourceData, setResourceData] = useState({
        title: '', category: 'C++', description: '', docLink: '', videoLink: ''
    });

    // 2. Handle Contest Submission
    const handleContestSubmit = async (e) => {
        e.preventDefault();
        if (isContestLive) return toast.error("End the current contest before publishing a new one!");

        try {
            const response = await fetch("http://localhost:5000/api/admin/create-contest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contestData),
            });
            if (response.ok) {
                toast.success("Contest published! Click 'Start' to make it live.");
                setContestData({ title: '', description: '', inputFormat: '', expectedOutput: '', difficulty: 'Easy' });
            }
        } catch (error) {
            toast.error("Failed to connect to backend");
        }
    };

    // 3. Handle Resource Submission
    const handleResourceSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/admin/add-resource", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...resourceData, postedDate: new Date().toLocaleDateString() }),
            });
            if (response.ok) {
                toast.success("Resource added to Problems page!");
                setResourceData({ title: '', category: 'C++', description: '', docLink: '', videoLink: '' });
            }
        } catch (error) {
            toast.error("Failed to connect to backend");
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#CBD5E1] font-inter">
            {/* UPDATED HEADER: Centered Title & Left Logo */}
            <header className="bg-[#1E293B]/50 border-b border-[#334155] py-8 px-10">
                <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">

                    {/* LEFT: CodeVerse Logo */}
                    <div className="flex justify-start">
                        <Link to="/" className="text-2xl font-black text-white transition-colors tracking-tighter">
                            Code<span className="text-[#3B82F6]">Engine</span>
                        </Link>
                    </div>

                    {/* CENTER: Centered Dashboard Title */}
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-white leading-tight">Admin Dashboard</h1>
                        <p className="text-[#94A3B8] text-sm mt-1">Manage CodeEngine activities and education.</p>
                    </div>

                    {/* RIGHT: Tab Switcher */}
                    <div className="flex justify-end">
                        <div className="flex bg-[#020617] p-1 rounded-xl border border-[#334155]">
                            <button
                                onClick={() => setActiveTab('contest')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'contest' ? 'bg-blue-600 text-white shadow-lg' : 'text-[#475569] hover:text-[#94A3B8]'}`}
                            >
                                Contests
                            </button>
                            <button
                                onClick={() => setActiveTab('resource')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'resource' ? 'bg-blue-600 text-white shadow-lg' : 'text-[#475569] hover:text-[#94A3B8]'}`}
                            >
                                Resources
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-12 px-6 space-y-8">
                {activeTab === 'contest' ? (
                    <>
                        {/* 1. Live Control Panel */}
                        <section className="bg-[#1E293B]/40 border border-[#334155] p-6 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${isContestLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                <div>
                                    <h3 className="text-white font-bold">Contest Visibility</h3>
                                    <p className="text-xs text-[#94A3B8]">{isContestLive ? "Users can currently participate." : "Contest is hidden/ended."}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleContestStatus(!isContestLive)}
                                className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${isContestLive ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-green-600 text-white hover:bg-green-500'}`}
                            >
                                {isContestLive ? <><HiOutlineStop /> End Contest</> : <><HiOutlinePlusCircle /> Start Contest</>}
                            </button>
                        </section>

                        {/* 2. Contest Creation Form */}
                        <section className="bg-[#1E293B]/20 border border-[#334155] rounded-2xl p-8 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <HiOutlineTrophy className="text-yellow-500" /> New Contest Question
                            </h2>
                            <form onSubmit={handleContestSubmit} className="space-y-4">
                                <input value={contestData.title} onChange={(e) => setContestData({ ...contestData, title: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 outline-none focus:border-blue-500 transition-all" placeholder="Problem Title" required />
                                <textarea value={contestData.description} onChange={(e) => setContestData({ ...contestData, description: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 h-32 outline-none focus:border-blue-500 resize-none" placeholder="Detailed Task Description" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input value={contestData.inputFormat} onChange={(e) => setContestData({ ...contestData, inputFormat: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Input (stdin)" required />
                                    <input value={contestData.expectedOutput} onChange={(e) => setContestData({ ...contestData, expectedOutput: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Expected Output" required />
                                </div>
                                <button type="submit" disabled={isContestLive} className={`w-full py-4 rounded-xl font-bold transition-all ${isContestLive ? 'bg-gray-800 text-[#475569] cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'}`}>
                                    {isContestLive ? "End Live Contest to Publish New One" : "Publish to Contest Section"}
                                </button>
                            </form>
                        </section>
                    </>
                ) : (
                    /* 3. Resource Posting Form */
                    <section className="bg-[#1E293B]/20 border border-[#334155] rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <HiOutlineBookOpen className="text-blue-400" /> Post Educational Content
                        </h2>
                        <form onSubmit={handleResourceSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input value={resourceData.title} onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Resource Title (e.g. Recursion)" required />
                                <select value={resourceData.category} onChange={(e) => setResourceData({ ...resourceData, category: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 outline-none focus:border-blue-500 cursor-pointer">
                                    <option>C++</option><option>Java</option><option>Python</option><option>Web Dev</option><option>Data Structures</option>
                                </select>
                            </div>
                            <textarea value={resourceData.description} onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 h-24 outline-none focus:border-blue-500 resize-none" placeholder="Short description of the resource..." required />
                            <input value={resourceData.docLink} onChange={(e) => setResourceData({ ...resourceData, docLink: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Documentation Link (URL)" required />
                            <input value={resourceData.videoLink} onChange={(e) => setResourceData({ ...resourceData, videoLink: e.target.value })} className="w-full bg-[#020617] border border-[#334155] rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Video Tutorial Link (YouTube URL)" required />
                            <button type="submit" className="w-full bg-white text-[#0F172A] font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                                <HiOutlineDocumentText /> Add to Problem.jsx
                            </button>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;