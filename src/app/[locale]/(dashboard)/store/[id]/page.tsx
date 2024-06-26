import { sql } from "@vercel/postgres";
import SingleItemPageCard from "@/components/Store/Item/SingleItemPageCard";
import ShareSection from "@/components/Store/Item/ShareSection";
import ItemCard from "@/components/Store/ItemCard";
import { getScopedI18n } from "@/locales/server";
import { Metadata } from "next";

interface Props {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "Store",
  description: "AgroCult Store Item Page",
};

async function getProductDetails(id: string) {
  if (!id) return null;

  try {
    const res = await sql`SELECT * FROM products WHERE id = ${id}`;
    const product = res.rows[0] as ShopItem;

    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getRecommendedItems(category: string) {
  try {
    const res =
      await sql`SELECT * FROM products WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(products.category) AS elem WHERE elem ILIKE ${String(category)}) ORDER BY RANDOM() LIMIT 3`;

    return res.rows as ShopItem[];
  } catch (error) {
    console.error(error);
    return [];
  }
}
export default async function page({ params: { id } }: Props) {
  const product = await getProductDetails(id);
  const word = await getScopedI18n("store");

  if (!product) return null;

  const recommendedItems = await getRecommendedItems(product?.category[0] as string);

  return (
    <>
      <main className="flex w-full flex-col items-center py-[4rem]">
        <SingleItemPageCard product={product} />
        <div className="mt-[2rem] flex w-full flex-col items-center gap-[2rem] py-[2rem]">
          <p className="text-[2rem] font-medium dark:text-white">{word("product.shareProduct")}</p>
          <ShareSection id={id} title={product.title} />
        </div>
        <div className="mt-[3rem] flex w-full items-center justify-center">
          <h2 className="text-[2.5rem] font-bold dark:text-white">{word("product.recommendedItems")}</h2>
        </div>
        <div className="mt-[1rem] flex w-full items-center gap-[5rem] overflow-x-auto py-[2rem] lg:justify-center">
          {recommendedItems.map((item) => (
            <ItemCard key={item.id} {...item} layout="multi" />
          ))}
        </div>
      </main>
    </>
  );
}
