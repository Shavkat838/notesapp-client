import { CiClock1 } from "react-icons/ci";
import { BiSolidDuplicate } from "react-icons/bi";
import { IoTrashOutline } from "react-icons/io5";
import { IoArchive } from "react-icons/io5";
import { useDetailStore } from "@/hooks/use-detail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import  $api from "@/https/api";
import type { INote } from "@/interfaces/type.note";
import { toast } from "sonner";
import { formatDate } from "@/constans/formatdata";
import { MdOutlineUnarchive } from "react-icons/md";
import { useStatusStore } from "@/hooks/use-status";
import { LiaTrashRestoreSolid } from "react-icons/lia";
import { MdEdit } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {  useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function NoteDetail() {
  const { id } = useDetailStore();
  const queryClient = useQueryClient();
  const { setId } = useDetailStore();
  const { status } = useStatusStore();
  const [editedNote, setEditedNote] = useState(false);

  const { isLoading, data, isError } = useQuery<INote>({
    queryKey: ["notes", id],
    queryFn: async () => {
      const { data } = await $api.get(`/${id}`);
      return data;
    },
    enabled: !!id,
  });


  
  const [title, setTitle] = useState(data?.title);
  const [content, setContent] = useState(data?.content);


  const { mutate: setTrash, error } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $api.delete(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success("O`chirildi, Savatdan tiklashingiz mumkin!");
    },

    onError: () => {
      toast.error(`Xatolik:${error}`);
    },
  });

  const { mutate: setRestore } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $api.patch(`/${id}/restore`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success("Eslatma tiklandi!");
    },
    onError: (param) => {
      console.log(param);
    },
  });

  const { mutate: archiveMutate, error: archiveError } = useMutation({
    mutationFn: async (id: string) => {
      await $api.patch(`/${id}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success(
        `${data?.isArchived ? "Eslatma arxivdan chiqarildi" : "Eslatma arxivlandi!"}`,
      );
    },
    onError: () => {
      toast.error(`Xatolik:${archiveError}`);
    },
  });

  const { mutate: hardDelete } = useMutation({
    mutationFn: async (id: string) => {
      await $api.delete(`/${id}/force`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success("Eslatma butunlay ochirildi");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: duplicateNote } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $api.post(`${id}/duplicate`);
      return data;
    },
    onSuccess: (currentdata) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(currentdata._id);
      toast.success("Eslatma duplicati tayyor!");
    },
    onError: (error) => {
      console.log(error);
    },
  });


  const {mutate:handleChange}=useMutation({
    mutationFn:async()=>{
     const {data:updatedData}=await $api.put(`/${id}`,{title:title,content:content})
     return updatedData
    },

    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["notes"]})
      setEditedNote(false)
      toast.success("Eslatma yangilandi")
    },

    onError:(error)=>{
      toast.error(error.message)
    }
  })

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p className="text-white text-center py-10  px-100">Birorta eslatmani tanlang! </p>;
  }

  if (isError) {
    toast.error("Kutilmagan xatolik");
  }

  return (
    <div className="w-260 h-full  border border-gray-600">
      <div className="w-full  border border-gray-600 flex px-10 items-center justify-between">
        <div className="flex flex-col justify-between min-w-1/5  h-full py-6  ">
          <div className="flex items-center gap-2">
            <CiClock1
              style={{ color: data.color }}
              size={17}
              className="text-gray-300"
            />
            <p style={{ color: data.color }} className="text-sm text-gray-400">
              {formatDate(data.createdAt)}
            </p>
          </div>
          {editedNote ? (
            <Input
              value={title??data.title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none bg-none text-2xl text-gray-100 min-w-100"
            />
          ) : (
            <h1 className="text-2xl text-gray-100 mt-2">{data.title}</h1>
          )}
        </div>
        <div className="flex items-center gap-5 w-1/4  h-full py-6">
          <div
            onClick={() => setEditedNote(true)}
            title="update"
            className={`w-10 h-10 flex items-center    ${(status == "ARCHIVE" || status == "TRASH") && "hidden"}  justify-center cursor-pointer hover:bg-gray-800  rounded-md  border border-gray-600`}
          >
            <MdEdit size={20} className="text-white" />
          </div>
          <div
            title="duplicate"
            onClick={() => duplicateNote(data._id)}
            className={`w-10 h-10 flex items-center    ${(status == "ARCHIVE" || status == "TRASH") && "hidden"}  justify-center cursor-pointer hover:bg-gray-800  rounded-md  border border-gray-600`}
          >
            <BiSolidDuplicate size={20} className="text-white" />
          </div>
          <div
            onClick={
              data.isTrashed
                ? () => setRestore(data._id)
                : () => setTrash(data._id)
            }
            className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-800  rounded-md  border border-gray-600"
          >
            {data.isTrashed ? (
              <LiaTrashRestoreSolid
                title="restore"
                size={20}
                className="text-white"
              />
            ) : (
              <IoTrashOutline title="delete" size={20} className="text-white" />
            )}
          </div>

          <div
            title="archive"
            onClick={() => archiveMutate(data._id)}
            className={`w-10 h-10 flex items-center ${status == "TRASH" && "hidden"}   justify-center cursor-pointer hover:bg-gray-800  rounded-md  border border-gray-600`}
          >
            {data.isArchived ? (
              <MdOutlineUnarchive
                title="unarchive"
                size={20}
                className="text-white"
              />
            ) : (
              <IoArchive size={20} className="text-white" />
            )}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                title="delete"
                className={`${status === "TRASH" ? "block" : "hidden"} w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-800  rounded-md  border border-gray-600 `}
              >
                <IoTrashOutline size={20} className="text-red-500" />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-120 bg-zinc-100">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Haqqiqatdan ushbu eslatmani o'chirmoqchimisiz?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="flex items-center justify-end gap-2">
                <AlertDialogCancel
                  variant={"outline"}
                  className="cursor-pointer"
                >
                  Yo'q
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => hardDelete(data._id)}
                  variant={"destructive"}
                  className="cursor-pointer"
                >
                  O'chirish
                </AlertDialogAction>
              </AlertDialogDescription>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="w-full px-10 py-8">
        {editedNote ? (
          <Input
            value={content??data.content}
            onChange={(e) => setContent(e.target.value)}
            className="border-none bg-none text-2xl text-gray-300"
          />
        ) : (
          <h1 className="text-md text-gray-300 ">{data.content}</h1>
        )}
      </div>
      {editedNote && (
        <Button onClick={()=>handleChange()} className="bg-amber-300 min-w-40   cursor-pointer  rounded-md ml-50   ">
          Saqlash
        </Button>
      )}
    </div>
  );
}
