import { CiClock1 } from "react-icons/ci";
import { BiSolidDuplicate } from "react-icons/bi";
import { IoTrashOutline } from "react-icons/io5";
import { IoArchive } from "react-icons/io5";
import { useDetailStore } from "@/hooks/use-detail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import $api from "@/https/api";
import type { INote } from "@/interfaces/type.note";
import { toast } from "sonner";
import { formatDate } from "@/constans/formatdata";
import { MdOutlineUnarchive } from "react-icons/md";
import { useStatusStore } from "@/hooks/use-status";

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
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IoArrowBackOutline } from "react-icons/io5";

export default function NoteDetail() {
  const { id, setId } = useDetailStore();
  const queryClient = useQueryClient();
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

  const { mutate: setTrash } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $api.delete(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success("O`chirildi!");
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
  });
  const { mutate: archiveMutate } = useMutation({
    mutationFn: async (id: string) => {
      await $api.patch(`/${id}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success("Muvaffaqiyatli!");
    },
  });
  const { mutate: hardDelete } = useMutation({
    mutationFn: async (id: string) => {
      await $api.delete(`/${id}/force`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success("Butunlay ochirildi");
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
      toast.success("Duplikati tayyor!");
    },
  });
  const { mutate: handleChange } = useMutation({
    mutationFn: async () => {
      const { data: updatedData } = await $api.put(`/${id}`, {
        title: title,
        content: content,
      });
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setEditedNote(false);
      toast.success("Eslatma yangilandi");
    },
  });

  if (isLoading) return <p className="text-white p-5">Yuklanmoqda...</p>;

  if (!data) {
    return (
      <div className="hidden md:flex flex-1 text-zinc-500 items-center justify-center italic">
        Birorta eslatmani tanlang!
      </div>
    );
  }

  if (isError) toast.error("Kutilmagan xatolik");

  return (
    <div
      className={`flex-1 h-full bg-gray-900 border-t md:border-t-0 border-zinc-800 ${id ? "flex flex-col" : "hidden md:flex"}`}
    >
      <div className="w-full h-16 border-b border-zinc-800 flex px-4 md:px-8 items-center justify-between shrink-0">
        {/* Chap tomon: Orqaga tugmasi va kichik sana */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setId(null)}
            className="p-2 md:hidden text-gray-400 hover:text-white bg-zinc-800 rounded-lg cursor-pointer flex-none"
          >
            <IoArrowBackOutline size={20} />
          </button>
          <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded-md border border-zinc-800 flex-none">
            <CiClock1 style={{ color: data.color }} size={14} />
            <span
              style={{ color: data.color }}
              className="text-xs text-gray-400"
            >
              {formatDate(data.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          <div
            onClick={() => setEditedNote(!editedNote)}
            className={`w-9 h-9 flex items-center ${(status == "ARCHIVE" || status == "TRASH") && "hidden"} justify-center cursor-pointer ${editedNote ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "hover:bg-zinc-800 text-gray-300"} rounded-lg border border-zinc-800 transition-colors flex-none`}
          >
            <MdEdit size={18} />
          </div>

          <div
            onClick={() => duplicateNote(data._id)}
            className={`w-9 h-9 flex items-center ${(status == "ARCHIVE" || status == "TRASH") && "hidden"} justify-center cursor-pointer hover:bg-zinc-800 rounded-lg border border-zinc-800 flex-none`}
          >
            <BiSolidDuplicate size={18} className="text-gray-300" />
          </div>

          <div
            onClick={
              data.isTrashed
                ? () => setRestore(data._id)
                : () => setTrash(data._id)
            }
            className="w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-zinc-800 rounded-lg border border-zinc-800 flex-none"
          >
            <IoTrashOutline size={18} className="text-gray-300" />
          </div>

          <div
            onClick={() => archiveMutate(data._id)}
            className={`w-9 h-9 flex items-center ${status == "TRASH" && "hidden"} justify-center cursor-pointer hover:bg-zinc-800 rounded-lg border border-zinc-800 flex-none`}
          >
            {data.isArchived ? (
              <MdOutlineUnarchive size={18} className="text-emerald-400" />
            ) : (
              <IoArchive size={18} className="text-gray-300" />
            )}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                className={`${status === "TRASH" ? "flex" : "hidden"} w-9 h-9 items-center justify-center cursor-pointer hover:bg-zinc-800 rounded-lg border border-zinc-800 flex-none`}
              >
                <IoTrashOutline size={18} className="text-red-500" />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%] max-w-md bg-zinc-900 border-zinc-800 text-white rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Haqiqatdan ushbu eslatmani butunlay o'chirmoqchimisiz?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="flex items-center justify-end gap-2 mt-4">
                <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                  Yo'q
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => hardDelete(data._id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  O'chirish
                </AlertDialogAction>
              </AlertDialogDescription>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="w-full flex-1 px-4 md:px-8 py-6 overflow-y-auto pb-24 flex flex-col gap-4">
        <div className="w-full flex-none">
          {editedNote ? (
            <Input
              defaultValue={data.title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-zinc-950 border-zinc-800 text-white text-xl font-bold rounded-xl focus-visible:ring-emerald-600"
              placeholder="Sarlavha..."
            />
          ) : (
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-100 wrap-break-word tracking-tight leading-tight">
              {data.title}
            </h1>
          )}
        </div>

        <div className="w-full flex-1 min-h-0 flex flex-col gap-4">
          {editedNote ? (
            <div className="w-full flex-1 flex flex-col gap-4 min-h-0">
              <textarea
                defaultValue={data.content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full flex-1 min-h-50 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-emerald-600 resize-none text-base leading-relaxed"
                placeholder="Eslatma matni..."
              />
              <Button
                onClick={() => handleChange()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex-none"
              >
                Saqlash
              </Button>
            </div>
          ) : (
            <p className="text-base md:text-lg text-gray-300 whitespace-pre-wrap leading-relaxed tracking-wide">
              {data.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
