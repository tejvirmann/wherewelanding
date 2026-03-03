import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CITY_CONFIG = {
  "madison-wi": { name: "Madison, WI", lat: 43.0731, lng: -89.4012 },
  "milwaukee-wi": { name: "Milwaukee, WI", lat: 43.0389, lng: -87.9065 }
};

export default async function Image({ params }) {
  const city = CITY_CONFIG[params.city] || CITY_CONFIG["madison-wi"];
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  let mapDataUrl = null;

  if (apiKey) {
    try {
      const staticMapUrl =
        `https://maps.googleapis.com/maps/api/staticmap` +
        `?center=${city.lat},${city.lng}` +
        `&zoom=13` +
        `&size=1200x630` +
        `&scale=2` +
        `&style=feature:poi|element:labels|visibility:off` +
        `&key=${apiKey}`;

      const res = await fetch(staticMapUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const b64 = Buffer.from(buffer).toString("base64");
        mapDataUrl = `data:image/png;base64,${b64}`;
      }
    } catch (_) {}
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        {mapDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mapDataUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt=""
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #a8c8e8, #7ba8c8)"
            }}
          />
        )}

        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65))",
            display: "flex"
          }}
        />

        {/* Bottom label */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "32px 48px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 18 }}>
              community map
            </span>
            <span style={{ color: "#fff", fontSize: 40, fontWeight: 700 }}>
              {city.name}
            </span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 18 }}>
            where we landing?
          </span>
        </div>
      </div>
    ),
    size
  );
}
