// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { HiOutlinePlay, HiOutlineCheckCircle, HiOutlineCommandLine, HiOutlineArrowLeft } from "react-icons/hi2";
// import { toast } from 'sonner';

// const ProblemWorkspace = () => {
//     const starterCode = {
//         "c": "// Implement Two Sum in C\n#include <stdio.h>\n...",
//         "c++": "// Implement Two Sum in C++\n#include <iostream>\n...",
//         "python": "def two_sum(nums, target):\n    # Your code here\n    pass",
//         "javascript": "function twoSum(nums, target) {\n    // Your code here\n};",
//         "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}"
//     };

//     const languageMap = {
//         "c": { version: "10.2.0" },
//         "c++": { version: "10.2.0" },
//         "python": { version: "3.10.0" },
//         "javascript": { version: "18.15.0" },
//         "java": { version: "15.0.2" }
//     };

//     const [session, setSession] = useState({
//         code: starterCode["javascript"],
//         language: "javascript",
//         version: "18.15.0",
//         output: "",
//         timeTaken: 0
//     });

//     const [seconds, setSeconds] = useState(0);
//     const [isTimerRunning, setIsTimerRunning] = useState(false);
//     const [isLoading, setIsLoading] = useState(false); // For Run button
//     const [isSubmitting, setIsSubmitting] = useState(false); // For Submit button
//     const timerRef = useRef(null);

//     const lineNumbers = session.code.split('\n').length;

//     useEffect(() => {
//         if (isTimerRunning) {
//             timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
//         } else {
//             clearInterval(timerRef.current);
//         }
//         return () => clearInterval(timerRef.current);
//     }, [isTimerRunning]);

//     const formatTime = (totalSeconds) => {
//         const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
//         const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
//         const s = (totalSeconds % 60).toString().padStart(2, '0');
//         return `${h}:${m}:${s}`;
//     };

//     const handleCodeChange = (e) => {
//         setSession({ ...session, code: e.target.value });
//         if (!isTimerRunning) setIsTimerRunning(true);
//     };

//     const handlePaste = (e) => {
//         e.preventDefault();
//         toast.error("Security Alert: Copy-pasting is disabled for this exam.");
//     };

//     // 1. RUN CODE: Tests code using Piston API
//     const runCode = async () => {
//         setIsLoading(true);
//         setSession(prev => ({ ...prev, output: "Testing code..." }));

//         try {
//             const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     language: session.language,
//                     version: languageMap[session.language].version,
//                     files: [{ content: session.code }],
//                 }),
//             });

//             const data = await response.json();
//             const output = data.run.output || data.run.stderr || "No output returned.";
//             setSession(prev => ({ ...prev, output: output }));
//             toast.success("Test run complete");
//         } catch (error) {
//             setSession(prev => ({ ...prev, output: "Compiler Error: Check connection." }));
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // 2. SUBMIT CODE: Stops timer and logs final payload
//     const handleSubmit = () => {
//         setIsSubmitting(true);
//         setIsTimerRunning(false);

//         const payload = {
//             code: session.code,
//             language: session.language,
//             timeTaken: seconds,
//             submittedAt: new Date().toISOString()
//         };

//         console.log("SUBMITTING TO JUDGE:", payload);

//         setTimeout(() => {
//             setIsSubmitting(false);
//             setSession(prev => ({ ...prev, output: "> STATUS: ACCEPTED\n> SCORE: 100/100\n> COMPLETED IN: " + formatTime(seconds) }));
//             toast.success("Final submission received!");
//         }, 1500);
//     };

//     return (
//         <div className="h-screen w-full bg-[#0F172A] text-[#CBD5E1] font-inter flex flex-col overflow-hidden">
//             {/* Header */}
//             <nav className="min-h-[64px] border-b border-[#334155] bg-[#1E293B]/50 flex items-center justify-between px-8 shrink-0 relative">
//                 <div className="flex items-center gap-6">
//                     <Link to="/" className="text-[#94A3B8] hover:text-white transition-colors">
//                         <HiOutlineArrowLeft size={20} />
//                     </Link>
//                     <div className="flex flex-col">
//                         <span className="text-white font-bold text-lg leading-tight">Challenge: Two Sum</span>
//                         <span className="text-[10px] text-[#3B82F6] font-bold tracking-[0.2em] uppercase">Examination Mode</span>
//                     </div>
//                 </div>

