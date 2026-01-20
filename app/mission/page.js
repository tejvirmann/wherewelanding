import SiteHeader from "../components/SiteHeader";

export default function MissionPage() {
  const posts = [
    {
      title: "Looking for friends",
      url: "https://www.reddit.com/r/madisonwi/comments/1ox7yin/looking_for_friends/"
    },
    {
      title: "Looking for people to hang out with",
      url: "https://www.reddit.com/r/madisonwi/comments/1oypmhc/looking_for_people_to_hang_out_with/"
    },
    {
      title: "Madisonians looking for friends",
      url: "https://www.reddit.com/r/madisonwi/comments/1n7quws/madisonians_looking_for_friends/"
    },
    {
      title: "I have no friends to ask this, but...",
      url: "https://www.reddit.com/r/madisonwi/comments/1on3k6v/i_have_no_friends_to_ask_this_but/"
    },
    {
      title: "Looking for more friends",
      url: "https://www.reddit.com/r/madisonwi/comments/1ogsxjo/looking_for_more_friends/"
    },
    {
      title: "Starting informal coding meetup",
      url: "https://www.reddit.com/r/madisonwi/comments/1q8m13o/starting_informal_coding_meetup/"
    },
    {
      title: "Group weightlifting/strength training class",
      url: "https://www.reddit.com/r/madisonwi/comments/1p33jo0/group_weightliftingstrength_training_class_with/"
    },
    {
      title: "Developing walkable areas",
      url: "https://www.reddit.com/r/madisonwi/comments/1o0s2dc/developing_walkable_areas/"
    },
    {
      title: "Bar recs",
      url: "https://www.reddit.com/r/madisonwi/comments/1og4elu/bar_recs/"
    },
    {
      title: "Regular activities for 2nd shift",
      url: "https://www.reddit.com/r/madisonwi/comments/1opjk7i/what_are_some_regular_activities_for_2nd_shift/"
    },
    {
      title: "Where do Black people hang out?",
      url: "https://www.reddit.com/r/madisonwi/comments/1q7t1wa/where_do_black_people_hang_out/"
    }
  ];

  return (
    <div className="page">
      <SiteHeader active="mission" />

      <section className="mission-hero">
        <h1>our mission</h1>
        <p className="mission-statement">
          we're building products to help people form, deepen & maintain meaningful
          connections with others and places on a recurring basis.
        </p>
        <p className="mission-statement">
          we won't tolerate an existence where we spend the majority of our time isolated,
          robbed of connection, meaning, & core life experiences.
        </p>
        <p className="mission-statement">
          we're building to maximize an in-real-life (IRL) future. at our core, we are
          a relationships company.
        </p>
      </section>

      <section className="mission-problem">
        <h2>the problem</h2>
        <p>
          there are a lot of disconnected, lonely people. it's not easy to find communities
          and non-ephemeral friends. people are looking for help.
        </p>
        <p>here's proof from madison, wi:</p>
      </section>

      <section className="mission-posts">
        {posts.map((post, index) => (
          <a
            key={index}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mission-post-link"
          >
            {post.title} →
          </a>
        ))}
      </section>

      <section className="mission-solution">
        <h2>our solution</h2>
        <p>
          this makes it simple for groups to pick a shared landing spot, show up, and see
          who else chose the same location.
        </p>
        <ul className="mission-features">
          <li>set time. set place. set mission. set identifier.</li>
          <li>example: "go to the coffee shop at 6pm, wear something purple."</li>
          <li>if no one is there, buy a cup of coffee and go home. not out of the way.</li>
          <li>
            people are always moving; if groups agree to intersect at the same point,
            there is a higher chance of running into people and meeting.
          </li>
          <li>hosts can create regular meetups (e.g., community organizers).</li>
        </ul>
      </section>

      <footer className="footer">
        © 2026 where we landing
      </footer>
    </div>
  );
}
