import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import LegalPage, { ConfigNote, LegalList, LegalSection, type LegalTocItem } from "@/components/LegalPage";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { isConfigured, legalConfig } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms governing bookings with Creative Team Production — services, booking confirmation, payment, cancellation, shoots, delivery, editing, copyright, portfolio use and liability.",
  alternates: { canonical: `${legalConfig.siteUrl}/terms-and-conditions` },
  openGraph: {
    title: `Terms & Conditions · ${legalConfig.contact.name}`,
    description: "Booking, payment, delivery and usage terms for our creative services.",
    type: "article",
  },
};

const TOC: LegalTocItem[] = [
  { id: "introduction", number: "01", title: "Introduction" },
  { id: "services", number: "02", title: "Our Photography & Videography Services" },
  { id: "booking-process", number: "03", title: "Booking Process" },
  { id: "booking-confirmation", number: "04", title: "Booking Confirmation" },
  { id: "payment", number: "05", title: "Payment Terms" },
  { id: "cancellation", number: "06", title: "Cancellation Policy" },
  { id: "rescheduling", number: "07", title: "Rescheduling Policy" },
  { id: "shoot-terms", number: "08", title: "Photoshoot Guidelines" },
  { id: "delivery", number: "09", title: "Video & Photo Delivery" },
  { id: "editing", number: "10", title: "Editing & Revisions" },
  { id: "copyright", number: "11", title: "Copyright & Ownership" },
  { id: "portfolio", number: "12", title: "Portfolio Usage Rights" },
  { id: "responsibilities", number: "13", title: "Client Responsibilities" },
  { id: "refund", number: "14", title: "Refund Policy" },
  { id: "liability", number: "15", title: "Limitation of Liability" },
  { id: "changes", number: "16", title: "Changes to Terms" },
  { id: "contact", number: "17", title: "Contact Information" },
];

