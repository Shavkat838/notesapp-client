import { useEffect, useState } from "react";
import { CiClock1 } from "react-icons/ci";

export default function Imagenavbar() {
  const myQuote = {
    text: "“Siz yozib qoldirgan har bir kichik fikr — kelajakdagi katta muvaffaqiyatning poydevoridir.”",
    author: "NotesApp Team",
  };

  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("uz-UZ", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-1/2 bg-zinc-950 h-full hidden md:flex flex-col items-center justify-between p-12 relative overflow-hidden border-l border-zinc-900 select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full flex justify-end">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-xl">
          <CiClock1 className="text-emerald-400 animate-pulse" size={18} />
          <span className="text-sm font-mono text-gray-300 font-medium tracking-wider">
            {currentTime}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col gap-4 text-center items-center justify-center relative z-10 my-auto">
        <span className="text-6xl text-emerald-500/10 font-serif leading-none h-4">
          “
        </span>

        <p className="text-lg md:text-xl text-zinc-200 font-light leading-relaxed tracking-wide px-4">
          {myQuote.text}
        </p>

        <div className="h-px w-12 bg-linear-to-r from-transparent via-emerald-500/40 to-transparent mt-2" />

        <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
          — {myQuote.author}
        </span>
      </div>

      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-zinc-950 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-zinc-950 to-transparent pointer-events-none" />
    </div>
  );
}
