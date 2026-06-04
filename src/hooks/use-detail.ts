import { create } from "zustand";

type DetailStoreType={
    id:string|null
    setId:(id:string|null)=>void
}

export const useDetailStore=create<DetailStoreType>((set)=>({
    id:null,
    setId:(id)=>set({id})
}))