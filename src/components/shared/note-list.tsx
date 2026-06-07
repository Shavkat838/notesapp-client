import { CiMapPin, CiSearch } from "react-icons/ci";
import { HiOutlineSortDescending } from "react-icons/hi";
import { BsSortAlphaDown } from "react-icons/bs";
import { HiSortAscending } from "react-icons/hi";
import { CiClock1 } from "react-icons/ci";
import { useStatusStore } from "@/hooks/use-status";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import $api from "@/https/api";
import type { INote, INoteList } from "@/interfaces/type.note";
import { toast } from "sonner";
import { CiMenuKebab } from "react-icons/ci";
import { useDetailStore } from "@/hooks/use-detail";
import { formatDate } from "@/constans/formatdata";
import { FaPlus } from "react-icons/fa";
import { useCreateStore } from "@/hooks/use-create";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSearchStore } from "@/hooks/use-search";
import { useFilterStore } from "@/hooks/use-filter";
import { useState } from "react";
import { RiUnpinLine } from "react-icons/ri";
import { FaSort } from "react-icons/fa6";
// import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function NoteList() {
  const { status } = useStatusStore();
  const { setId, id } = useDetailStore();
  const { setOpen } = useCreateStore();
  const [word, setWord] = useState("");
  const { isOpenModal, setIsOpenModal, isOpenType, setIsOpenType } =
    useSearchStore();
  const {
    category,
    sortStatus,
    setSort,
    searchValue,
    setSearch,
    setTag,
    tagValue,
  } = useFilterStore();

  const queryClient = useQueryClient();

  async function getall() {
    const { data } = await $api.get("/", {
      params: {
        search: searchValue || undefined,
        tag: tagValue || undefined,
        sort: sortStatus || undefined,
        category: category || undefined,
      },
    });
    return data;
  }
  async function getArchive() {
    const { data } = await $api.get("/archive", {
      params: {
        search: searchValue || undefined,
        tag: tagValue || undefined,
        sort: sortStatus || undefined,
        category: category || undefined,
      },
    });
    return data;
  }
  async function getTrashed() {
    const { data } = await $api.get("/trash", {
      params: {
        search: searchValue || undefined,
        tag: tagValue || undefined,
        sort: sortStatus || undefined,
        category: category || undefined,
      },
    });
    return data;
  }
  const { data, isError, isLoading } = useQuery<INoteList[]>({
    queryKey: ["notes", status, searchValue, tagValue, sortStatus, category],
    queryFn: async () => {
      if (status == "ARCHIVE") return await getArchive();
      if (status == "TRASH") return await getTrashed();
      return await getall();
    },
  });
  const { data: tags } = useQuery<string[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await $api.get("/tags");
      return data;
    },
  });
  const { mutate: togglePin, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await $api.patch(`${id}/pinned`);
      return data;
    },
    onSuccess: (data: INote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(
        `${data.isPinned ? "Eslatma qadaldi!" : "Eslatma olib tashlandi"}`,
      );
    },
  });
  const { mutate: clearTrashAll } = useMutation({
    mutationFn: async () => {
      const { data } = await $api.delete("/trash/clear");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success(data.message);
    },
  });
  const { mutate: restoreTrashAll } = useMutation({
    mutationFn: async () => {
      const { data } = await $api.patch("/trash/restore-all");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success(data.message);
    },
  });
  const { mutate: deleteToTrash } = useMutation({
    mutationFn: async (param: "archive" | "all") => {
      const { data } = await $api.patch(`trash/all?type=${param}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success(data.message);
    },
  });
  const { mutate: archiveAll } = useMutation({
    mutationFn: async () => {
      const { data } = await $api.patch("/archive/all");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success(data.message);
    },
  });
  const { mutate: unarchiveAll } = useMutation({
    mutationFn: async () => {
      const { data } = await $api.patch("/unarchive/all");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setId(null);
      toast.success(data.message);
    },
  });

  function selectFilter(param: "search" | "tags") {
    setIsOpenType(param);
    setIsOpenModal(true);
  }
  function changeSearchValue() {
    setIsOpenModal(false);
    setSearch(word);
  }
  function changeTag(param: string) {
    setIsOpenModal(false);
    setTag(param);
  }

  if (isLoading) return <p className="text-white p-5">Yuklanmoqda...</p>;
  if (isError) toast.error("Kutilmagan xatolik");

  return (
    <div
      className={`flex flex-col h-full overflow-hidden w-full md:w-96 shrink-0 relative border-b md:border-b-0 md:border-r border-zinc-800 ${id ? "hidden md:flex" : "flex"}`}
    >
      {/* header */}
      <div className="w-full flex-none h-20 border-b border-zinc-800 flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <h2 className="text-gray-100 text-xl font-bold">
            {status == "ALL"
              ? "Notes"
              : status == "ARCHIVE"
                ? "Archive"
                : "Trash"}
          </h2>
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-zinc-800">
            <p className="text-white text-xs">{data?.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Popover
            open={isOpenType == "search" && isOpenModal}
            onOpenChange={(open) => setIsOpenModal(open)}
          >
            <PopoverTrigger asChild>
              <CiSearch
                onClick={() => selectFilter("search")}
                size={24}
                className="text-gray-400 hover:text-gray-200 cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 bg-zinc-900 border-zinc-800 p-2 flex gap-2"
            >
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Qidiruv..."
                className="bg-zinc-950 border-zinc-800 text-white"
              />
              <Button
                onClick={changeSearchValue}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
              >
                OK
              </Button>
            </PopoverContent>
          </Popover>

          <Popover
            open={isOpenType == "tags" && isOpenModal}
            onOpenChange={(open) => setIsOpenModal(open)}
          >
            <PopoverTrigger asChild>
              <FaSort
                onClick={() => selectFilter("tags")}
                size={20}
                className="text-gray-400 hover:text-gray-200 cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 p-3 bg-zinc-900 border-zinc-800"
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => changeTag("")}
                  className={`h-7 px-2 text-xs cursor-pointer ${tagValue === "" ? "bg-zinc-700" : "bg-zinc-950"} text-zinc-300 border border-zinc-700`}
                >
                  #All
                </Button>
                {tags?.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => changeTag(item)}
                    className={`h-7 px-2 text-xs cursor-pointer ${tagValue === item ? "bg-zinc-700" : "bg-zinc-950"} text-zinc-300 border border-zinc-700`}
                  >
                    #{item}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CiMenuKebab
                size={22}
                className="text-gray-400 hover:text-gray-200 cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-white">
              {status == "ALL" ? (
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => deleteToTrash("all")}
                    className="cursor-pointer"
                  >
                    Barchasini o'chirish
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => archiveAll()}
                    className="cursor-pointer"
                  >
                    Barchasini arxivlash
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : status == "ARCHIVE" ? (
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => deleteToTrash("archive")}
                    className="cursor-pointer"
                  >
                    Barchasini o'chirish
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => unarchiveAll()}
                    className="cursor-pointer"
                  >
                    Barchasini qaytarish
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => restoreTrashAll()}
                    className="cursor-pointer"
                  >
                    Barchasini tiklash
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => clearTrashAll()}
                    className="cursor-pointer"
                  >
                    Savatni tozalash
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full flex-none h-14 border-b border-zinc-800 flex items-center justify-around bg-zinc-950/50">
        <div
          onClick={() => setSort("LATEST")}
          className={`px-3 py-1 rounded-xl flex items-center cursor-pointer gap-2 ${sortStatus == "LATEST" && "bg-zinc-800"} hover:bg-zinc-800`}
        >
          <HiOutlineSortDescending size={18} className="text-gray-400" />
          <p className="text-sm text-gray-300">Yangi</p>
        </div>
        <div
          onClick={() => setSort("ALPHABETICAL")}
          className={`px-3 py-1 rounded-xl flex items-center cursor-pointer gap-2 ${sortStatus === "ALPHABETICAL" && "bg-zinc-800"} hover:bg-zinc-800`}
        >
          <BsSortAlphaDown size={18} className="text-gray-400" />
          <p className="text-sm text-gray-300">Alfavit</p>
        </div>
        <div
          onClick={() => setSort("OLDEST")}
          className={`px-3 py-1 rounded-xl flex items-center cursor-pointer gap-2 ${sortStatus === "OLDEST" && "bg-zinc-800"} hover:bg-zinc-800`}
        >
          <HiSortAscending size={18} className="text-gray-400" />
          <p className="text-sm text-gray-300">Eski</p>
        </div>
      </div>

      {/* notes container */}
      <div className="w-full flex-1 overflow-y-auto no-scrollbar flex-col division-y division-zinc-800">
        {data?.map((item, index) => (
          <div
            key={index + 1}
            onClick={() => setId(item._id)}
            className={`w-full h-24 flex flex-col justify-center px-4 py-2 border-b ${item._id === id ? "bg-zinc-800/80" : ""} hover:bg-zinc-800/50 cursor-pointer border-zinc-800/60 transition-colors`}
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-1.5">
                <CiClock1 size={14} className="text-gray-400" />
                <p className="text-xs text-gray-400">
                  {formatDate(item.createdAt)}
                </p>
              </div>
              <div
                className="flex gap-2 items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  disabled={isPending}
                  onClick={() => togglePin(item._id)}
                  className={`p-1 flex items-center ${(status === "ARCHIVE" || status === "TRASH") && "hidden"} cursor-pointer justify-center rounded-md hover:bg-zinc-700`}
                >
                  {item.isPinned ? (
                    <RiUnpinLine size={16} className="text-emerald-400" />
                  ) : (
                    <CiMapPin size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <h1 className="text-base font-semibold text-white mt-1 line-clamp-1">
              {item.title}
            </h1>
            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
              {item.content}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOpen()}
        className="
          w-12 h-12 text-white bg-emerald-600 flex items-center justify-center rounded-full text-xl cursor-pointer shadow-lg shadow-black/40 transition-all z-20 hover:scale-105
          
          /* Mobil ekranlarda oynaga mixlanadi va sal balandroq chiqadi (telefon pastki menyusiga xalaqit bermasligi uchun) */
          fixed bottom-24 right-4 
          
          /* Desktop (Kompyuter - md noutbuk) ekraniga o'tganda sening eskidek mutloq joyiga qaytadi */
          md:absolute md:bottom-14 md:right-4
        "
      >
        <FaPlus size={18} />
      </button>
    </div>
  );
}
