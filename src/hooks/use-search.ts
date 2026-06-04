import { create } from "zustand";
type SearchStoreType={
    isOpenModal:boolean;
    isOpenType:"tags"|"search"|null,
    setIsOpenType:(param:"tags"|"search"|null)=>void
    setIsOpenModal:(param:boolean)=>void
}

export const useSearchStore=create<SearchStoreType>((set)=>({
    isOpenModal:false,
    isOpenType:null,
    setIsOpenType:(param)=>set({isOpenType:param}),
    setIsOpenModal:(bool)=>set({isOpenModal:bool})
}))