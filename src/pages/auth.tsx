import Login from "@/components/auth/Login"
import Register from "@/components/auth/Register"
import { useSelectAuth } from "@/hooks/use-auth-select"

export default function AuthPage() {

  const {authTitle}=useSelectAuth()
  return (
    <div className='w-full  h-screen bg-zinc-950 '>
        <div  className='container mx-auto  w-full h-full flex items-center justify-center '>
             {authTitle==="LOGIN"?<Login />:< Register />}
        </div>
    </div>
  )
}
