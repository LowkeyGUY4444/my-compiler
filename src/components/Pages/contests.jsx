import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlay, HiOutlineCheckCircle, HiOutlineCommandLine, HiOutlineArrowLeft } from "react-icons/hi2";
import { toast } from 'sonner';

const ProblemWorkspace = () => {
    const starterCode = {
        "c": "// write your code here\n",
        "c++": "// write your code here\n",
        "python": "# write your code here\n",
        "javascript": "//write your code here\n",
        "java": "//write your code here\n"
    };

    const languageMap = {
        "c": { id: 50 },
        "c++": { id: 54 },
        "python": { id: 71 },
        "javascript": { id: 63 },
        "java": { id: 62 }
    };

    const [session, setSession] = useState({
        code: starterCode["javascript"],
        language: "javascript",
        output: "",
        timeTaken: 0
    });

    const [seconds, setSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerRef = useRef(null);

    const lineNumbers = session.code.split('\n').length;

    // Timer Logic: yesle track garxa how long the user takes to solve the challenge
    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isTimerRunning]);

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleCodeChange = (e) => {
        setSession({ ...session, code: e.target.value });
        if (!isTimerRunning) setIsTimerRunning(true);
    };

    // 1. RUN CODE: Basic execution via  backend..............................
    const runCode = async () => {
        const runPayload = {
            code: session.code,
            language: session.language,
            stdin: "2 7 11 15 9"
        };

        console.log("Payload to Backend:", runPayload);

        setIsLoading(true);
        setSession(prev => ({ ...prev, output: "Compiling and Running..." }));

        try {
            const response = await fetch("URL", {//  URL yata hal
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(runPayload),
            });

            const data = await response.json();
            console.log("RUN - Response:", data);

            const output = data.stdout || data.stderr || data.compile_output || "Execution finished with no output.";
            setSession(prev => ({ ...prev, output: output }));
            toast.success("Run complete");
        } catch (error) {
            toast.error("Backend unreachable");
            setSession(prev => ({ ...prev, output: "> Error: Failed to connect to your Node.js server." }));
        } finally {
            setIsLoading(false);
        }
    };

    // 2. SUBMIT CODE: Final Grading via your backend
    const handleSubmit = async () => {
        const submitPayload = {
            title: "Two Sum",
            code: session.code,
            language: session.language,
            timeTaken: seconds,
            expectedOutput: "[0, 1]"
        };

        console.log("🏆 [CONTEST] SUBMIT - Payload to Backend:", submitPayload);

        setIsSubmitting(true);
        setIsTimerRunning(false);
        setSession(prev => ({ ...prev, output: "Judging Submission..." }));

        try {
            const response = await fetch("URL", { // Code save garne backend URL yata hal
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitPayload),
            });

            const data = await response.json();
            console.log("[CONTEST] SUBMIT - Response:", data);

            //Judge0 status yata bata handle hunxa backend bata
            if (data.status?.id === 3) { //  yadi accepted hunxa vane?????
                setSession(prev => ({
                    ...prev,
                    output: `> STATUS: ${data.status.description}\n> SCORE: 100/100\n> TIME: ${data.time}s\n> SOLVED IN: ${formatTime(seconds)}`
                }));
                toast.success("Accepted: 100/100!");
            } else {
                setSession(prev => ({
                    ...prev,
                    output: `> STATUS: ${data.status?.description || 'Error'}\n> SCORE: 0/100\n${data.stdout || data.stderr || ""}`
                }));
                toast.error(`Failed: ${data.status?.description}`);
                setIsTimerRunning(true); //  natra resume timer to let them fix it
            }
        } catch (error) {
            toast.error("Submission failed");
            setIsTimerRunning(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#0F172A] text-[#CBD5E1] font-inter flex flex-col overflow-hidden">
            <nav className="min-h-[64px] border-b border-[#334155] bg-[#1E293B]/50 flex items-center justify-between px-8 shrink-0 relative">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-[#94A3B8] hover:text-white transition-colors">
                        <HiOutlineArrowLeft size={20} />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-lg leading-tight">Challenge: Two Sum</span>
                        <span className="text-[10px] text-[#3B82F6] font-bold tracking-[0.2em] uppercase">Backend Judging Mode</span>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#020617] px-4 py-1.5 rounded-full border border-[#334155]">
                    <div className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="font-mono text-white text-sm tracking-widest">{formatTime(seconds)}</span>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={runCode} disabled={isLoading || isSubmitting} className="flex items-center gap-2 bg-[#1E293B] border border-[#334155] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#334155] transition-all disabled:opacity-50">
                        <HiOutlinePlay className="text-blue-400" />
                        <span>{isLoading ? "Running..." : "Run"}</span>
                    </button>

                    <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#059669] shadow-lg shadow-green-500/20 transition-all disabled:opacity-50">
                        <HiOutlineCheckCircle />
                        <span>{isSubmitting ? "Judging..." : "Submit"}</span>
                    </button>
                </div>
            </nav>

            <main className="flex flex-grow overflow-hidden">
                <section className="w-[30%] bg-[#1E293B]/20 border-r border-[#334155] p-8 overflow-y-auto">
                    <h2 className="text-white font-bold text-xl mb-6">Task</h2>
                    <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
                        Complete the function so that it will add the following array.
                    </p>
                    <div className="bg-[#020617] p-4 rounded border border-[#334155] font-mono text-xs">
                        <span className="text-gray-500 mb-1 block"></span>
                        <span className="text-white">nums = [2, 7, 11, 15]</span>
                    </div>
                </section>

                <section className="flex-grow flex flex-col bg-[#020617] relative">
                    <div className="h-10 bg-[#1E293B]/30 border-b border-[#334155] flex items-center px-6">
                        <select
                            value={session.language}
                            onChange={(e) => setSession({ ...session, language: e.target.value, code: starterCode[e.target.value] })}
                            className="bg-transparent text-[10px] font-bold text-blue-400 outline-none uppercase tracking-widest cursor-pointer"
                        >
                            {Object.keys(languageMap).map(lang => (
                                <option key={lang} value={lang} className="bg-[#0F172A]">{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-grow overflow-hidden">
                        <div className="w-12 bg-[#020617] border-r border-[#1E293B] py-6 font-mono text-xs text-[#475569] text-right pr-4 select-none">
                            {Array.from({ length: lineNumbers }).map((_, i) => (
                                <div key={i} className="leading-relaxed">{i + 1}</div>
                            ))}
                        </div>
                        <textarea
                            value={session.code}
                            onChange={handleCodeChange}
                            className="flex-grow bg-transparent py-6 px-4 font-mono text-sm outline-none resize-none text-[#E2E8F0] leading-relaxed"
                            spellCheck="false"
                        />
                    </div>

                    <div className="h-[200px] bg-[#020617] border-t border-[#334155] flex flex-col">
                        <div className="px-5 py-2 bg-[#1E293B]/30 border-b border-[#334155] flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">
                                <HiOutlineCommandLine /> Terminal Output
                            </div>
                        </div>
                        <div className="p-5 font-mono text-xs md:text-sm overflow-auto flex-grow">
                            <pre className={`${session.output.toLowerCase().includes("error") ? 'text-red-400' : 'text-white'} whitespace-pre-wrap`}>
                                {session.output || "> Awaiting execution..."}
                            </pre>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProblemWorkspace;