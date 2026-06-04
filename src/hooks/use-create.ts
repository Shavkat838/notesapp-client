import { create } from "zustand";


type CreateNoteType={
    isOpen:boolean;
    setOpen:()=>void;
    setClose:()=>void;
}


export const useCreateStore=create<CreateNoteType>((set)=>({
    isOpen:false,
    setOpen:()=>set({isOpen:true}),
    setClose:()=>set({isOpen:false})
}))