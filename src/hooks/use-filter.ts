import { create } from "zustand";

type FilterNoteType={
    sortStatus:"LATEST"|"OLDEST"|"ALPHABETICAL";
    searchValue:string;
    tagValue:string;
    category:string;
    setSort:(sort:"LATEST"|"OLDEST"|"ALPHABETICAL")=>void    
    setSearch:(value:string)=>void 
    setTag:(tag:string)=>void
    setCategory:(category:string)=>void
}


export const useFilterStore=create<FilterNoteType>((set)=>({
    sortStatus:"LATEST",
    searchValue:"",
    tagValue:"",
    category:"",
    setSort:(param)=>set({sortStatus:param}),
    setSearch:(param)=>set({searchValue:param}),
    setTag:(param)=>set({tagValue:param}),
    setCategory:(param)=>set({category:param})
}))