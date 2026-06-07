import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { $authApi } from "@/https/axios";
import $api from "@/https/api";
import { Folder, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RiArchiveStackLine } from "react-icons/ri";
import { MdDeleteSweep } from "react-icons/md";
import { TiHome } from "react-icons/ti";
import { useStatusStore } from "@/hooks/use-status";
import { useDetailStore } from "@/hooks/use-detail";
import { useFilterStore } from "@/hooks/use-filter";
import { CgProfile } from "react-icons/cg";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { useNavigate } from "react-router-dom";
import { useAuthStore, type IIUser } from "@/store/auth-store";

export default function AppSidebar() {
  const [categories, setCategories] = useState<string[]>([]);
  const { status, setStatus } = useStatusStore();
  const { setId } = useDetailStore();
  const { category, setCategory } = useFilterStore();
  const navigate = useNavigate();
  const { user, setAuth, setUser } = useAuthStore();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await $api.get("/category");
        setCategories(data);
      } catch (error) {
        toast.error(`Categorieslarni yuklashda xatolik:${error}`);
      }
    }
    fetchCategories();
  }, []);

  function changeStatus(param: "TRASH" | "ARCHIVE" | "ALL") {
    setStatus(param);
    setId(null);
  }

  async function logout() {
    try {
      await $authApi.post("/logout");
      setUser({} as IIUser);
      setAuth(false);
      localStorage.removeItem("accessToken");
      navigate("/", { replace: true });
      toast.success("Tizimdan chiqdingiz!");
    } catch (err) {
      console.log(err);
      toast.error(`Server bilan bog'liq muammo `);
    }
  }

  return (
    /* ✅ TELEFONDA: Pastki panel (w-full h-16), KOMPYUTERDA: Chap menyu (md:w-24 md:h-full) */
    <div className="flex flex-row md:flex-col items-center justify-around md:justify-start py-2 md:py-4 gap-2 md:gap-6 bg-zinc-950 w-full h-16 md:w-24 md:h-full border-t md:border-t-0 md:border-r border-zinc-800 order-last bottom-0 fixed left-0 md:relative md:order-first z-50">
      <button
        onClick={() => changeStatus("ALL")}
        className={`p-3 flex items-center cursor-pointer justify-center rounded-md ${status == "ALL" && "bg-zinc-900"} hover:bg-zinc-900`}
      >
        <TiHome size={24} className="hover:text-white text-gray-400" />
      </button>
      <button
        onClick={() => changeStatus("ARCHIVE")}
        className={`p-3 flex items-center cursor-pointer justify-center rounded-md ${status == "ARCHIVE" && "bg-zinc-900"} hover:bg-zinc-900`}
      >
        <RiArchiveStackLine
          size={24}
          className="hover:text-white text-gray-400"
        />
      </button>
      <button
        onClick={() => changeStatus("TRASH")}
        className={`p-3 flex items-center cursor-pointer justify-center rounded-md ${status == "TRASH" && "bg-zinc-900"} hover:bg-zinc-900`}
      >
        <MdDeleteSweep size={24} className="hover:text-white text-gray-400" />
      </button>

      <Sheet>
        <SheetTrigger asChild>
          <button className="p-3 cursor-pointer rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all">
            <Folder size={24} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-[#0f0f0f] border-zinc-800 text-white w-70"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-zinc-100 text-left text-2xl font-bold flex justify-between items-center">
              Categories
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-1">
            <button
              onClick={() => setCategory("")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl ${category === "" && "bg-zinc-900"} hover:bg-zinc-900 transition-all text-zinc-400 hover:text-white group`}
            >
              <Hash
                size={18}
                className="group-hover:text-emerald-500 transition-colors"
              />
              <span className="text-lg font-medium">Hammasi</span>
            </button>
            {categories.length > 0 &&
              categories.map((cat, index) => (
                <button
                  onClick={() => setCategory(cat)}
                  key={index}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl ${category === cat && "bg-zinc-900"} hover:bg-zinc-900 transition-all text-zinc-400 hover:text-white group`}
                >
                  <Hash
                    size={18}
                    className="group-hover:text-emerald-500 transition-colors"
                  />
                  <span className="text-lg font-medium">{cat}</span>
                </button>
              ))}
          </div>

          <div className="absolute bottom-8 left-6 right-6">
            <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase font-semibold">
                Pro Tip
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                Kategoriyalar bo'yicha saralash uchun ularni tanlang.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

  
      <div className="md:mt-auto">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`p-3 flex items-center cursor-pointer justify-center rounded-md hover:bg-zinc-900`}
            >
              <CgProfile size={24} className="hover:text-white text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="bg-zinc-950 border-zinc-800 text-white"
          >
            <PopoverHeader>
              <PopoverTitle className="font-sans-bold text-sm break-all">
                {user.email}
              </PopoverTitle>
            </PopoverHeader>
            <div className="w-full h-auto py-1 flex items-center hover:bg-zinc-900 rounded-md">
              <p
                onClick={logout}
                className="w-full text-red-500 text-md font-sans-bold rounded-md cursor-pointer text-center"
              >
                Tizimdan chiqish
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
