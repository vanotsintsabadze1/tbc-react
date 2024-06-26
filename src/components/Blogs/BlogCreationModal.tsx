import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import Tiptap from "./Editor";
import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useScopedI18n } from "@/locales/client";

const schema = z.object({
  title: z.string().min(10, "Title is too short - Min. 10 characters"),
  description: z.string().min(50, "Description is too short - Min. 50 characters"),
  tags: z.array(z.string()).nonempty("Please add at least one tag"),
});

const tagSchema = z
  .string()
  .min(3, "Tag is too short - Min. 3 characters")
  .max(12, "Tag is too long - Max. 12 characters");

const parentAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

interface Props {
  id?: number;
  blogTags: string[] | [];
  blogDescription: string;
  usedFor: "create" | "edit";
  title?: string;
  imageThumbnail?: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BlogCreationModal({
  id,
  title,
  imageThumbnail,
  blogTags,
  blogDescription,
  usedFor,
  setModal,
}: Props) {
  const [description, setDescription] = useState(blogDescription);
  const [tags, setTags] = useState<string[]>(blogTags);
  const [newTag, setNewTag] = useState("");
  const [shouldNewTagBeVisible, setShouldNewTagBeVisible] = useState(false);
  const word = useScopedI18n("blogs");
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return null;
  }

  function newTagModal() {
    if (shouldNewTagBeVisible) {
      toast.error("You're already adding a tag");
      return;
    }

    if (tags.length > 2) {
      toast.error("You can only add 3 tags");
      return;
    }

    setShouldNewTagBeVisible(true);
  }

  function submitNewTag() {
    const result = tagSchema.safeParse(newTag);

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setTags((prev) => [...prev, newTag]);
    setShouldNewTagBeVisible(false);
    setNewTag("");
  }

