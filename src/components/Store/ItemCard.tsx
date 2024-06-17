"use client";

import Image from "next/image";
import { useScopedI18n } from "../../locales/client";
import { addToCart } from "../../scripts/actions/cart/addToCart";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

interface Props extends ShopItem {
  layout: string;
}

function ItemCard({ images, id, title, description, price, layout }: Props) {
  const multiColView =
    "flex md:w-[30rem] sm:w-[38rem] flex-col m-auto items-center rounded-lg bg-white p-[2rem] shadow-md ";
  const singleColView =
    "flex w-[32rem] flex-col items-center rounded-[1.5rem] m-auto bg-white p-[2rem] shadow-md sm:w-[40rem] lg:min-w-[60rem] xl:min-w-[80rem] lg:flex-row lg:gap-x-[2rem]";
  const word = useScopedI18n("store");
  const router = useRouter();
  const { user } = useUser();

  function redirectOnClick() {
    router.push(`/store/${id}`);
  }

  function onAddToCart() {
    if (!user) {
      window.location.href = "/api/auth/login";
    }

    if (user) {
      if (price !== 0) {
        addToCart(user.sub as string, id);
      }
    }
  }

  return (
    <div className={layout === "multi" ? multiColView : singleColView}>
      <div className="flex w-full items-center justify-center lg:w-auto lg:flex-shrink-0">
        <div className="relative sm:h-[25rem] sm:w-[35rem] md:h-[20rem] md:w-[25rem] lg:h-[18rem] lg:w-[25rem] xs:h-[25rem] xs:w-[30rem]">
          <Image src={images[0]} alt={title} fill className="rounded-md shadow-md" />
        </div>
      </div>
      <div className="flex flex-col lg:gap-y-[3rem] xs:gap-[1rem]">
        <div className="flex w-full flex-grow flex-col gap-[.5rem] lg:w-auto lg:flex-shrink-0">
          <h4 className="mt-[1rem] line-clamp-1 text-[1.8rem] font-bold">{title}</h4>
          <p className="line-clamp-2 text-[1.3rem] font-medium">{description}</p>
          <p className="line-clamp-2 text-[1.5rem] font-medium">
            <b>Price</b>: {price === 0 ? "Negotiable" : `$${price}`}
          </p>
        </div>
        <div
          className={`flex w-full gap-[1rem] ${layout === "multi" ? "justify-center sm:pt-[2rem]" : "justify-start"}`}
        >
          <button
            onClick={redirectOnClick}
            className={`w-[80%] rounded-lg bg-green-700 py-[.7rem] text-[1.4rem] text-white ${layout === "multi" ? "w-[80%]" : "w-[90%]"}`}
          >
            {word("buy")}
          </button>
          <button
            className={`rounded-md bg-gray-200 p-[.5rem] px-[1rem] shadow-sm ${price === 0 ? "cursor-not-allowed opacity-30" : ""} flex items-center justify-center ${layout === "multi" ? "w-[20%]" : "w-[10%]"}`}
            onClick={onAddToCart}
          >
            <ShoppingCart className="" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
