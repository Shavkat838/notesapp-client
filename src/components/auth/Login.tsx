import { useSelectAuth } from "@/hooks/use-auth-select";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { $authApi } from "@/https/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import type { AxiosError } from "axios";
import type { ApiCustomerError } from "@/interfaces/type.note";

type Login = {
  email: string;
  password: string;
};

export default function Login() {
  const { changeAuthTitle } = useSelectAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuth, setUser } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload: Login) => {
      const { data } = await $authApi.post("/login", payload);
      return data;
    },
    onSuccess: (data) => {
      setAuth(true);
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/post", { replace: true });
      toast.success("Muvaffaqiyatli tizimga kirdingiz!");
    },

    onError: (error: AxiosError<ApiCustomerError>) => {
      toast.error(error?.response?.data.message);
    },
  });

  function login() {
    if (email === "" || password === "") {
      toast.error("Iltimos malumotlarni to'liq  kiriting!");
      return;
    }
    mutate({ email, password });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Malumotlaringizni kiriting</CardDescription>
        <CardAction>
          <span
            onClick={() => changeAuthTitle("REGISTER")}
            className="text-blue-600 bg-none border-none  hover:underline cursor-pointer"
          >
            Ro'yxatdan oting
          </span>
        </CardAction>
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
              <div className="flex items-center">
                <Label htmlFor="password">Parol</Label>
              </div>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={login} type="submit" className="w-full cursor-pointer">
          {isPending ? "Yo'naltirilmoqda" : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}
