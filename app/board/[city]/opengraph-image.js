import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CITY_NAMES = {
  "madison-wi": "Madison, WI",
  "milwaukee-wi": "Milwaukee, WI"
};

const PREVIEW_POSTS = [
  { title: "Looking for a running partner downtown", color: "#a8d8e8" },
  { title: "Weekly coffee meetups — anyone interested?", color: "#f8d7a0" },
  { title: "New to town, looking for people to hang with", color: "#c8e6c9" },
  { title: "Pickup basketball — Saturday mornings", color: "#f8c8c8" }
];

export default function Image({ params }) {
  const cityName = CITY_NAMES[params.city] || params.city;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#b5651d",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          position: "relative",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        {/* Header bar */}
        <div
          style={{
            background: "rgba(0,0,0,0.25)",
            padding: "28px 48px",
            display: "flex",
            alignItems: "baseline",
            gap: "20px"
          }}
        >
          <span style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>
            community board
          </span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}>
            {cityName}
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: "rgba(255,255,255,0.5)",
              fontSize: 16
            }}
          >
            where we landing?
          </span>
        </div>

        {/* Cards */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: "36px",
            padding: "40px 48px",
            alignItems: "flex-start"
          }}
        >
          {PREVIEW_POSTS.map((post, i) => (
            <div
              key={i}
              style={{
                background: "#fffef0",
                width: "240px",
                boxShadow: "4px 6px 20px rgba(0,0,0,0.4)",
                transform: `rotate(${i % 2 === 0 ? -1.5 : 1.2}deg)`,
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}
            >
              {/* Pin dot */}
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#cc2200",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                  position: "absolute",
                  top: -7,
                  left: "50%",
                  marginLeft: -7
                }}
              />
              {/* Image placeholder */}
              <div
                style={{
                  width: "100%",
                  height: 130,
                  background: post.color,
                  display: "flex"
                }}
              />
              {/* Text */}
              <div style={{ padding: "12px 14px 16px" }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a0f06",
                    lineHeight: 1.4
                  }}
                >
                  {post.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
