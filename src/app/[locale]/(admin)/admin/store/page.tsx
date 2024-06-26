import { sql } from "@vercel/postgres";
import Image from "next/image";
import ItemActions from "../../../../../components/Admin/Store/ItemActions";
import CreateItemButton from "../../../../../components/Admin/Store/CreateItemButton";
import { unstable_noStore as noStore } from "next/cache";
import { getScopedI18n } from "@/locales/server";
import SearchButton from "@/components/Admin/Store/SearchButton";

interface Props {
  searchParams: {
    search: string;
  };
}
async function getCurrentItems({ searchParams }: Props) {
  try {
    let res;
    if (searchParams.search) {
      const search = `%${searchParams.search}%`;
      res = await sql`SELECT * FROM products WHERE title ILIKE ${search} ORDER BY id ASC`;
    } else if (!searchParams.search) {
      res = await sql`SELECT * FROM products ORDER BY id ASC`;
    }

    return res?.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function page({ searchParams }: Props) {
  noStore();
  const items = (await getCurrentItems({ searchParams })) as ShopItem[];
  const word = await getScopedI18n("admin.store");

  return (
    <div className="flex w-full flex-col items-center pl-[7rem] lg:px-[8rem]">
      <div className="flex w-full flex-col overflow-x-auto pb-[2rem] last:rounded-lg lg:items-center">
        <div className="flex flex-grow flex-col gap-[2rem] px-[1rem] lg:items-end">
          <CreateItemButton />
          <div className="lg:flex lg:w-full lg:items-center lg:justify-center">
            <SearchButton />
          </div>
        </div>
        <div className="sticky mt-[2rem] grid w-[100rem] grid-cols-5 rounded-t-lg bg-green-600 py-[1.5rem] text-[1.5rem] text-white shadow-md">
          <div className="col-span-1 m-auto">{word("id")}</div>
          <div className="col-span-1 m-auto">{word("name")}</div>
          <div className="col-span-1 m-auto">{word("price")}</div>
          <div className="col-span-1 m-auto">{word("category")}</div>
          <div className="col-span-1 m-auto">{word("actions")}</div>
        </div>
        <div className="flex h-[60rem] w-[100rem] flex-col items-center overflow-x-auto overflow-y-auto scrollbar-hide xs:h-[40rem]">
          {items.map((item) => (
            <div key={item.id} className="grid w-[100rem] grid-cols-5 rounded-t-lg bg-white py-[2rem] text-[1.5rem]">
              <div className="col-span-1 m-auto">{item.id}</div>
              <div className="col-span-1 m-auto flex items-center gap-[.5rem]">
                <div className="flex w-[20rem] items-center gap-[1rem] px-[1rem]">
                  <div className="relative h-[2.5rem] w-[2.5rem]">
                    <Image src={item.images[0]} alt={item.title} className="rounded-sm" fill />
                  </div>
                  <p className="line-clamp-1">{item.title}</p>
                </div>
              </div>
              <div className="col-span-1 m-auto">${item.price}</div>
              <div className="col-span-1 m-auto flex gap-[.5rem]">
                {item.category.map((category, idx) => (
                  <p key={category + item.title}>
                    {category}
                    {idx === item.category.length - 1 ? null : ","}
                  </p>
                ))}
              </div>
              <div className="col-span-1 m-auto flex justify-center gap-[2.5rem]">
                <ItemActions id={item.id} item={item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
