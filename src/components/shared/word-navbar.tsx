import {Link} from "react-router-dom"
export default function Wordnavbar() {
  

  return ( 
    <div className=" bg-zinc-950 w-1/2 h-full pl-35 justify-center  flex flex-col space-y-2  ">
      <h1 className="text-white text-[50px]">Logo</h1>
      <p className="text-[25px] text-white tracking-wide "> Eslatmalarga xush kelibsiz</p>
      <h2 className="text-white tracking-wide  text-[40px] ">Hech qachon fikrni yoqotmang, Yozib saqlang </h2>
      <p className="text-[22px] text-gray-300 " >Eslatmalarni va fikrlarni  so'zlarda va ovozda saqlab qoyishingiz uchun mahsus dastur</p>
     <Link to={'/post'} ><button   className="w-70 mt-10 hover:border h-12 rounded-[28px] bg-white cursor-pointer text-center font-sans-reg  text-[20px] text-zinc-900"> Boshlash </button></Link>   
    </div>
  )
}





