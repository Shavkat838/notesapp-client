import { create } from "zustand";


export type IIUser={
    id:string;
    email:string;
    username:string;
}

type AuthStoreType={
    isLoading:boolean;
    isAuth:boolean;
    user:IIUser;
    setLoading:(param:boolean)=>void;
    setAuth:(param:boolean)=>void;
    setUser:(user:IIUser)=>void;
}

export const useAuthStore=create<AuthStoreType>((set)=>({
    isLoading:false,
    isAuth:false,
    user:{}as IIUser,
    setLoading:(param)=>(set({isLoading:param})),
    setAuth:(param)=>(set({isAuth:param})),
    setUser:(user)=>(set({user}))
}))