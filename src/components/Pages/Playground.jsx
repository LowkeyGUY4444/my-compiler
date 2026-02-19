import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineCloudArrowUp,
    HiOutlineCommandLine,
    HiOutlineArrowLeft,
    HiOutlinePencilSquare,
    HiOutlineClock
} from "react-icons/hi2";
import { toast } from 'sonner';

const SimplePlayground = () => {
    const starterCode = {
        "c": "#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf(\"%d %d\", &a, &b);\n    printf(\"Sum: %d\\n\", a + b);\n    return 0;\n}",
        "c++": "#include <iostream>\n\nint main() {\n    int a, b;\n    std::cin >> a >> b;\n    std::cout << \"Sum: \" << a + b << std::endl;\n    return 0;\n}",
        "python": "a = int(input())\nb = int(input())\nprint(f\"Sum: {a + b}\")",
        "javascript": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').split('\\n');\nconsole.log('Sum:', parseInt(input[0]) + parseInt(input[1]));",
        "java": "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(\"Sum: \" + (sc.nextInt() + sc.nextInt()));\n    }\n}"
    };

    const [session, setSession] = useState({
        title: "Algorithm Playground",
        language: "python",
        code: starterCode["python"],
        userInput: "10\n20",
        output: "",
        isSaved: true
    });

    const [seconds, setSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
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
            code: starterCode[newLang],
            isSaved: false
        });
    };

    // backend logic is here ankit bhai for API execution (:
    const runCode = async () => {
        if (!session.code.trim()) return toast.error("Cannot execute empty code");

        const runPayload = {
            code: session.code,
            language: session.language,
            stdin: session.userInput
        };
        console.log(runPayload);

        setIsLoading(true);
        setIsTimerRunning(false);
        setSession(prev => ({ ...prev, output: "Executing on your server..." }));

        try {
            const response = await fetch("URL", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(runPayload),
            });

            const data = await response.json();
            console.log("BACKEND RESPONSE (Run):", data);

            setSession(prev => ({
                ...prev,
                output: data.stdout || data.stderr || data.compile_output || "No output returned."
            }));

            if (data.stderr || data.compile_output) {
                setIsTimerRunning(true);
                toast.error("Execution Error");
            } else {
                toast.success("Run Successful");
            }
        } catch (error) {
            setIsTimerRunning(true);
            toast.error("Backend Server Unreachable");
        } finally {
            setIsLoading(false);
        }
    };

    // backend logic is here ankit bhai (:

    const saveToDatabase = async () => {
        if (!session.code.trim()) return toast.error("Cannot save empty code");

        const savePayload = {
            title: session.title,
            language: session.language,
            code: session.code,
            userInput: session.userInput,
            timeTaken: seconds
        };
        console.log(savePayload);

        setIsSaving(true);
        try {
            const response = await fetch("URL", {   //url change garis yata backend ko
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(savePayload),
            });

            const data = await response.json();
            console.log("BACKEND RESPONSE (Save):", data);

            if (response.ok) {
                setSession(prev => ({ ...prev, isSaved: true }));
                toast.success("Saved to MongoDB");
            } else {
                toast.error("Database Save Failed");
            }
        } catch (error) {
            toast.error("Server connection failed");
        } finally {
            setIsSaving(false);
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
                    <button onClick={saveToDatabase} disabled={isSaving} className="flex items-center gap-2 bg-[#1E293B] border border-[#334155] px-4 py-2 rounded-lg hover:bg-[#334155] disabled:opacity-50">
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
                            <HiOutlinePencilSquare /> Standard Input (stdin)
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