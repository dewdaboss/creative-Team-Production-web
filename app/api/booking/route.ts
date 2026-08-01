import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { bookingSchema, priceBooking } from "@/lib/booking";
import { dispatchLead } from "@/lib/notify";
import { appendLead } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!rateLimit(`booking:${clientIp(req)}`, 6, 10 * 60_000)) {
      return NextResponse.json(
        { ok: false, error: "Too many submissions — please try again in a few minutes." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Please check the form fields.";
      return NextResponse.json({ ok: false, error: msg, issues: parsed.error.issues }, { status: 400 });
    }
    if (parsed.data.company) {
      // honeypot tripped — silently accept
      return NextResponse.json({ ok: true, id: randomUUID() });
    }

    let priced;
    try {
      priced = priceBooking(parsed.data);
    } catch (e) {
      return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
    }

    const base = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      serviceId: parsed.data.serviceId,
      packageId: parsed.data.packageId,
      location: parsed.data.location,
      referenceUrl: parsed.data.referenceUrl,
      notes: parsed.data.notes,
      ...priced,
    };

    const webhook = await dispatchLead(base);
    await appendLead({ ...base, automation: { local: true, webhook } });

    return NextResponse.json({ ok: true, id: base.id, automation: { webhook } });
  } catch (err) {
    console.error("booking error", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try WhatsApp booking." }, { status: 500 });
  }
}
