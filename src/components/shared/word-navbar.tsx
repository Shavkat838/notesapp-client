import { Link } from "react-router-dom";
export default function Wordnavbar() {
  return (
    <div className=" bg-zinc-950 md:w-1/2 w-full h-full md:pl-35 px-5  justify-center  flex flex-col space-y-2  ">
      <div className="flex items-center gap-2 font-bold text-xl select-none">
        <div className="w-9 h-9  rounded-xl bg-linear-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
          <span className="text-white font-black tracking-tighter   md:text-lg">
            N
          </span>
        </div>
        <span className="text-white text-3xl tracking-tight">
          Notes<span className="text-emerald-400 font-light">App</span>
        </span>
      </div>
      <p className="md:text-[25px] text-[18px] text-white tracking-wide mt-2.5 md:mt-0 ">
        
        Eslatmalarga xush kelibsiz
      </p>
      <h2 className="text-white tracking-wide  md:text-[40px] text-[25px] mt-2 md:mt-0">
        Hech qachon fikrni yo'qotmang, yozib saqlang
      </h2>
      <p className="text-[22px] text-gray-300 ">
        Eslatmalarni va fikrlarni so'zlarda saqlab qo'yishingiz uchun
        mahsus dastur
      </p>
      <Link to={"/post"}>
        <button className="w-70  md:mt-10 mt-4 hover:border md:h-12 h-8 rounded-[28px] bg-white cursor-pointer text-center font-sans-reg  md:text-[20px] text-[17px]   text-zinc-900">
          
          Boshlash
        </button>
      </Link>
    </div>
  );
}
