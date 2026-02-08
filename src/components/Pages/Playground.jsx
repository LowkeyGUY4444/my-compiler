import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCloudArrowUp, HiOutlineCommandLine, HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineClock } from "react-icons/hi2";
import { toast } from 'sonner';

const SimplePlayground = () => {
    const starterCode = {
        "c": "#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf(\"%d %d\", &a, &b);\n    printf(\"Sum: %d\\n\", a + b);\n    return 0;\n}",
        "c++": "#include <iostream>\n\nint main() {\n    int a, b;\n    std::cin >> a >> b;\n    std::cout << \"Sum: \" << a + b << std::endl;\n    return 0;\n}",
        "python": "a = int(input())\nb = int(input())\nprint(f\"Sum: {a + b}\")",
        "javascript": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').split('\\n');\nconsole.log('Sum:', parseInt(input[0]) + parseInt(input[1]));",
        "java": "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(\"Sum: \" + (sc.nextInt() + sc.nextInt()));\n    }\n}"
    };

    const languageMap = {
        "c": { version: "10.2.0" },
        "c++": { version: "10.2.0" },
        "python": { version: "3.10.0" },
        "javascript": { version: "18.15.0" },
        "java": { version: "15.0.2" }
    };

    const [session, setSession] = useState({
        title: "Algorithm Playground",
        language: "python",
        version: "3.10.0",
        code: starterCode["python"],
        userInput: "10\n20",
        output: "",
        isSaved: true
    });

    const [seconds, setSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // For Run button
    const [isSaving, setIsSaving] = useState(false);   // For Save button
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
        setSession({ ...session, code: e.target.value, isSaved: false });
        if (!isTimerRunning) setIsTimerRunning(true);
    };

    const handleLanguageChange = (newLang) => {
        setSession({
            ...session,
            language: newLang,
            version: languageMap[newLang].version,
            code: starterCode[newLang],
            isSaved: false
        });
    };

    // BACKEND INTEGRATION: Save to MongoDB
    const saveToDatabase = async () => {
        if (!session.code.trim()) return toast.error("Cannot save empty code");

        setIsSaving(true);
        try {
            const response = await fetch("http://localhost:5000/api/playground/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: session.title,
                    language: session.language,
                    code: session.code,
                    userInput: session.userInput,
                    timeTaken: seconds
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSession(prev => ({ ...prev, isSaved: true }));
                toast.success("Progress synced with MongoDB");
            } else {
                toast.error(data.message || "Failed to save to database");
            }
        } catch (error) {
            console.error("Save Error:", error);
            toast.error("Server connection failed");
        } finally {
            setIsSaving(false);
        }
    };

    const runCode = async () => {
        setIsLoading(true);
        setIsTimerRunning(false);
        setSession(prev => ({ ...prev, output: "Executing..." }));

        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: session.language,
                    version: session.version,
                    files: [{ content: session.code }],
                    stdin: session.userInput,
                }),
            });

            const data = await response.json();
            const result = data.run.output || data.run.stderr || "No output";

            setSession(prev => ({ ...prev, output: result }));

            if (data.run.stderr) {
                setIsTimerRunning(true);
                toast.error("Execution Error: Timer resumed");
            } else {
                toast.success("Execution Finished");
            }
        } catch (error) {
            setIsTimerRunning(true);
            toast.error("Execution Failed: Timer resumed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#0F172A] text-[#CBD5E1] font-inter flex flex-col overflow-hidden">
            <nav className="min-h-[64px] border-b border-[#334155] bg-[#1E293B]/50 flex items-center justify-between px-8 shrink-0 relative">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-[#94A3B8] hover:text-white transition-colors">
                        <HiOutlineArrowLeft size={20} />
                    </Link>
                    <input
                        value={session.title}
                        onChange={(e) => setSession({ ...session, title: e.target.value, isSaved: false })}
                        className="bg-transparent text-white font-bold text-lg outline-none"
                    />
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#020617] px-4 py-1.5 rounded-full border border-[#334155]">
                    <HiOutlineClock className={isTimerRunning ? "text-yellow-500 animate-pulse" : "text-gray-500"} />
                    <span className="font-mono text-white text-sm tracking-widest">{formatTime(seconds)}</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className={`text-[10px] uppercase font-bold tracking-tight ${session.isSaved ? 'text-green-500' : 'text-red-400 animate-pulse'}`}>
                        {session.isSaved ? 'Saved' : 'not saved yet'}
                    </span>

                    <button
                        onClick={saveToDatabase}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-[#1E293B] border border-[#334155] px-4 py-2 rounded-lg hover:bg-[#334155] disabled:opacity-50 transition-all"
                    >
                        <HiOutlineCloudArrowUp className={isSaving ? "animate-bounce text-blue-400" : "text-blue-400"} />
                        <span className="text-sm">{isSaving ? "Saving..." : "Save"}</span>
                    </button>
                    <button onClick={runCode} disabled={isLoading} className="bg-blue-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-500 text-white disabled:opacity-50">
                        {isLoading ? "Running..." : "Run"}
                    </button>
                </div>
            </nav>

            <main className="flex flex-grow overflow-hidden">
                <section className="w-[65%] flex flex-col border-r border-[#334155]">
                    <div className="h-10 bg-[#1E293B]/30 border-b border-[#334155] flex items-center px-6 justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Editor — {session.language}</span>
                        <select
                            value={session.language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="bg-transparent text-blue-400 text-[10px] font-bold outline-none uppercase cursor-pointer"
                        >
                            <option value="c">C</option>
                            <option value="c++">C++</option>
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="java">Java</option>
                        </select>
                    </div>
                    <div className="flex flex-grow overflow-hidden bg-[#020617]">
                        <div className="w-12 border-r border-[#1E293B] py-8 font-mono text-sm text-[#475569] text-right pr-4 select-none">
                            {Array.from({ length: lineNumbers }).map((_, i) => (
                                <div key={i} className="leading-relaxed">{i + 1}</div>
                            ))}
                        </div>
                        <textarea
                            value={session.code}
                            onChange={handleCodeChange}
                            className="flex-grow bg-transparent py-8 px-4 font-mono text-sm outline-none resize-none text-[#E2E8F0] leading-relaxed"
                            spellCheck="false"
                        />
                    </div>
                </section>

                <section className="w-[35%] bg-[#020617] flex flex-col">
                    <div className="h-1/2 flex flex-col border-b border-[#334155]">
                        <div className="px-5 py-2 bg-[#1E293B]/30 border-b border-[#334155] text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <HiOutlinePencilSquare /> Standard Input (stdin) Note: The input for variables are line seperated.
                        </div>
                        <textarea
                            value={session.userInput}
                            onChange={(e) => setSession({ ...session, userInput: e.target.value, isSaved: false })}
                            placeholder="Type test values here..."
                            className="flex-grow bg-transparent p-5 font-mono text-sm text-blue-300 outline-none resize-none placeholder:text-gray-800"
                        />
                    </div>

                    <div className="h-1/2 flex flex-col">
                        <div className="px-5 py-2 bg-[#1E293B]/30 border-b border-[#334155] text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <HiOutlineCommandLine /> Terminal Output
                        </div>
                        <div className="flex-grow p-5 font-mono text-sm overflow-auto text-white">
                            <pre className="whitespace-pre-wrap">{session.output || "> Awaiting execution..."}</pre>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SimplePlayground;


// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { HiOutlineCloudArrowUp, HiOutlineCommandLine, HiOutlineArrowLeft } from "react-icons/hi2";
// import { toast } from 'sonner';

// const SimplePlayground = () => {
//     const starterCode = {
//         "c": "//Write your C code here\n#include <stdio.h>\n\nint main() {\n    printf(\"Hello CodeVerse!\\n\");\n    return 0;\n}",
//         "c++": "//Write your C++ code here\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello CodeVerse!\" << std::endl;\n    return 0;\n}",
//         "python": "//Write your Python code here\nprint(\"Hello CodeVerse!\")",
//         "javascript": "//Write your JavaScript code here\nconsole.log(\"Hello CodeVerse!\");",
//         "java": "//Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello CodeVerse!\");\n    }\n}"
//     };

//     const languageMap = {
//         "c": { version: "10.2.0" },
//         "c++": { version: "10.2.0" },
//         "python": { version: "3.10.0" },
//         "javascript": { version: "18.15.0" },
//         "java": { version: "15.0.2" }
//     };

//     const [session, setSession] = useState({
//         title: "New Algorithm Script",
//         language: "c",
//         version: "10.2.0",
//         code: starterCode["c"],
//         output: "",
//         lastSaved: null,
//         isSaved: true,
//         timeTaken: 0
//     });

//     const [seconds, setSeconds] = useState(0);
//     const [isTimerRunning, setIsTimerRunning] = useState(false);
//     const timerRef = useRef(null);
//     const [isLoading, setIsLoading] = useState(false);

//     // Dynamic line numbers calculation
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
//         setSession({ ...session, code: e.target.value, isSaved: false });
//         if (!isTimerRunning) setIsTimerRunning(true);
//     };

//     const handleLanguageChange = (newLang) => {
//         setSession({
//             ...session,
//             language: newLang,
//             version: languageMap[newLang].version,
//             code: starterCode[newLang],
//             isSaved: false
//         });
//     };

//     const runCode = async () => {
//         setIsLoading(true);
//         setIsTimerRunning(false);
//         setSession(prev => ({ ...prev, output: "Compiling..." }));

//         try {
//             const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     language: session.language,
//                     version: session.version,
//                     files: [{ content: session.code }],
//                 }),
//             });

//             const data = await response.json();
//             const output = data.run.output || "";
//             const error = data.run.stderr || "";

//             setSession(prev => ({ ...prev, output: output || error }));

//             if (error || !output) {
//                 setIsTimerRunning(true);
//                 toast.error("Execution Error");
//             } else {
//                 setSession(prev => ({ ...prev, timeTaken: seconds }));
//                 toast.success("Code Executed Successfully!");
//             }
//         } catch (error) {
//             setIsTimerRunning(true);
//             toast.error("Connection Failed");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const saveToDatabase = () => {
//         console.log("Saving to MongoDB:", {
//             title: session.title,
//             language: session.language,
//             code: session.code,
//             timeTaken: seconds,
//             savedAt: new Date().toISOString()
//         });

//         setSession(prev => ({
//             ...prev,
//             isSaved: true,
//             lastSaved: new Date().toLocaleTimeString()
//         }));

//         toast.success("Progress Saved");
//     };

//     return (
//         <div className="h-screen w-full bg-[#0F172A] text-[#CBD5E1] font-inter flex flex-col overflow-hidden">

//             <nav className="min-h-[64px] border-b border-[#334155] bg-[#1E293B]/50 flex items-center justify-between px-4 md:px-8 shrink-0 relative">
//                 <div className="flex items-center gap-3 md:gap-6 z-10">
//                     <Link to="/" className="text-[#94A3B8] hover:text-white transition-colors">
//                         <HiOutlineArrowLeft size={20} />
//                     </Link>
//                     <input
//                         value={session.title}
//                         onChange={(e) => setSession({ ...session, title: e.target.value })}
//                         className="bg-transparent text-white font-bold text-sm md:text-lg outline-none w-24 md:w-auto"
//                     />
//                 </div>

//                 <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 bg-[#020617] px-4 py-1.5 rounded-full border border-[#334155]">
//                     <div className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
//                     <span className="font-mono text-white text-sm tracking-widest">{formatTime(seconds)}</span>
//                 </div>

//                 <div className="flex items-center gap-2 md:gap-4 z-10">
//                     <div className="lg:hidden flex items-center bg-[#020617] px-2 py-1 rounded border border-[#334155] mr-1">
//                         <span className="font-mono text-[10px] text-white">{formatTime(seconds)}</span>
//                     </div>

//                     <span className={`hidden md:block text-xs font-medium ${session.isSaved ? 'text-green-500' : 'text-red-400'}`}>
//                         {session.isSaved ? 'Saved' : 'not saved yet'}
//                     </span>

//                     <button onClick={saveToDatabase} className="flex items-center gap-1.5 bg-[#1E293B] border border-[#334155] px-2 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-[#334155] transition-all">
//                         <HiOutlineCloudArrowUp className="text-[#3B82F6] text-lg" />
//                         <span className="hidden sm:inline text-xs md:text-sm">Save</span>
//                     </button>

//                     <button onClick={runCode} disabled={isLoading} className="bg-[#3B82F6] px-4 py-1.5 md:px-6 md:py-2 rounded-lg font-bold text-xs md:text-sm hover:bg-[#2563EB] text-white transition-colors">
//                         {isLoading ? "..." : "Run"}
//                     </button>
//                 </div>
//             </nav>

//             <main className="flex flex-col md:flex-row flex-grow overflow-hidden">
//                 <section className="w-full h-1/2 md:h-auto md:w-[65%] flex flex-col border-b md:border-b-0 md:border-r border-[#334155]">
//                     <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3 bg-[#1E293B]/30 border-b border-[#334155]">
//                         <div className="flex gap-1.5">
//                             <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
//                             <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
//                             <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
//                         </div>
//                         <div className="relative group">
//                             <select value={session.language} onChange={(e) => handleLanguageChange(e.target.value)} className="appearance-none bg-[#020617] border border-[#334155] text-[#94A3B8] text-[10px] md:text-xs font-bold py-1 px-3 pr-8 rounded-md outline-none uppercase cursor-pointer">
//                                 <option value="c">C</option>
//                                 <option value="c++">C++</option>
//                                 <option value="python">Python</option>
//                                 <option value="javascript">JavaScript</option>
//                                 <option value="java">Java</option>
//                             </select>
//                             <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-[#475569]">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
//                             </div>
//                         </div>
//                     </div>

//                     {/* UPDATED EDITOR WITH LINE NUMBERS */}
//                     <div className="flex flex-grow overflow-hidden bg-[#020617]">
//                         {/* Gutter / Line Numbers */}
//                         <div className="w-12 md:w-16 bg-[#020617] border-r border-[#1E293B] py-4 md:py-8 font-mono text-[10px] md:text-sm text-[#475569] text-right pr-3 md:pr-4 select-none flex flex-col">
//                             {Array.from({ length: lineNumbers }).map((_, i) => (
//                                 <div key={i} className="leading-relaxed">{i + 1}</div>
//                             ))}
//                         </div>

//                         {/* Existing Textarea */}
//                         <textarea
//                             value={session.code}
//                             onChange={handleCodeChange}
//                             className="flex-grow bg-transparent py-4 md:py-8 px-2 md:px-4 font-mono text-xs md:text-sm outline-none resize-none text-[#E2E8F0] leading-relaxed"
//                             spellCheck="false"
//                         />
//                     </div>
//                 </section>

//                 <section className="w-full h-1/2 md:h-auto md:w-[35%] bg-[#020617] flex flex-col">
//                     <div className="px-4 py-2 md:px-5 md:py-3 bg-[#1E293B]/30 border-b border-[#334155] text-[#94A3B8] text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
//                         <HiOutlineCommandLine size={14} /> Output
//                     </div>
//                     <div className="flex-grow p-4 md:p-6 font-mono text-xs md:text-sm overflow-auto text-white">
//                         <pre className={`${session.output.toLowerCase().includes("error") ? 'text-red-400' : 'text-white'} whitespace-pre-wrap`}>
//                             {session.output || "# Click Run to execute code..."}
//                         </pre>
//                     </div>
//                 </section>
//             </main>
//         </div>
//     );
// };

// export default SimplePlayground;