//                 <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#020617] px-4 py-1.5 rounded-full border border-[#334155]">
//                     <div className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
//                     <span className="font-mono text-white text-sm tracking-widest">{formatTime(seconds)}</span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     {/* Run Button */}
//                     <button
//                         onClick={runCode}
//                         disabled={isLoading || isSubmitting}
//                         className="flex items-center gap-2 bg-[#1E293B] border border-[#334155] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#334155] transition-all disabled:opacity-50"
//                     >
//                         <HiOutlinePlay className="text-blue-400" />
//                         <span>{isLoading ? "Running..." : "Run"}</span>
//                     </button>

//                     {/* Submit Button */}
//                     <button
//                         onClick={handleSubmit}
//                         disabled={isSubmitting}
//                         className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#059669] shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
//                     >
//                         <HiOutlineCheckCircle />
//                         <span>{isSubmitting ? "Judging..." : "Submit"}</span>
//                     </button>
//                 </div>
//             </nav>

//             <main className="flex flex-grow overflow-hidden">
//                 {/* Left: Problem Statement */}
//                 <section className="w-[30%] bg-[#1E293B]/20 border-r border-[#334155] p-8 overflow-y-auto">
//                     <h2 className="text-white font-bold text-xl mb-6">Task</h2>
//                     <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
//                         Complete the function so that it returns the indices of two numbers that add up to a specific target.
//                     </p>
//                     <div className="space-y-4">
//                         <div className="bg-[#020617] p-4 rounded border border-[#334155] font-mono text-xs">
//                             <span className="text-gray-500 mb-1 block">// Example Input</span>
//                             <span className="text-white">nums = [2, 7, 11, 15], target = 9</span>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Right: Code Editor & Terminal */}
//                 <section className="flex-grow flex flex-col bg-[#020617] relative">
//                     {/* Language Selector Header */}
//                     <div className="h-10 bg-[#1E293B]/30 border-b border-[#334155] flex items-center px-6">
//                         <span className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Editor — {session.language}</span>
//                     </div>

//                     <div className="flex flex-grow overflow-hidden">
//                         {/* Gutter */}
//                         <div className="w-12 bg-[#020617] border-r border-[#1E293B] py-6 font-mono text-xs text-[#475569] text-right pr-4 select-none">
//                             {Array.from({ length: lineNumbers }).map((_, i) => (
//                                 <div key={i} className="leading-relaxed">{i + 1}</div>
//                             ))}
//                         </div>

//                         {/* Editor */}
//                         <textarea
//                             value={session.code}
//                             onChange={handleCodeChange}
//                             onPaste={handlePaste}
//                             className="flex-grow bg-transparent py-6 px-4 font-mono text-sm outline-none resize-none text-[#E2E8F0] leading-relaxed"
//                             spellCheck="false"
//                         />
//                     </div>

//                     {/* Terminal Window */}
//                     <div className="h-[200px] bg-[#020617] border-t border-[#334155] flex flex-col">
//                         <div className="px-5 py-2 bg-[#1E293B]/30 border-b border-[#334155] flex items-center justify-between">
//                             <div className="flex items-center gap-2 text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">
//                                 <HiOutlineCommandLine /> Terminal Output
//                             </div>
//                             <span className="text-[10px] text-gray-600 font-mono">PID: {Math.floor(Math.random() * 9000) + 1000}</span>
//                         </div>
//                         <div className="p-5 font-mono text-xs md:text-sm overflow-auto flex-grow">
//                             <pre className={`${session.output.toLowerCase().includes("error") ? 'text-red-400' : 'text-white'} whitespace-pre-wrap`}>
//                                 {session.output || "> System ready. Awaiting test run..."}
//                             </pre>
//                         </div>
//                     </div>
//                 </section>
//             </main>
//         </div>
//     );
// };