export default function TermsPage() {
  const c = legalConfig.contact;
  const cfg = legalConfig.configurable;

  return (
    <LegalPage
      eyebrow="Terms & Conditions"
      title={
        <>
          Terms &amp; <span className="text-gradient-brand text-glow">Conditions</span>
        </>
      }
      intro={`These Terms & Conditions govern your use of this website and any services booked with ${c.name} ("we", "us", "our") — photography, reels, video editing, product shoots, events, long-form video and monthly growth packages. Please read them before booking.`}
      toc={TOC}
      related={{
        href: "/privacy-policy",
        label: "Privacy Policy",
        description: "How we collect, use and protect your personal information.",
      }}
    >
      {/* 01 — Introduction */}
      <LegalSection id="introduction" number="01" title="Introduction">
        <p>
          By using this website or booking a service with us, you agree to these Terms &amp; Conditions. If you do not
          agree, please do not book — you are welcome to browse the website and contact us with questions.
        </p>
        <p>
          These terms apply to website enquiries and to services we provide. Where we give you a written quote,
          confirmation message or agreement for a specific project, that written document prevails if it conflicts with
          these general terms. These terms are a plain-language summary of how we work and are not legal advice.
        </p>
      </LegalSection>

      {/* 02 — Our Services */}
      <LegalSection id="services" number="02" title="Our Photography & Videography Services">
        <p>We provide the following creative services, each under its own package as shown on this website:</p>
        <LegalList>
          <li><strong>Photography Shoot</strong> — portraits, lifestyle and on-location photography, priced per photo or per hour.</li>
          <li><strong>Reels Shoot</strong> — Instagram reels, from basic single-concept reels to fully produced premium reels.</li>
          <li><strong>Video &amp; Reel Editing</strong> — editing of footage you provide, or footage we shoot, including captions, grade and sound design.</li>
          <li><strong>Monthly Reels &amp; Growth</strong> — monthly content retainers with planned shoot days, posting plans and analytics.</li>
          <li><strong>Product Photography</strong> — e-commerce, catalogue and campaign product visuals, quoted per project.</li>
          <li><strong>Events &amp; Occasions</strong> — birthdays, anniversaries and celebrations coverage.</li>
          <li><strong>Long-Form Video</strong> — brand films, documentaries, music videos and other productions, scoped per project.</li>
        </LegalList>
        <p>
          The exact deliverables for your booking — what is included, what is not, and the price — are as described in
          the package you select and confirmed in writing before the shoot (see Sections 3 and 4).
        </p>
      </LegalSection>

      {/* 03 — Booking Process */}
      <LegalSection id="booking-process" number="03" title="Booking Process">
        <p>
          Booking starts with an enquiry. You can submit the online form on this website or message us on WhatsApp with
          the details of the shoot you have in mind. Everything you share is used only to prepare your estimate and
          reply to you — see our <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
        <LegalList>
          <li><strong>What to include:</strong> your name, phone number, shoot location, preferred date, the service and package you want, and any reference links or notes that help us understand the brief.</li>
          <li><strong>No online payment:</strong> this website does not take payments or card details. Nothing is charged when you submit the form.</li>
          <li><strong>Estimates:</strong> the website shows starting prices and calculates an estimate for the options you pick. An estimate is not a final price.</li>
          <li><strong>Custom work:</strong> for product shoots, long-form video, project editing and other custom work, we quote after reviewing your requirements.</li>
          <li><strong>Travel:</strong> travel within 10 km of our studio in Indore is included. Travel beyond 10 km is quoted separately and confirmed in writing.</li>
          <li><strong>Response time:</strong> we reply during working hours. If you have not heard from us, please message us on WhatsApp or call — we do not want you waiting on a date.</li>
        </LegalList>
      </LegalSection>

      {/* 04 — Booking Confirmation */}
      <LegalSection id="booking-confirmation" number="04" title="Booking Confirmation">
        <p>
          A submitted enquiry is not a confirmed booking. Your booking is confirmed only when we have agreed the
          service, package, date, location and price with you in writing (for example through a WhatsApp or email
          confirmation) and any advance stated in that confirmation has been received.
        </p>
        <LegalList>
          <li><strong>Written confirmation:</strong> keep the message or quote we send you — it is the reference for what is included in your booking.</li>
          <li><strong>Date hold:</strong> a date or slot is held only after written confirmation. Dates discussed but not confirmed remain open for other clients.</li>
          <li><strong>Availability:</strong> if your preferred date is not available, we will offer alternatives that fit the same brief.</li>
          <li><strong>Changes before the shoot:</strong> if the brief, package, location or date changes before the shoot, tell us early — price and availability may need to be re-confirmed.</li>
          <li><strong>Advance:</strong> where an advance is required, it is stated in your confirmation; the balance schedule is agreed there too.</li>
        </LegalList>
      </LegalSection>

      {/* 05 — Payment Terms */}
      <LegalSection id="payment" number="05" title="Payment Terms">
        <p>All prices on this website are in Indian Rupees (₹). The price for your booking is the price confirmed in writing with you — website figures are starting prices or estimates unless your confirmation states otherwise.</p>
        <LegalList>
          <li><strong>How to pay:</strong> this website has no online payment gateway. Payment is made by the method agreed in your written confirmation (for example, bank transfer or UPI). Please keep your payment receipt.</li>
          <li><strong>When to pay:</strong> the advance and balance schedule is as stated in your written quote or confirmation.</li>
          <li><strong>Custom-quote projects:</strong> for product shoots, long-form video and project-based editing, the final price is agreed in the quote before work begins.</li>
          <li><strong>Late payment:</strong> if payment is delayed beyond the agreed schedule, we may pause editing, delivery or further shoot days until payment is received.</li>
        </LegalList>
        {isConfigured(cfg.advancePayment) ? (
          <p>To confirm a booking, an advance of <strong>{cfg.advancePayment}</strong> is required, with the balance payable as stated in your confirmation.</p>
        ) : (
          <ConfigNote label="Advance payment">
            The advance percentage required to confirm a booking has not yet been published. Until it is set in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, the advance (if any) for your booking is whatever your written confirmation states — please check it before paying.
          </ConfigNote>
        )}
        {isConfigured(cfg.taxTreatment) ? (
          <p>Prices are {cfg.taxTreatment}.</p>
        ) : (
          <ConfigNote label="Taxes">
            Whether quoted prices include or exclude taxes (such as GST) has not yet been confirmed. Until it is set in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, your written quote is the source of truth — please confirm the tax treatment in your quote before booking.
          </ConfigNote>
        )}
      </LegalSection>

      {/* 06 — Cancellation Policy */}
      <LegalSection id="cancellation" number="06" title="Cancellation Policy">
        <p>
          If you need to cancel a confirmed booking, contact us as early as possible by phone, WhatsApp or email and
          tell us which booking and date it relates to. How any advance is treated on cancellation is stated in your
          written confirmation; where your confirmation does not set a rule, we will discuss it with you fairly rather
          than apply a hidden penalty.
        </p>
        <LegalList>
          <li><strong>Before the shoot:</strong> cancellation terms, including any advance treatment, are as stated in your written confirmation.</li>
          <li><strong>Monthly packages:</strong> monthly growth retainers can be cancelled anytime after the first month, as stated on the website. Work already delivered remains payable.</li>
          <li><strong>Weather, venue access or events outside reasonable control:</strong> if a shoot cannot proceed for these reasons, we will work with you to reschedule; it is not treated as your cancellation.</li>
          <li><strong>No-show:</strong> if the client, talent or venue is unavailable at the agreed time without prior notice, the shoot may be treated as cancelled under your confirmation.</li>
          <li><strong>Cancellation by us:</strong> if we cannot deliver a confirmed shoot for reasons within our control, we will offer a substitute date or a fair resolution, including a refund of amounts paid for work not delivered.</li>
        </LegalList>
        {isConfigured(cfg.cancellationNoticePeriod) ? (
          <p>Please notify us at least <strong>{cfg.cancellationNoticePeriod}</strong> before the shoot to reschedule without penalty.</p>
        ) : (
          <ConfigNote label="Notice period">
            A standard notice period for free rescheduling or cancellation has not yet been published. Until it is set in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, please contact us as early as possible — the earlier you tell us, the more options we can offer.
          </ConfigNote>
        )}
      </LegalSection>

      {/* 07 — Rescheduling Policy */}
      <LegalSection id="rescheduling" number="07" title="Rescheduling Policy">
        <p>
          Life happens. If you need to move a confirmed booking to another date, tell us as soon as you know and we will
          do our best to find a new slot that works for both sides, subject to crew and studio availability.
        </p>
        <LegalList>
          <li><strong>How to reschedule:</strong> message us on WhatsApp, call, or email with the original date and your preferred new date.</li>
          <li><strong>Availability:</strong> a new date is confirmed only when we confirm it in writing. Popular weekends fill up first, so earlier is better.</li>
          <li><strong>Repeated changes:</strong> if a booking is moved repeatedly, or moved at very short notice, we may need to treat it as a cancellation under Section 6 and discuss a fresh booking.</li>
          <li><strong>Rescheduling by us:</strong> if we must move a shoot for reasons such as weather, illness or equipment failure, we will offer to reschedule at no extra cost, or a fair alternative.</li>
          <li><strong>Seasonal or event dates:</strong> for weddings, launches and events tied to a fixed date, rescheduling may not be possible — please check your confirmation.</li>
        </LegalList>
      </LegalSection>

      {/* 08 — Photoshoot Guidelines */}
      <LegalSection id="shoot-terms" number="08" title="Photoshoot Guidelines">
        <LegalList>
          <li>Please ensure the venue, location access, products, outfits, models or talent agreed for the shoot are ready at the scheduled time.</li>
          <li>You are responsible for obtaining any permissions needed for the location, people and property featured in the shoot, including consent from parents or guardians for minors.</li>
          <li>We may adjust the schedule, angles or setup on the day to achieve the best quality, and we will keep you informed of any significant change.</li>
          <li>Please follow reasonable safety instructions on set. We may pause or stop a shoot if conditions are unsafe.</li>
          <li>Raw or unedited files are included only if your package or written confirmation states so. Otherwise, delivery is of edited, finished files as described in Section 9.</li>
        </LegalList>
      </LegalSection>

      {/* 09 — Video & Photo Delivery */}
      <LegalSection id="delivery" number="09" title="Video & Photo Delivery">
        <p>Finished photos and videos are delivered as download links (for example, Google Drive or WeTransfer) or by another method agreed in your confirmation, in platform-ready formats suitable for Instagram, YouTube and print where relevant.</p>
        <LegalList>
          <li>Delivery timelines are as stated in your package or written confirmation. As a guide, unedited photos are typically delivered within 24 hours and edited photos within 48 hours; reels and larger projects follow the timeline in your confirmation.</li>
          <li>Please download and check your files promptly after delivery and tell us immediately if anything is missing or corrupted.</li>
          <li>Download links remain available for the period stated in your confirmation. After that period, files may be archived or removed.</li>
        </LegalList>
        {isConfigured(cfg.fileRetentionAfterDelivery) ? (
          <p>Project files are kept for <strong>{cfg.fileRetentionAfterDelivery}</strong> after delivery.</p>
        ) : (
          <ConfigNote label="File retention">
            How long project files and download links are kept after delivery has not yet been published. Until it is set in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, please download your files promptly and ask us in your confirmation how long they will be available.
          </ConfigNote>
        )}
      </LegalSection>

      {/* 10 — Editing & Revisions */}
      <LegalSection id="editing" number="10" title="Editing & Revisions">
        <p>
          Editing is included as described in your package — for example, colour grading, cuts, captions, transitions,
          motion text and sound design where the package includes them. The number of revision rounds included depends
          on your package (for example, basic edits include 1 round and standard or premium edits include 2 rounds).
        </p>
        <LegalList>
          <li>Please send all revision feedback together in one message per round so we can apply it accurately.</li>
          <li>Additional revision rounds, major re-edits or extra deliverables beyond your package may be charged at rates agreed with you in advance.</li>
          <li>Final delivery is made after your approval of the edited version, or after the feedback process in your confirmation is complete.</li>
        </LegalList>
      </LegalSection>

      {/* 11 — Copyright & Ownership */}
      <LegalSection id="copyright" number="11" title="Copyright & Ownership">
        <p>
          Once full payment for a booking is received, you receive the right to use the final delivered photos and
          videos for the purpose agreed in your booking (for example, your business social media, website or
          advertising). Raw or unedited files, project files and our working tools are transferred only if your written
          confirmation states so.
        </p>
        <LegalList>
          <li>Third-party material in your project (such as music, fonts, stock footage or logos you provide) remains subject to its own licences — you are responsible for having the rights to use it as agreed.</li>
          <li>We retain ownership of our equipment, templates, presets and general know-how, and no rights in them transfer to you.</li>
          <li>If your project needs different ownership or licensing terms, we will record them in your written confirmation before the shoot.</li>
        </LegalList>
        <ConfigNote label="Ownership details">
          The precise ownership and licensing wording for each service type should be confirmed by the owner with a qualified legal professional and recorded here in{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code> before it is relied on for high-value or commercial projects.
        </ConfigNote>
      </LegalSection>

      {/* 12 — Portfolio Usage Rights */}
      <LegalSection id="portfolio" number="12" title="Portfolio Usage Rights">
        <p>
          We love showing our work — but your content is yours. We will use photos or videos from your booking in our
          portfolio, Instagram, YouTube or website <strong>only with your prior written consent</strong>, unless your
          written confirmation states otherwise.
        </p>
        <LegalList>
          <li>You can give or withhold consent when we ask, and you can withdraw consent for future use at any time by writing to us.</li>
          <li>Testimonials and reviews attributed to you are used only with your consent.</li>
          <li>Withdrawing consent does not require us to delete copies already printed or published before withdrawal, but we will stop new uses.</li>
        </LegalList>
      </LegalSection>

      {/* 13 — Client Responsibilities */}
      <LegalSection id="responsibilities" number="13" title="Client Responsibilities">
        <LegalList>
          <li>Provide accurate booking details, reference links and creative briefs, and confirm they are yours to share.</li>
          <li>Ensure venue access, products, wardrobe, models and any required permissions are in place for the shoot.</li>
          <li>Review delivered drafts and give consolidated feedback within a reasonable time.</li>
          <li>Pay invoices on the schedule in your written confirmation.</li>
          <li>Use the delivered content in line with Section 11, and do not ask us to create content that infringes anyone&apos;s rights or breaks the law.</li>
        </LegalList>
      </LegalSection>

      {/* 14 — Refund Policy */}
      <LegalSection id="refund" number="14" title="Refund Policy">
        <p>
          We want the money side to be as clear as the creative side. Because this website has no online payment
          gateway, refunds are handled directly between us and you, using the same payment route you used.
        </p>
        <LegalList>
          <li><strong>Work not delivered:</strong> if we cannot deliver a paid service for reasons within our control, amounts paid for the undelivered work are refunded.</li>
          <li><strong>Work already delivered:</strong> amounts for shoots already held, editing already completed or files already delivered are not refundable, because that work has been performed.</li>
          <li><strong>Advance on cancellation:</strong> how an advance is treated when you cancel follows your written confirmation and Section 6.</li>
          <li><strong>Cancellations by us:</strong> if we cancel a confirmed shoot, you may choose a replacement date or a refund of amounts paid for work not performed.</li>
          <li><strong>Quality concerns:</strong> if something about the delivery is not right, tell us within a reasonable time and we will review it under our revision process (Section 10) before any refund is considered.</li>
          <li><strong>Monthly packages:</strong> fees for a month already in progress or already delivered are not refundable; you may cancel going forward as stated on the website.</li>
        </LegalList>
        {isConfigured(cfg.refundPolicy) ? (
          <p>{cfg.refundPolicy}</p>
        ) : (
          <ConfigNote label="Detailed refund rules">
            A detailed written refund schedule (for example percentages by days before the shoot) has not yet been
            confirmed by the owner. Until it is set in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, the principles above and your written confirmation apply. Please ask us for the refund position in writing before paying an advance.
          </ConfigNote>
        )}
        <p>
          Refund requests can be sent to <a href={`mailto:${c.email}?subject=${encodeURIComponent("Refund Request")}`}>{c.email}</a> with
          “Refund Request” in the subject line, along with your booking date and payment details.
        </p>
      </LegalSection>

      {/* 15 — Limitation of Liability */}
      <LegalSection id="liability" number="15" title="Limitation of Liability">
        <p>
          To the extent permitted by law, our total liability for any booking is limited to the amount you paid us for
          that booking. We are not liable for indirect, incidental or consequential loss (such as lost profits or lost
          followers) arising from the use of the delivered content.
        </p>
        <LegalList>
          <li>We are not responsible for delays or issues caused by weather, venue access, third-party platforms, or information or materials provided by the client.</li>
          <li>You are responsible for the safety and condition of any venue, equipment or property you provide.</li>
          <li>Nothing in these terms limits liability that cannot be limited by law.</li>
        </LegalList>
      </LegalSection>

      {/* 16 — Changes to Terms */}
      <LegalSection id="changes" number="16" title="Changes to Terms">
        <p>
          We may update these Terms &amp; Conditions from time to time. The “Last updated” date at the top of this page
          shows when they last changed. Bookings already confirmed in writing are governed by the terms in effect at
          the time of confirmation, unless we agree otherwise in writing. Continuing to use the website or book after
          an update means you accept the updated terms.
        </p>
      </LegalSection>

      {/* 17 — Contact Information */}
      <LegalSection id="contact" number="17" title="Contact Information">
        <p>For any question about these Terms &amp; Conditions, contact us:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${c.email}`} className="group rounded-2xl border border-line bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:border-neon/50 hover:bg-neon/[0.05]">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint"><Mail size={13} className="text-neon" /> Email</p>
            <p className="mt-1.5 break-all font-display text-sm font-semibold text-paper group-hover:text-neon">{c.email}</p>
          </a>
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="group rounded-2xl border border-line bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:border-neon/50 hover:bg-neon/[0.05]">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint"><Phone size={13} className="text-neon" /> Phone</p>
            <p className="mt-1.5 font-display text-sm font-semibold text-paper group-hover:text-neon">{c.phone}</p>
          </a>
          <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-line bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:border-neon/50 hover:bg-neon/[0.05]">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint"><WhatsAppIcon size={13} className="text-neon" /> WhatsApp</p>
            <p className="mt-1.5 font-display text-sm font-semibold text-paper group-hover:text-neon">Chat with us</p>
          </a>
          <div className="rounded-2xl border border-line bg-white/[0.02] px-5 py-4">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-faint"><MapPin size={13} className="text-neon" /> Studio</p>
            <p className="mt-1.5 font-display text-sm font-semibold text-paper">{c.address}</p>
          </div>
        </div>
        {isConfigured(cfg.governingLaw) || isConfigured(cfg.jurisdiction) ? (
          <p>
            These terms are governed by {cfg.governingLaw ?? "the applicable law"}{cfg.jurisdiction ? `, and disputes are subject to ${cfg.jurisdiction}` : ""}.
          </p>
        ) : (
          <ConfigNote label="Governing law &amp; jurisdiction">
            The governing law and dispute jurisdiction have not yet been confirmed. Until they are set in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, please treat this section as to be confirmed by the owner with legal advice.
          </ConfigNote>
        )}
        <p>
          See also our <Link href="/privacy-policy">Privacy Policy</Link> for how we handle your personal information.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
