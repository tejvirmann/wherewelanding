import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message?.trim()) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "where we landing <hello@wherewelanding.com>",
    to: "wherewelanding5@gmail.com",
    replyTo: email,
    subject: `message from ${name}`,
    html: `<p><strong>from:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, "<br/>")}</p>`
  });

  if (error) return NextResponse.json({ error: "failed to send" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
