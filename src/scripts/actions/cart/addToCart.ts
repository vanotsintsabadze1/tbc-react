"use server";

import { revalidateTag } from "next/cache";

export async function addToCart(userId: number, productId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/add-cart-items`, {
    method: "POST",
    body: JSON.stringify({ userId, productId }),
  });

  if (res.ok) {
    const data = await res.json();
    console.log(data);
  }

  revalidateTag("cart");
}