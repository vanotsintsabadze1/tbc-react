import { categories } from "../../data/categories";
import SortPreference from "./SortPreference";
import { useScopedI18n } from "@/locales/client";

interface Props {
  setPreference: React.Dispatch<React.SetStateAction<string>>;
}

export default function MobileFilter({ setPreference }: Props) {
  const word = useScopedI18n("store");
  return (
    <div className="mt-[2rem] flex h-[40rem] w-[40rem] flex-col overflow-y-auto rounded-lg bg-white px-[1rem] py-[3rem] shadow-md lg:hidden xs:w-full">
      <SortPreference setPreference={setPreference} />
      <section className="mt-[2rem] flex flex-col px-[1rem]">
        <h4 className="text-[1.8rem] font-bold">{word("price.title")}:</h4>
        <div className="mt-[1rem] flex items-center justify-center gap-[1rem]">
          <input
            placeholder={word("price.from")}
            className="h-[4rem] w-[18rem] rounded-lg border border-gray-300 px-[1rem] text-[1.6rem] placeholder:text-gray-500 "
          />
          <input
            placeholder={word("price.to")}
            className="h-[4rem] w-[18rem] rounded-lg border border-gray-300 px-[1rem] text-[1.6rem] placeholder:text-gray-500 "
          />
        </div>
      </section>
      <section className="mt-[2rem] flex flex-col px-[1rem]">
        <h4 className="text-[1.8rem] font-bold">{word("sort.title")}:</h4>
        <div className="mt-[1rem] flex items-center">
          <select className="h-[4rem] overflow-y-auto rounded-lg bg-gray-200 px-[1rem] py-[.5rem] text-[1.6rem] text-black shadow-sm outline-none">
            {categories.map((item, idx) => (
              <option key={idx}>
                {word(
                  `categories.${item.category.toLowerCase()}` as
                    | "categories.tractors"
                    | "categories.plowers"
                    | "categories.accessories"
                    | "categories.fertilizers"
                    | "categories.pesticides"
                    | "categories.tools"
                    | "categories.livestock",
                )}
              </option>
            ))}
          </select>
        </div>
      </section>
      <div className="mt-[3rem] flex w-full items-center justify-center">
        <button className="h-[4rem] w-[25rem] rounded-lg bg-green-600 text-[1.5rem] font-bold text-white shadow-md">
          Submit
        </button>
      </div>
    </div>
  );
}
