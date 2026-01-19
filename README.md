# wherewelanding
A solution to the lack of third spaces and community in cities. A way for many people to coordinate where to cross paths. 

## Problem & project idea
There are a lot of disconnected, lonely people in Madison, WI. It is not easy to
find communities and non-ephemeral friends.

### Project idea: Where We Landing
A lightweight way for people to intersect in real life by choosing a shared
spawn point near their routine. The name is a Fortnite reference.

- Set time. Set place. Set mission. Set identifier.
- Example: "Go to the coffee shop at 6pm, wear something purple."
- If no one is there, buy a cup of coffee and go home. Not out of the way.
- People are always moving; if groups agree to intersect at the same point,
  there is a higher chance of running into people and meeting.
- Hosts can create regular meetups (e.g., community organizers).

### Current focus (MVP)
- Launch a fun, Fortnite-inspired front page with the Battle Bus vibe.
- Start with a single map: a software meetup in Madison, WI.
- Let verified users drop pins and see who else picked the same location.
- Keep the map live so activity can change at any time.
- Move the pilot map to its own page (`/map`).

### Future ideas
- Per-map AI that answers questions about group members and constraints.
- Pin TTL (e.g., 2 weeks) so old drops expire automatically.

### Evidence from the community
People keep asking where to meet, how to make friends, and how to find regular
activities:

- [Where do Black people hang out?](https://www.reddit.com/r/madisonwi/comments/1q7t1wa/where_do_black_people_hang_out/)
- [Starting informal coding meetup](https://www.reddit.com/r/madisonwi/comments/1q8m13o/starting_informal_coding_meetup/)
- [Group weightlifting/strength training class](https://www.reddit.com/r/madisonwi/comments/1p33jo0/group_weightliftingstrength_training_class_with/)
- [Developing walkable areas](https://www.reddit.com/r/madisonwi/comments/1o0s2dc/developing_walkable_areas/)
- [Looking for more friends](https://www.reddit.com/r/madisonwi/comments/1ogsxjo/looking_for_more_friends/)
- [Bar recs](https://www.reddit.com/r/madisonwi/comments/1og4elu/bar_recs/)
- [I have no friends to ask this, but...](https://www.reddit.com/r/madisonwi/comments/1on3k6v/i_have_no_friends_to_ask_this_but/)
- [Low-cost or free therapy?](https://www.reddit.com/r/madisonwi/comments/1opjj2a/does_anyone_know_of_any_low_cost_or_free_therapy/)
- [Regular activities for 2nd shift](https://www.reddit.com/r/madisonwi/comments/1opjk7i/what_are_some_regular_activities_for_2nd_shift/)
- [Looking for friends](https://www.reddit.com/r/madisonwi/comments/1ox7yin/looking_for_friends/)
- [Looking for people to hang out with](https://www.reddit.com/r/madisonwi/comments/1oypmhc/looking_for_people_to_hang_out_with/)
- [Madisonians looking for friends](https://www.reddit.com/r/madisonwi/comments/1n7quws/madisonians_looking_for_friends/)

### Notes
- [wherewelanding.com](https://wherewelanding.com)

### Deployment (Vercel)
- Framework: Next.js (App Router).
- Environment variables:
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for the Madison map.
  - `NEXT_PUBLIC_FORGE_API_URL` reserved for future integrations.
- Vercel settings are defined in `vercel.json`.
