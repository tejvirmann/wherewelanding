import SiteHeader from "../components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { getAuthState } from "@/lib/getAuthState";

const POSTS = [
  { title: "Looking for friends", url: "https://www.reddit.com/r/madisonwi/comments/1ox7yin/looking_for_friends/" },
  { title: "On making friends in Madison", url: "https://www.reddit.com/r/madisonwi/comments/1qofk2z/on_making_friends_in_madison/" },
  { title: "Looking for people to hang out with", url: "https://www.reddit.com/r/madisonwi/comments/1oypmhc/looking_for_people_to_hang_out_with/" },
  { title: "Madisonians looking for friends", url: "https://www.reddit.com/r/madisonwi/comments/1n7quws/madisonians_looking_for_friends/" },
  { title: "I have no friends to ask this, but...", url: "https://www.reddit.com/r/madisonwi/comments/1on3k6v/i_have_no_friends_to_ask_this_but/" },
  { title: "Looking for more friends", url: "https://www.reddit.com/r/madisonwi/comments/1ogsxjo/looking_for_more_friends/" },
  { title: "Starting informal coding meetup", url: "https://www.reddit.com/r/madisonwi/comments/1q8m13o/starting_informal_coding_meetup/" },
  { title: "Group weightlifting / strength training", url: "https://www.reddit.com/r/madisonwi/comments/1p33jo0/group_weightliftingstrength_training_class_with/" },
  { title: "Regular activities for 2nd shift workers", url: "https://www.reddit.com/r/madisonwi/comments/1opjk7i/what_are_some_regular_activities_for_2nd_shift/" },
  { title: "Where do Black people hang out?", url: "https://www.reddit.com/r/madisonwi/comments/1q7t1wa/where_do_black_people_hang_out/" },
  { title: "Need friends", url: "https://www.reddit.com/r/madisonwi/comments/1ra3gv6/need_friends/" },
  { title: "Where can I meet other nerdy people?", url: "https://www.reddit.com/r/madisonwi/comments/1rctd2d/where_can_i_meet_other_nerdy_people_in_town/" },
  { title: "Another let's play music together post", url: "https://www.reddit.com/r/madisonwi/comments/1rdj0f5/another_lets_play_music_together_post/" },
  { title: "Coffee lovers group in Madison", url: "https://www.reddit.com/r/madisonwi/comments/1rd1t7o/coffee_lovers_group_in_madison/" },
  { title: "Looking to start/join a rock/alt band", url: "https://www.reddit.com/r/madisonwi/comments/1rbthav/looking_to_startjoin_a_rockalt_band/" },
  { title: "How do 50-somethings find friends in Madison?", url: "https://www.reddit.com/r/madisonwi/comments/1reprt9/how_do_50somethings_find_friends_in_madison/" },
];

const EXAMPLES = [
  { activity: "running club", desc: "training for a half marathon. need people to run with on weekends." },
  { activity: "climbing crew", desc: "bouldering at The Bouldering Project alone gets old. want a consistent group." },
  { activity: "sober socials", desc: "cutting back on drinking and looking for people who want to do fun things without it being centered on alcohol." },
  { activity: "book club", desc: "one that actually meets. not a group chat that reads one book and dies." },
  { activity: "going out", desc: "bars, live music, dancing. just want people to go with." },
  { activity: "woodworking", desc: "just got a table saw. want to meet other people building things." },
  { activity: "coding / side projects", desc: "working on something solo and need accountability and people to talk shop with." },
  { activity: "figuring it out", desc: "don't have a specific goal. just moved here and want to meet real people." },
];

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const authState = user ? await getAuthState(supabase, user.id, user.email) : null;

  return (
    <div className="page">
      <SiteHeader active="about" user={authState} />

      <section className="about-hero">
        <h1>what is this?</h1>
        <p>
          where we landing is a friend matchmaking service for madison, wi.
          find your squad.
        </p>
        <p className="about-tagline">no ai. real people do the matching.</p>
        <p>
          we form small groups of people around a shared thing they want to do —
          then we make the introduction and get out of the way.
        </p>
        <p>
          not an app. not a social network. just an email when your match is ready
          and a place to show up.
        </p>
      </section>

      <section className="about-section">
        <h2>the groups we form</h2>
        <p>every group has a shared purpose. here are real examples of what people have asked for:</p>
        <div className="about-examples">
          {EXAMPLES.map(e => (
            <div key={e.activity} className="about-example-card">
              <span className="about-example-tag">{e.activity}</span>
              <p>{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>how it works</h2>
        <div className="about-steps">
          <div className="about-step">
            <span className="about-step-n">1</span>
            <div>
              <strong>you apply</strong>
              <p>tell us what you want to do and who you want to do it with. real humans read every application.</p>
            </div>
          </div>
          <div className="about-step">
            <span className="about-step-n">2</span>
            <div>
              <strong>we match you</strong>
              <p>real people — not an algorithm — read every application and hand-pick 2–5 people with compatible goals, schedules, and areas.</p>
            </div>
          </div>
          <div className="about-step">
            <span className="about-step-n">3</span>
            <div>
              <strong>you get an email</strong>
              <p>we introduce everyone, suggest a first meetup spot, and give you a signal so you recognize each other. the rest is on you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-section--proof">
        <h2>why madison, why now</h2>
        <p>
          madison is full of people who want this and don't know how to find it.
          here's what they're posting on reddit every week:
        </p>
        <div className="about-posts">
          {POSTS.map(p => (
            <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer" className="about-post-link">
              {p.title} →
            </a>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <p>ready?</p>
        <a href="/apply" className="btn-primary">apply to join</a>
      </section>

      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
