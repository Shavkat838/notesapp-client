import PostLoading from "@/components/loadings/post-loading";
import { CreateNote } from "@/components/shared/create-note";
import NoteDetail from "@/components/shared/note-detail";
import NoteList from "@/components/shared/note-list";
import AppSidebar from "@/components/shared/sidebar";
import { useDetailStore } from "@/hooks/use-detail";
import { useAuthStore } from "@/store/auth-store";

export default function Post() {
  const { id } = useDetailStore();
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <PostLoading />;
  }

  return (
    <div className="w-full min-h-screen md:h-screen bg-gray-900 overflow-hidden">
      <div className="w-full h-full mx-auto flex flex-col md:flex-row relative">
        <AppSidebar />
        <NoteList />
        <NoteDetail key={id} />
      </div>
      <CreateNote />
    </div>
  );
}
