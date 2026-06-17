import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const supabase = await createClient();
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error || !data.url) redirect("/");
  redirect(data.url);
}
