import "./globals.css";
import { cookies } from "next/headers";
import { I18nProviderClient } from "@/locales/client";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface Props {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({ children, params: { locale } }: Props) {
  const theme = cookies().get("theme");

  return (
    <html lang={locale} className={theme ? theme.value : ""}>
      <body className="dark:bg-[#282828]">
        <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
      </body>
    </html>
  );
}