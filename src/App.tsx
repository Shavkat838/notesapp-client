import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Post from "./pages/post";
import AuthPage from "./pages/auth";
import { useAuthStore } from "./store/auth-store";
import { $authApi } from '@/https/axios';
import { useEffect } from "react";
import PostLoading from "./components/loadings/post-loading";



function App() {
  const {isAuth,isLoading,setLoading,setAuth,setUser}=useAuthStore()

  async function checkAuth(){
    try {
      setLoading(true)
      const {data}=await $authApi.post("/refresh")
      localStorage.setItem("accessToken",data.accessToken)
      setAuth(true)
      setUser(data.user)
    } catch (error) {
      console.log(error)
      localStorage.removeItem("accessToken")
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(localStorage.getItem("accessToken")){
      checkAuth()
    }
    else{
      setLoading(false)
    }
  },[])


  if (isLoading) {
    return (
      <div className="loading-container bg-zinc-950 w-full h-screen">
           < PostLoading />
      </div>
    );
  }


  return (
    <>
      <Routes>
        <Route path="/" element={< Home/>} />
        <Route path="/post"  element={isAuth?<Post />:< Navigate to={"/auth"} replace  /> }/>
        <Route path="/auth"  element={ !isAuth?<AuthPage />:<Navigate to={'/post'} replace />} />
      </Routes> 
    </>
  );
}

export default App;
