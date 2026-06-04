import PostLoading from "@/components/loadings/post-loading";
import { CreateNote } from "@/components/shared/create-note";
import NoteDetail from "@/components/shared/note-detail";
import NoteList from "@/components/shared/note-list";
import AppSidebar from "@/components/shared/sidebar";
import { useDetailStore } from "@/hooks/use-detail";
import { useAuthStore } from "@/store/auth-store";

export default function Post() {
  const {id}=useDetailStore()
  const {isLoading}=useAuthStore()

  if(isLoading){
    return < PostLoading/>
  }
  return (
    <div className="w-ful h-screen bg-gray-900">
        <div className="container w-full h-screen mx-auto flex">
            < AppSidebar />
            < NoteList />
            < NoteDetail key={id} />
        </div>
        <CreateNote/>
    </div>
  )
}
