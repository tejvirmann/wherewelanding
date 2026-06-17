import "./globals.css";

export const metadata = {
  title: {
    default: "where we landing?",
    template: "%s | where we landing?"
  },
  description: "Friend matchmaking for Madison, WI. Apply to join the group.",
  openGraph: {
    title: "where we landing?",
    description: "Friend matchmaking for Madison, WI.",
    siteName: "where we landing?",
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/battle_bus_opt2.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
