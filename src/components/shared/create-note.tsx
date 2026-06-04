import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateStore } from "@/hooks/use-create";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import  $api  from "@/https/api";
import { useDetailStore } from "./../../hooks/use-detail";

export function CreateNote() {
  const { isOpen, setClose } = useCreateStore();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState("#f87171");
  const queryClient = useQueryClient();
  const { setId } = useDetailStore();

  type AddNoteType = {
    title: string;
    content: string;
    category: string;
    tags: string[];
    color: string;
  };

  const noteSchema = z.object({
    title: z.string().min(1, "Sarlavha bo'sh bo'lmasligi kerak"),
    category: z.string().min(1, "Kategoriyani tanlang yoki o'zingiz kiriting"),
    content: z
      .string()
      .min(10, "Matn kamida 10 ta belgidan iborat bolishi kerak"),
  });

  type NoteFormValues = z.infer<typeof noteSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const onSubmit = (data: NoteFormValues) => {
    if (tags.length === 0) {
      toast.error("Kamida bitta tag kiritishingiz kerak!");
      return;
    }
    const finalPayload: AddNoteType = {
      ...data,
      tags: tags,
      color: selectedColor,
    };

    mutate(finalPayload);
  };

  const { mutate } = useMutation({
    mutationFn: async (finalPayload: AddNoteType) => {
      const { data } = await $api.post("/", finalPayload);

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Eslatma muvaffaqiyatli yaratildi!");
      setId(null);
      setClose()
      reset();
      setTags([]);
      setSelectedColor("#f87171");
    },

    onError: (error) => {
      toast.error(error.message);
      reset();
      setTags([]);
      setSelectedColor("#f87171");
    },
  });

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        e.currentTarget.value = "";
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setClose}>
      <SheetContent className="bg-slate-900 border border-slate-800">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="text-slate-100">Eslatma qo'shish</SheetTitle>
            <SheetDescription className="text-slate-200">
              Eslatma tafsilotlarini kiriting
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-2 space-y-6 px-3 no-scrollbar ">
            <div className="space-y-2">
              <Label className="text-slate-200" htmlFor="title">
                Sarlavha
              </Label>
              <Input
                {...register("title")}
                id="title"
                className={`bg-slate-800/50 ${errors.title ? "border-red-500" : "border-slate-700"}   border-slate-700 text-slate-100 focus:ring-blue-500 placeholder:text-slate-500`}
                placeholder="Eslatma sarlavhasi..."
              />
              {errors.title && (
                <p className="text-red-500 text-xs italic">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200" htmlFor="category">
                Kategoriya
              </Label>
              <Input
                {...register("category")}
                id="category"
                list="category-list"
                className={`bg-slate-800/50 ${errors.category ? "border-red-500" : "border-slate-700"}   border-slate-700 text-slate-100 focus:ring-blue-500 placeholder:text-slate-500`}
                placeholder="Tanlang yoki yangi yozing..."
              />
              <datalist id="category-list">
                <option value="Ish" />
                <option value="Shaxsiy" />
                <option value="G'oya" />
              </datalist>

              {errors.category && (
                <p className="text-red-500 text-xs italic">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200" htmlFor="content">
                Mazmuni
              </Label>
              <textarea
                {...register("content")}
                id="content"
                rows={5}
                className={`w-full bg-slate-800/50 border  ${errors.content ? "border-red-500" : " border-slate-700"}   rounded-md p-3 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500`}
                placeholder="Eslatma matnini bu yerga yozing..."
              />
              {errors.content && (
                <p className="text-red-500 text-xs italic">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Teglar (Enter bosing)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags &&
                  tags.map((item, index) => (
                    <span
                      onClick={() => removeTag(item)}
                      key={index + 1}
                      className="bg-purple-500/10 cursor-pointer text-purple-400 border border-purple-500/20 px-2 py-0.5 hover:border-red-500 rounded text-xs italic"
                    >
                      #{item}
                    </span>
                  ))}
              </div>
              <Input
                onKeyDown={handleTagKeyDown}
                className="bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-blue-500"
                placeholder="Sport, Reja..."
              />
            </div>

            <div className="space-y-3">
              <Label className="text-slate-200">Rang tanlang</Label>
              <div className="flex items-center gap-4">
                {["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                      className={`w-8 h-8 cursor-pointer rounded-full border-2 border-slate-700  ${selectedColor === color ? "ring-2 ring-white" : ""} hover:scale-110 transition-transform active:scale-95 shadow-lg`}
                      style={{ backgroundColor: color }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button
              className="cursor-pointer bg-zinc-800 border-none"
              type="submit"
            >
              Save changes
            </Button>
            <SheetClose asChild>
              <Button className="cursor-pointer" variant="outline">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
