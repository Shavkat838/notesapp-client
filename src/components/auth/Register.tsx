import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { $authApi } from "@/https/axios";
import { useMutation } from "@tanstack/react-query";
import type { ApiCustomerError, IUser } from "@/interfaces/type.note";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useSelectAuth } from "@/hooks/use-auth-select";

export default function Register() {
  
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {changeAuthTitle}=useSelectAuth()
  const navigate=useNavigate()
  const {setAuth,setUser}=useAuthStore()



  const {mutate,isPending}=useMutation({
    mutationKey:['register'],
    mutationFn:async (payload:IUser)=>{
      const {data}=await $authApi.post('/register',payload)
      return data
    },
    onSuccess:({data})=>{
      setAuth(true)
      setUser(data.userDto)
      localStorage.setItem("accessToken",data.tokens.accessToken)
      navigate('/post',{replace:true})
      changeAuthTitle("LOGIN")
      toast.success("Tizimga muvaffaqiyatli kirdingiz!")
    },
    onError:(error:AxiosError<ApiCustomerError>)=>{
     toast.error(error?.response?.data.message)
    }
  })

  async function register() {
    if(email===""||password===""||username===""){
      toast.error("Malumotlaringizni to'liq kiriting!")
      return
    }

    mutate({username,email,password})
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Malumotlaringizni kiriting</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Ism</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ismingizni kiriting..."
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Parol</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Parol esdan chiqdimi?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          onClick={register}
          type="submit"
          className="w-full cursor-pointer"
        >
          {isPending?"Yuklanmoqda":"Register"}
        </Button>
      </CardFooter>
    </Card>
  );
}
