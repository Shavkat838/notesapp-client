import { create } from "zustand";


type SelectAuthType={
    authTitle:"LOGIN"|"REGISTER",
    changeAuthTitle:(title:"LOGIN"|"REGISTER")=>void
}

export  const  useSelectAuth=create<SelectAuthType>((set)=>({
    authTitle:"LOGIN",
    changeAuthTitle:(title)=>set({
        authTitle:title
    })
}))