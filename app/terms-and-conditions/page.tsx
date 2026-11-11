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
  { id: "services", number: "02", title: "Our Services" },
  { id: "booking", number: "03", title: "Booking and Confirmation" },
  { id: "payment", number: "04", title: "Payment Terms" },
  { id: "cancellation", number: "05", title: "Cancellation and Rescheduling" },
  { id: "shoot-terms", number: "06", title: "Photoshoot and Videography Terms" },
  { id: "delivery", number: "07", title: "Photo and Video Delivery" },
  { id: "editing", number: "08", title: "Editing and Revisions" },
  { id: "responsibilities", number: "09", title: "Client Responsibilities" },
  { id: "copyright", number: "10", title: "Copyright and Usage Rights" },
  { id: "portfolio", number: "11", title: "Portfolio and Social Media Usage" },
  { id: "liability", number: "12", title: "Limitation of Liability" },
  { id: "changes", number: "13", title: "Changes to Terms" },
  { id: "contact", number: "14", title: "Contact Information" },
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
      <LegalSection id="services" number="02" title="Our Services">
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
          the package you select and confirmed in writing before the shoot (see Section 3).
        </p>
      </LegalSection>

      {/* 03 — Booking and Confirmation */}
      <LegalSection id="booking" number="03" title="Booking and Confirmation">
        <p>
          Submitting the online booking form (or messaging us on WhatsApp) sends us an <strong>enquiry with an
          estimate</strong> — it does not by itself confirm a booking. A booking is confirmed only when we agree the
          service, package, date, location and price with you in writing (for example, by WhatsApp, email or a quote
          message) and any advance required by that confirmation has been received.
        </p>
        <LegalList>
          <li>To book, share your name, phone number, shoot location, preferred date and the service/package you want. We may ask for additional details before confirming.</li>
          <li>For packages marked “custom quote” or “inquiry”, the price is agreed after we understand your requirements — the website does not charge you automatically.</li>
          <li>Travel within 10 km of our studio is included. Travel charges apply beyond 10 km, as confirmed in your quote.</li>
          <li>Dates and slots are held only after written confirmation. If we cannot accommodate your preferred date, we will suggest alternatives.</li>
        </LegalList>
      </LegalSection>

      {/* 04 — Payment Terms */}
      <LegalSection id="payment" number="04" title="Payment Terms">
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

      {/* 05 — Cancellation and Rescheduling */}
      <LegalSection id="cancellation" number="05" title="Cancellation and Rescheduling">
        <p>
          Life happens — if you need to cancel or move a confirmed booking, contact us as early as possible by phone,
          WhatsApp or email so we can try to reschedule. How any advance is treated on cancellation or rescheduling is
          as stated in your written confirmation.
        </p>
        <LegalList>
          <li><strong>Rescheduling:</strong> we will do our best to move your shoot to a new date that works for both sides, subject to crew and studio availability.</li>
          <li><strong>Cancellation:</strong> if a booking is cancelled, any advance treatment follows your written confirmation. If your confirmation does not state a rule, we will discuss the situation with you in good faith.</li>
          <li><strong>Monthly packages:</strong> monthly growth retainers can be cancelled anytime after the first month, as stated on the website.</li>
          <li><strong>Weather, venue or force majeure:</strong> if a shoot cannot go ahead due to weather, venue access or other events beyond reasonable control, we will work with you to reschedule.</li>
          <li><strong>No-show:</strong> if the client or venue is unavailable at the agreed time without prior notice, the shoot may be treated as cancelled under your confirmation.</li>
        </LegalList>
        {isConfigured(cfg.cancellationNoticePeriod) ? (
          <p>Please notify us at least <strong>{cfg.cancellationNoticePeriod}</strong> before the shoot to reschedule without penalty.</p>
        ) : (
          <ConfigNote label="Notice period">
            A standard notice period for free rescheduling has not yet been published. Until it is set in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, please contact us as early as possible — the earlier you tell us, the more options we can offer.
          </ConfigNote>
        )}
      </LegalSection>

      {/* 06 — Photoshoot and Videography Terms */}
      <LegalSection id="shoot-terms" number="06" title="Photoshoot and Videography Terms">
        <LegalList>
          <li>Please ensure the venue, location access, products, outfits, models or talent agreed for the shoot are ready at the scheduled time.</li>
          <li>You are responsible for obtaining any permissions needed for the location, people and property featured in the shoot, including consent from parents or guardians for minors.</li>
          <li>We may adjust the schedule, angles or setup on the day to achieve the best quality, and we will keep you informed of any significant change.</li>
          <li>Please follow reasonable safety instructions on set. We may pause or stop a shoot if conditions are unsafe.</li>
          <li>Raw or unedited files are included only if your package or written confirmation states so. Otherwise, delivery is of edited, finished files as described in Section 7.</li>
        </LegalList>
      </LegalSection>

      {/* 07 — Photo and Video Delivery */}
      <LegalSection id="delivery" number="07" title="Photo and Video Delivery">
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

      {/* 08 — Editing and Revisions */}
      <LegalSection id="editing" number="08" title="Editing and Revisions">
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

      {/* 09 — Client Responsibilities */}
      <LegalSection id="responsibilities" number="09" title="Client Responsibilities">
        <LegalList>
          <li>Provide accurate booking details, reference links and creative briefs, and confirm they are yours to share.</li>
          <li>Ensure venue access, products, wardrobe, models and any required permissions are in place for the shoot.</li>
          <li>Review delivered drafts and give consolidated feedback within a reasonable time.</li>
          <li>Pay invoices on the schedule in your written confirmation.</li>
          <li>Use the delivered content in line with Section 10, and do not ask us to create content that infringes anyone&apos;s rights or breaks the law.</li>
        </LegalList>
      </LegalSection>

      {/* 10 — Copyright and Usage Rights */}
      <LegalSection id="copyright" number="10" title="Copyright and Usage Rights">
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

      {/* 11 — Portfolio and Social Media Usage */}
      <LegalSection id="portfolio" number="11" title="Portfolio and Social Media Usage">
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

      {/* 12 — Limitation of Liability */}
      <LegalSection id="liability" number="12" title="Limitation of Liability">
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

      {/* 13 — Changes to Terms */}
      <LegalSection id="changes" number="13" title="Changes to Terms">
        <p>
          We may update these Terms &amp; Conditions from time to time. The “Last updated” date at the top of this page
          shows when they last changed. Bookings already confirmed in writing are governed by the terms in effect at
          the time of confirmation, unless we agree otherwise in writing. Continuing to use the website or book after
          an update means you accept the updated terms.
        </p>
      </LegalSection>

      {/* 14 — Contact Information */}
      <LegalSection id="contact" number="14" title="Contact Information">
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