// export default ProblemWorkspace;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlay, HiOutlineCheckCircle, HiOutlineCommandLine, HiOutlineArrowLeft } from "react-icons/hi2";
import { toast } from 'sonner';

const ProblemWorkspace = () => {
    const starterCode = {
        "c": "// Implement Two Sum in C\n#include <stdio.h>\nint main() {\n  printf(\"[0, 1]\");\n  return 0;\n}",
        "c++": "// Implement Two Sum in C++\n#include <iostream>\nint main() {\n  std::cout << \"[0, 1]\";\n  return 0;\n}",
        "python": "def two_sum(nums, target):\n    # Your code here\n    return [0, 1]\n\n# Match the expected output exactly: [0, 1]\nprint(two_sum([2, 7, 11, 15], 9))",
        "javascript": "function twoSum(nums, target) {\n    // Your code here\n    return [0, 1];\n};\n\nconsole.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));",
        "java": "class Main {\n    public static void main(String[] args) {\n        System.out.println(\"[0, 1]\");\n    }\n}"
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

    // 1. RUN CODE: Basic execution
    const runCode = async () => {
        setIsLoading(true);
        setSession(prev => ({ ...prev, output: "Compiling and Running..." }));

        try {
            const response = await fetch("http://localhost:2358/submissions?wait=true", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source_code: session.code,
                    language_id: languageMap[session.language].id,
                    stdin: "2 7 11 15 9",
                    redirect_stderr_to_stdout: true // Combines errors and output for easier debugging
                }),
            });

            const data = await response.json();
            const output = data.stdout || data.stderr || data.compile_output || "Execution finished with no output.";
            setSession(prev => ({ ...prev, output: output }));
            toast.success("Run complete");
        } catch (error) {
            setSession(prev => ({ ...prev, output: "Error: Local Judge0 is not reachable." }));
            toast.error("Check if Docker is running");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. SUBMIT CODE: Advanced Grading
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setIsTimerRunning(false);
        setSession(prev => ({ ...prev, output: "Judging Submission..." }));

        try {
            const response = await fetch("http://localhost:2358/submissions?wait=true", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source_code: session.code,
                    language_id: languageMap[session.language].id,
                    stdin: "2 7 11 15 9",
                    expected_output: "[0, 1]", // The hidden answer
                    cpu_time_limit: 5, // Prevents infinite loops from crashing your PC
                    memory_limit: 128000
                }),
            });

            const data = await response.json();

            // Status ID 3 is "Accepted"
            if (data.status.id === 3) {
                setSession(prev => ({
                    ...prev,
                    output: `> STATUS: ${data.status.description}\n> SCORE: 100/100\n> EXECUTION TIME: ${data.time}s`
                }));
                toast.success("Passed all test cases!");
            } else if (data.status.id === 13) {
                // Specific handling for Internal Error
                setSession(prev => ({ ...prev, output: "> INTERNAL ERROR\n> Fix: Ensure .wslconfig is set to cgroup v1 and restart." }));
                toast.error("Sandbox Error: Restart WSL");
            } else {
                setSession(prev => ({
                    ...prev,
                    output: `> STATUS: ${data.status.description}\n> SCORE: 0/100\n${data.stdout || data.stderr || ""}`
                }));
                toast.error(`Submission: ${data.status.description}`);
            }
        } catch (error) {
            setSession(prev => ({ ...prev, output: "Judgment Error: Connection lost." }));
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
                        <span className="text-[10px] text-[#3B82F6] font-bold tracking-[0.2em] uppercase">Local Judging Engine</span>
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
                        Complete the function so that it returns the indices of two numbers that add up to a specific target.
                    </p>
                    <div className="bg-[#020617] p-4 rounded border border-[#334155] font-mono text-xs">
                        <span className="text-gray-500 mb-1 block">// Input Format</span>
                        <span className="text-white">nums = [2, 7, 11, 15], target = 9</span>
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