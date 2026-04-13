import Imagenavbar from "../components/shared/image-navbar";
import Wordnavbar from "../components/shared/word-navbar";


export default function Home() {
  return (
    <div  className="w-full h-screen " >
        <div className="w-full container h-full    mx-auto flex items-center justify-between">
          < Wordnavbar />
          < Imagenavbar />
        </div>
    </div>
  )
}
