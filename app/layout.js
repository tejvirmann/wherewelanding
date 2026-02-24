import "./globals.css";
import { LocationProvider } from "./contexts/LocationContext";

export const metadata = {
  title: {
    default: "where we landing?",
    template: "%s | where we landing?"
  },
  description:
    "Find a squad. Connect with people and places on a recurring basis. Browse community squads, drop a pin on the map, and land with others in your city.",
  keywords: [
    "find friends",
    "meetups",
    "community",
    "squads",
    "Madison WI",
    "Milwaukee WI",
    "social",
    "real life connections"
  ],
  openGraph: {
    title: "where we landing?",
    description:
      "Find a squad. Connect with people and places on a recurring basis. Browse community squads, drop a pin on the map, and land with others in your city.",
    siteName: "where we landing?",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "where we landing?",
    description:
      "Find a squad. Connect with people and places on a recurring basis."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/battle_bus.glb" as="fetch" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('wwl-theme') || 'light';
                  document.documentElement.dataset.theme = theme;
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body>
        <LocationProvider>{children}</LocationProvider>
      </body>
    </html>
  );
}
