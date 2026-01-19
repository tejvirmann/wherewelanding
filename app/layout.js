import "./globals.css";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

export const metadata = {
  title: "Where We Landing",
  description: "Fortnite-inspired meetup drops for Madison, WI."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={sora.className}>{children}</body>
    </html>
  );
}
