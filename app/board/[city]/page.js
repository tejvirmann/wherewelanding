import SiteHeader from "../../components/SiteHeader";

const CITY_NAMES = {
  "madison-wi": "Madison, WI",
  "milwaukee-wi": "Milwaukee, WI"
};

const POSTS = [
  {
    title: "Looking for a running partner downtown",
    body: "Early mornings, 6am-ish. Happy to do Lake Monona loop. DM me!",
    meta: "2 hours ago",
    img: "/board/running.jpg",
    imgColor: "#a8d8e8"
  },
  {
    title: "Anyone interested in weekly coffee meetups?",
    body: "Looking to start a casual thing at Ancora on State St. First Thursday?",
    meta: "5 hours ago",
    img: "/board/coffee.jpg",
    imgColor: "#f8d7a0"
  },
  {
    title: "New to town — looking for people to hang with",
    body: "Just moved here from Chicago. Into music, hiking, and trying every bar on State.",
    meta: "1 day ago",
    img: "/board/newtown.jpg",
    imgColor: "#c8e6c9"
  },
  {
    title: "Pickup basketball — Saturday mornings",
    body: "Warner Park courts, 9am. All skill levels. Just show up.",
    meta: "2 days ago",
    img: "/board/bball.jpg",
    imgColor: "#f8c8c8"
  },
  {
    title: "Board game nights — looking for players",
    body: "I have a huge collection. Hosting at my place near campus. BYOB.",
    meta: "3 days ago",
    img: "/board/games.jpg",
    imgColor: "#e8d5f8"
  },
  {
    title: "Hiking group forming — Devil's Lake",
    body: "Planning a trip for next weekend. Looking for 4-6 people. All paces welcome.",
    meta: "4 days ago",
    img: "/board/hiking.jpg",
    imgColor: "#d4f8c8"
  }
];

export async function generateMetadata({ params }) {
  const cityName = CITY_NAMES[params.city] || params.city;
  return {
    title: `${cityName} · board`,
    description: `Questions and discussions from the ${cityName} community. Share what you're looking for.`,
    openGraph: {
      title: `${cityName} · board`,
      description: `Questions and discussions from the ${cityName} community. Share what you're looking for.`,
      siteName: "where we landing?"
    }
  };
}

export default function BoardPage({ params }) {
  const cityName = CITY_NAMES[params.city] || params.city;

  return (
    <div className="page">
      <SiteHeader active="home" />

      <div className="board-header">
        <h1>community board</h1>
        <p>{cityName}</p>
        <button className="btn-primary" type="button">+ post something</button>
      </div>

      <div className="corkboard">
        {POSTS.map((post, i) => (
          <div className="pin-card" key={i} style={{ "--rotate": `${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3) * 0.5)}deg` }}>
            <div className="pin-dot" />
            <div
              className="pin-image"
              style={{ background: post.imgColor }}
            />
            <div className="pin-body">
              <p className="pin-title">{post.title}</p>
              <p className="pin-text">{post.body}</p>
              <p className="pin-meta">{post.meta}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        © 2026 where we landing
      </footer>
    </div>
  );
}
