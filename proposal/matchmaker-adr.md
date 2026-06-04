# WhereWeLanding — Friend Matchmaking Expansion

## What we're building

WhereWeLanding started as a spawn-point tool: pick a time, pick a place, show up. The next evolution is **friend matchmaking** — using that same low-friction model to pair people intentionally, not just geographically.

Instead of "hope someone shows up," users describe who they are and what they're looking for in a friend. The site surfaces compatible people nearby and suggests a shared spawn point to meet IRL — low stakes, no chat apps, no ghost risk.

**The hook:** It's Fortnite logic applied to loneliness. You drop in, you land somewhere, you meet someone. If it doesn't click, you go home — you were already going to that coffee shop anyway.

---

## Why Madison, why now

Reddit threads from Madison keep surfacing the same pain: people are here, they want friends, they don't know how to find them.

- ["Looking for more friends"](https://www.reddit.com/r/madisonwi/comments/1ogsxjo/looking_for_more_friends/)
- ["Madisonians looking for friends"](https://www.reddit.com/r/madisonwi/comments/1n7quws/madisonians_looking_for_friends/)
- ["I have no friends to ask this, but..."](https://www.reddit.com/r/madisonwi/comments/1on3k6v/i_have_no_friends_to_ask_this_but/)
- ["Where do Black people hang out?"](https://www.reddit.com/r/madisonwi/comments/1q7t1wa/where_do_black_people_hang_out/)

Madison is a mid-size college city with high transience — students graduate, people relocate, the social graph resets constantly. There's no existing tool that solves this for non-students. We go there first.

---

## How it works (user flow)

1. **Intake** — "Who are you? What kind of friend are you looking for?" (short form, no account required at first)
2. **Match** — We surface 1–3 compatible people in Madison
3. **Suggest a spawn point** — A real place, time, and a small prompt ("both of you like hiking — meet at Olbrich Park Saturday at 10am, bring coffee")
4. **Show up** — That's it. No DMs, no app install, no profile to maintain.

The identifier system from the original concept carries over: "wear something orange," "sit near the window." Low-tech trust signal.

---

## Madison on-the-ground launch

### Phase 1 — Flyers (this week)
- Draft flyer: short, punchy, QR code to intake form
- Target locations: coffee shops, co-working spaces, laundromats, climbing gyms, Aldo Leopold Nature Center, State Street
- Goal: 30–50 signups to seed the first match pool

### Phase 2 — First matches
- Manually run the first 5–10 matches
- Collect feedback: did they go? did it work? what would they change?
- Iterate intake form based on signal

### Phase 3 — Build the intake flow into the site
- Form lives at `wherewelanding.com/match`
- Auto-suggest spawn point from existing Madison pin data
- Light notification (email or text) when a match is ready

---

## Collaboration — Jassi

| Task | Owner |
|------|-------|
| Define matchmaking concept | Tej |
| Meet to align on plan | Tej + Jassi |
| Draft flyer copy | Jassi |
| Flyer design | Jassi |
| Print + distribute flyers | Both |
| Collect + review first signups | Both |

---

## Open questions

- What's the right intake length? (shorter = more signups, longer = better matches)
- Do we need accounts or can we run phase 1 fully anonymous?
- How do we handle safety? (consider: public-places-only suggestion, no personal info exchange until both opt in)
- What's Jassi's bandwidth and timeline?

---

## Next issues

- Build intake form (`/match` route)
- Design flyer (Figma or Canva)
- Map target flyer locations across Madison
- Set up simple spreadsheet or Airtable to log early signups
- Define "match score" criteria for manual first round
