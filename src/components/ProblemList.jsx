export default function ProblemList() {
    const problems = [
        { id: 1, title: "Two Sum", diff: "Easy", acc: "48.2%", color: "text-green-500", bg: "bg-green-500/10" },
        { id: 2, title: "Add Two Numbers", diff: "Medium", acc: "39.1%", color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { id: 4, title: "Median of Two Sorted Arrays", diff: "Hard", acc: "32.5%", color: "text-red-500", bg: "bg-red-500/10" },
    ];

    return (
        <section className="py-20 bg-[#0F172A]">
            <div className="max-w-7xl mx-auto px-10">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl font-bold text-white">Your Recent Code</h2>
                    <a href="#" className="text-[#3B82F6] font-medium hover:underline">View All &rarr;</a>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#334155]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#1E293B] text-[#64748B] text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Difficulty</th>
                                <th className="px-6 py-4">Acceptance</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#334155]">
                            {problems.map((p) => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-5 text-white font-semibold">{p.id}. {p.title}</td>
                                    <td className="px-6 py-5">
                                        <span className={`${p.color} ${p.bg} px-3 py-1 rounded text-sm font-bold`}>{p.diff}</span>
                                    </td>
                                    <td className="px-6 py-5 text-[#94A3B8]">{p.acc}</td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="text-[#3B82F6] border border-[#3B82F6] px-4 py-1.5 rounded-md hover:bg-[#3B82F6] hover:text-white transition-all font-medium">
                                            Solve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}