import axios from "axios"
import { useEffect } from "react"


export default function Wordnavbar() {

  useEffect(()=>{
    get()
  },[])
  async function get(){
    try {
          const {data}=await axios.get("http://localhost:8080/api/notes")
          console.log(data)      
    } catch (error) {
       console.log(error)
    }

  }
  return ( 
    <div className="w-1/2 h-full flex flex-wrap justify-between items-center bg-zinc-950">
        <h1>Logo</h1>
        <p className="text-xl font-bold  text-gray-300">WELCOME TO NOTES</p>
        <h1 className="text-6xl  font-bold  text-white">Never lose a <br /> thought < br />  Speak it. Save it</h1>
        <h4 className="text-md text-gray-300  text-bold  w-80"  >AI Voice Keyboard  and privare voice-to-text  transcription,  perfect capturing lectures and recording meetings</h4>   
    </div>
  )
}
