import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function PopoverLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center ">
      <AiOutlineLoading3Quarters  size={30} className="animate-spin"   />
    </div>
  )
}