  async function onBlogFormSubmit(formData: FormData) {
    const form = {
      title: formData.get("title"),
      description,
      tags,
    };

    const result = schema.safeParse(form);

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    if (usedFor === "create") {
      const thumbnail = formData.get("thumbnail") as File;

      if (thumbnail.size === 0) {
        toast.error("Please add a thumbnail");
        return;
      }

      if (thumbnail.size > 4.5 * 1024 * 1024) {
        toast.error("Thumbnail size is too large - Max. 4.5MB");
        return;
      }
    }

    const wid = user?.sub;
    const wname = user?.nickname;

    if (!wid || !wname) {
      toast.error("An error occurred");
      return;
    }

    formData.append("wid", wid);
    formData.append("wname", wname);
    formData.append("tags", JSON.stringify(tags));
    formData.append("description", description);
    formData.append("usedFor", usedFor);
    if (usedFor === "edit" && imageThumbnail && id && imageThumbnail !== "") {
      const thumbnail = formData.get("thumbnail") as File;
      formData.append("id", id.toString());

      if (thumbnail.size === 0) {
        formData.append("thumbnail", imageThumbnail);
      } else {
        if (thumbnail.size > 4.5 * 1024 * 1024) {
          toast.error("Thumbnail size is too large - Max. 4.5MB");
          return;
        } else {
          formData.append("thumbnail", thumbnail);
        }
      }
    }

    toast
      .promise(
        fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/create-blog`, {
          method: "POST",
          body: formData,
        }),
        {
          loading: usedFor === "edit" ? "Updating blog..." : "Creating blog...",
          success: usedFor === "edit" ? "Blog updated successfully" : "Blog created successfully",
          error: (err) => {
            console.error(err);
            return "An error occurred";
          },
        },
      )
      .finally(() => {
        setModal(false);
        router.refresh();
      });
  }

  return (
    <>
      {createPortal(
        <motion.div
          variants={parentAnimation}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed z-[40] flex h-screen w-screen items-center justify-center overflow-y-auto bg-[rgba(0,0,0,0.4)]"
        >
          <form
            action={onBlogFormSubmit}
            id="blogForm"
            className="relative m-auto flex w-[40rem] flex-col gap-[2rem] overflow-y-scroll rounded-lg bg-white px-[2rem] py-[2rem] shadow-md md:h-[67rem] md:w-[75rem] lg:w-[100rem] xs:w-[90%] dark:bg-dark-secondary"
          >
            <div className="flex flex-col gap-[.5rem] px-[.5rem]">
              <h2 className="text-[1.2rem] font-bold uppercase tracking-wide text-gray-400 dark:text-white">
                {word("blog.title")}
              </h2>
              <input
                type="text"
                defaultValue={usedFor === "edit" ? title : ""}
                className="h-[4rem] w-[30rem] rounded-lg border-2 border-gray-300 px-[1.2rem] py-[1rem] text-[1.5rem] xs:w-full"
                placeholder="Write the title.."
                name="title"
              />
            </div>
            <div className="flex flex-col gap-[.5rem] px-[.5rem]">
              <h2 className="text-[1.2rem] font-bold uppercase tracking-wide text-gray-400 dark:text-white">
                {word("blog.thumbnail")}
              </h2>
              <input
                type="file"
                className="text-[1.5rem] file:rounded-[2rem] file:border-none file:bg-green-600 file:px-[2rem] file:py-[.5rem] file:text-[1.5rem] file:text-white dark:text-white"
                placeholder="Write the title.."
                accept="image/webp, image/png, image/jpeg"
                name="thumbnail"
              />
              {imageThumbnail && imageThumbnail !== "" && <p className="dark:text-white">* {word("blog.ifEmpty")} </p>}
            </div>
            <div className="flex flex-col px-[.5rem] ">
              <h2 className="text-[1.2rem] font-bold uppercase tracking-wide text-gray-400 dark:text-white">
                {word("blog.tags")}
              </h2>
              <div className="flex w-full items-center gap-[2rem] py-[.5rem]">
                {tags.map((tag) => (
                  <div key={tag} className="relative flex w-[10rem] items-center justify-center">
                    <input
                      readOnly
                      defaultValue={tag}
                      type="text"
                      className="w-full rounded-lg bg-gray-200 px-[1rem] py-[.8rem] text-[1.3rem] font-medium text-gray-500"
                    />
                    <button
                      type="button"
                      className="absolute right-[.5rem] top-[.5rem] text-[1rem] font-bold"
                      onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
                    >
                      X
                    </button>
                  </div>
                ))}
                {shouldNewTagBeVisible && (
                  <div className="relative flex w-[12rem] items-center justify-center">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="w-full rounded-lg bg-gray-200 px-[1rem] py-[.8rem] text-[1.3rem] font-medium text-gray-500"
                      />
                      <button onClick={submitNewTag} type="button">
                        <Check className="absolute right-[.7rem] top-1/2 translate-y-[-50%] bg-gray-200" size={18} />
                      </button>
                    </div>
                  </div>
                )}
                <button className="text-[1.7rem] font-semibold" type="button" onClick={newTagModal}>
                  +
                </button>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[2rem] px-[.5rem]">
              <h2 className="text-[1.2rem] font-bold uppercase tracking-wide text-gray-400 dark:text-white">
                {word("blog.description")}
              </h2>

              <Tiptap description={description} setDescription={setDescription} />
            </div>
            <div className="flex w-full items-center justify-center gap-[2rem] py-[.5rem]">
              <input
                type="submit"
                value={word("blog.submit")}
                form="blogForm"
                className="h-[4rem] w-[12rem] cursor-pointer rounded-lg bg-green-600 px-[1rem] py-[.5rem] text-[1.3rem] font-bold text-white"
              />
              <button
                type="button"
                onClick={() => setModal(false)}
                className="h-[4rem] w-[12rem] rounded-lg border-2 border-green-600  px-[1rem] py-[.5rem] text-[1.3rem] font-bold text-black dark:text-white "
              >
                {word("blog.cancel")}
              </button>
            </div>
          </form>
        </motion.div>,
        document.body,
      )}
    </>
  );
}
