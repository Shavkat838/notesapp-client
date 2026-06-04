import { CiMapPin, CiSearch } from "react-icons/ci";
import { HiOutlineSortDescending } from "react-icons/hi";
import { BsSortAlphaDown } from "react-icons/bs";
import { HiSortAscending } from "react-icons/hi";
import { CiClock1 } from "react-icons/ci";
import { useStatusStore } from "@/hooks/use-status";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import  $api  from "@/https/api";
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
import { HiOutlineArrowsExpand } from "react-icons/hi";
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

  const {
    mutate: togglePin,
    error,
    isPending,
  } = useMutation({
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
    onError: () => {
      toast.error(`Xatolik:${error}`);
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
    onError: (error) => {
      console.log(error.message);
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

    onError: (error) => {
      console.log(error.message);
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
    onError: (error) => {
      toast.error(error.message);
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

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: unarchiveAll } = useMutation({
    mutationFn: async () => {
      const { data } = await $api.patch("/unarchive/all");
      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      console.log(data)
      setId(null);
      toast.success(data.message);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  function selectFilter(param: "search" | "tags") {
    setIsOpenType(param);
    setIsOpenModal(true);
  }

  function changeSearchValue() {
    setIsOpenModal(false);
    setSearch(word);
    // setWord("")
  }

  function changeTag(param: string) {
    setIsOpenModal(false);
    setTag(param);
  }

  if (isLoading) {
    return <p>Yuklanmoqda...</p>;
  }

  if (isError) {
    toast.error("Kutilmagan xatolik");
  }

  return (
    <div className="flex flex-col h-full overflow-hidden w-100  relative border border-gray-600">
      {/* header */}
      <div className="w-full flex-none h-24 border  border-gray-600 flex justify-between items-center">
        <div className="w-1/2 h-full flex items-center justify-center gap-4">
          <h2 className="text-gray-100 text-2xl font-bold">
            {status == "ALL"
              ? "Notes"
              : status == "ARCHIVE"
                ? "Archive"
                : "Trash"}
          </h2>
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-700  ">
            <p className="text-white ">{data?.length}</p>
          </div>
        </div>
        <div className="w-1/2 h-full flex items-center justify-end gap-4 mr-4   ">
          <Popover
            open={isOpenType == "search" && isOpenModal}
            onOpenChange={(open) => setIsOpenModal(open)}
          >
            <PopoverTrigger asChild>
              <CiSearch
                title="search"
                onClick={() => selectFilter("search")}
                size={26}
                className="text-gray-500  hover:text-gray-200 cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-90   p-3 flex items-start justify-between"
            >
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="search..."
              ></Input>
              <Button
                onClick={changeSearchValue}
                className="py-3 px-4 cursor-pointer"
              >
                Qidiring
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
                size={24}
                className="text-gray-500 hover:text-gray-200 cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-90 p-3 border-zinc-800">
              <div className="flex flex-wrap gap-2 items-start w-full">
                <Button
                  onClick={() => changeTag("")}
                  className={`h-8 px-3 text-xs cursor-pointer  ${tagValue === "" ? "bg-zinc-700" : "bg-zinc-900"} text-zinc-300 hover:bg-zinc-800 border border-zinc-700`}
                >
                  #All
                </Button>
                {tags && tags.length > 0 ? (
                  tags.map((item, index) => (
                    <Button
                      onClick={() => changeTag(item)}
                      key={index}
                      className={`h-8 px-3 text-xs cursor-pointer  ${tagValue === item ? "bg-zinc-700" : "bg-zinc-900"} text-zinc-300 hover:bg-zinc-800 border border-zinc-700`}
                    >
                      #{item}
                    </Button>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic">
                    Teglar mavjud emas
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CiMenuKebab
                size={24}
                className="text-gray-500 hover:text-gray-200 cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50">
              {status == "ALL" ? (
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                    Barchasini o'chirish
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* sorting */}
      <div className="w-full flex-none h-18 border border-gray-600  flex  items-center justify-around">
        <div
          onClick={() => setSort("LATEST")}
          className={`w-1/3 h-1/2  rounded-2xl flex items-center justify-center cursor-pointer gap-2 ${sortStatus == "LATEST" && "bg-gray-800"}   hover:bg-gray-800`}
        >
          <HiOutlineSortDescending
            size={20}
            className="text-gray-500  hover:text-gray-200 cursor-pointer "
          />
          <p className="text-md text-gray-300">Yangi</p>
        </div>
        <div
          onClick={() => setSort("ALPHABETICAL")}
          className={`w-1/3 h-1/2  rounded-2xl flex items-center justify-center cursor-pointer gap-2 ${sortStatus === "ALPHABETICAL" && "bg-gray-800"}   hover:bg-gray-800`}
        >
          <BsSortAlphaDown
            size={20}
            className="text-gray-500  hover:text-gray-200 cursor-pointer "
          />
          <p className="text-md text-gray-300">Alfavit</p>
        </div>
        <div
          onClick={() => setSort("OLDEST")}
          className={`w-1/3 h-1/2  rounded-2xl flex items-center justify-center cursor-pointer gap-2  ${sortStatus === "OLDEST" && "bg-gray-800"}  hover:bg-gray-800`}
        >
          <HiSortAscending
            size={20}
            className="text-gray-500  hover:text-gray-200 cursor-pointer "
          />
          <p className="text-md text-gray-300">Eski</p>
        </div>
      </div>
      <div className="w-full h-full flex flex-1 overflow-y-auto no-scrollbar flex-col">
        {/* mana shu yerda chizamiz */}

        {data?.map((item, index: number) => (
          <div
            key={index + 1}
            className={`w-full h-28 flex flex-col px-6 py-2 border ${item._id === id && "bg-gray-800"} hover:bg-gray-800 cursor-pointer border-gray-600`}
          >
            <div className="flex items-center  w-full h-1/2 justify-between ">
              <div className=" w-1/2 flex items-center  gap-2 h-full">
                <CiClock1 size={17} className="text-gray-300" />
                <p className="text-sm text-gray-400">
                  {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="w-1/2 h-full flex gap-1 items-center justify-end">
                <button
                  disabled={isPending}
                  onClick={() => togglePin(item._id)}
                  className={`p-1 flex items-center ${(status === "ARCHIVE" || status === "TRASH") && "hidden"} cursor-pointer justify-center  rounded-md   hover:bg-gray-600`}
                >
                  {item.isPinned ? (
                    <RiUnpinLine
                      title="unpin"
                      size={20}
                      className="text-white"
                    />
                  ) : (
                    <CiMapPin title="pin" size={20} className="text-white" />
                  )}
                </button>
                <button
                  title="note"
                  onClick={() => setId(item._id)}
                  className="p-1 flex items-center cursor-pointer justify-center  rounded-md   hover:bg-gray-600"
                >
                  <HiOutlineArrowsExpand size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex items-center mt-1">
              <h1 className="text-xl text-white line-clamp-1 ">{item.title}</h1>
            </div>

            <div className="flex items-center mt-1 ">
              <p className="text-md text-gray-400 line-clamp-1 ">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setOpen()}
        className="w-15 h-15 absolute text-white  hover:bg-white/20 bg-white/10 backdrop-blur-md border border-white/20  flex items-center justify-center rounded-full text-xl cursor-pointer  bottom-10 left-5  transition-all "
      >
        <FaPlus size={20} />
      </button>
    </div>
  );
}
