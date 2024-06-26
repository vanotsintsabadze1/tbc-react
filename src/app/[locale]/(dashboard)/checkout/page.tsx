import React from "react";
import { getSession } from "@auth0/nextjs-auth0";
import CheckoutWrapper from "@/components/Checkout/CheckoutWrapper";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Official AgroCult Checkout Page",
};

async function getCartItems(userId: string) {
  if (!userId) {
    return [];
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/get-cart-items`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function page() {
  const session = await getSession();

  const user = session?.user;

  const cartItems = (await getCartItems(user?.sub as string)) as CartItem[];

  if (cartItems.length === 0) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-[60rem] w-full items-center justify-center py-[4rem]">
      <CheckoutWrapper items={cartItems} />
    </main>
  );
}
