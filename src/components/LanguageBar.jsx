import {
  SiPython,
  SiOpenjdk,
  SiCplusplus,
  SiJavascript,
  SiGo,
  SiRust,
  SiRuby
} from "react-icons/si";

export default function LanguageBar() {
  const languages = [
    { name: "Python", icon: <SiPython className="text-[#3776AB]" /> },
    { name: "Java", icon: <SiOpenjdk className="text-[#007396]" /> },
    { name: "C++", icon: <SiCplusplus className="text-[#00599C]" /> },
    { name: "JavaScript", icon: <SiJavascript className="text-[#F7DF1E]" /> },
    { name: "Go", icon: <SiGo className="text-[#00ADD8]" /> },
    { name: "Rust", icon: <SiRust className="text-[#000000] dark:text-white" /> },
    { name: "Ruby", icon: <SiRuby className="text-[#CC342D]" /> },
  ];

  return (
    <section className="bg-[#0B1120] h-24 flex items-center justify-center border-y border-[#1E293B]">
      <div className="flex items-center space-x-8 px-4 overflow-x-auto no-scrollbar">
        <span className="text-[#64748B] text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
          Supported Technologies:
        </span>
        <div className="flex space-x-30 items-center">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center space-x-2 group cursor-default transition-all duration-300"
            >
              <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                {lang.icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}