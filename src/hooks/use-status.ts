import {create} from "zustand"
type StatusStoreType={
    status:"ALL"|"TRASH"|"ARCHIVE"
    setStatus:(status:"ALL"|"TRASH"|"ARCHIVE")=>void
}
export const useStatusStore=create<StatusStoreType>((set)=>({
    status:"ALL",
    setStatus:(status)=>set({status})
}))

