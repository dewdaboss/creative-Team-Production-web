import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import LegalPage, { ConfigNote, LegalList, LegalSection, type LegalTocItem } from "@/components/LegalPage";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { isConfigured, legalConfig } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Creative Team Production collects, uses, stores and protects personal information when you use this website or book a shoot — including booking-form data, photos and videos, cookies and third-party services.",
  alternates: { canonical: `${legalConfig.siteUrl}/privacy-policy` },
  openGraph: {
    title: `Privacy Policy · ${legalConfig.contact.name}`,
    description: "How we handle your personal information on this website and in bookings.",
    type: "article",
  },
};

const TOC: LegalTocItem[] = [
  { id: "introduction", number: "01", title: "Introduction" },
  { id: "information-we-collect", number: "02", title: "Information We Collect" },
  { id: "personal-information", number: "03", title: "Personal Information" },
  { id: "photos-videos", number: "04", title: "Photos and Videos Uploaded by Clients" },
  { id: "how-we-use", number: "05", title: "How We Use Your Information" },
  { id: "storage-security", number: "06", title: "Data Storage and Security" },
  { id: "third-party", number: "07", title: "Third-Party Services" },
  { id: "cookies-analytics", number: "08", title: "Cookies and Website Analytics" },
  { id: "retention-deletion", number: "09", title: "Data Retention and Deletion" },
  { id: "contact", number: "10", title: "Contact Information" },
];

export default function PrivacyPolicyPage() {
  const c = legalConfig.contact;
  const cfg = legalConfig.configurable;

  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title={
        <>
          Privacy <span className="text-gradient-brand text-glow">Policy</span>
        </>
      }
      intro={`This Privacy Policy explains what information ${c.name} ("we", "us", "our") collects when you visit this website, submit a booking enquiry, or contact us on WhatsApp, email or phone — and how we use, store and protect it. It is written to match how this website actually works today.`}
      toc={TOC}
      related={{
        href: "/terms-and-conditions",
        label: "Terms & Conditions",
        description: "Booking, payment, delivery and usage terms for our services.",
      }}
    >
      {/* 01 — Introduction */}
      <LegalSection id="introduction" number="01" title="Introduction">
        <p>
          <strong>{c.name}</strong> is a creative production agency based at <strong>{c.address}</strong>. This website
          lets visitors learn about our photography, videography, reels, editing and digital-marketing services, view
          our portfolio, and submit a booking enquiry through the online form or by messaging us on WhatsApp.
        </p>
        <p>
          By using this website or submitting the booking form, you acknowledge that you have read this Privacy Policy.
          If you do not agree with how we handle information as described here, please do not submit the form — you can
          still reach us directly using the contact details in{" "}
          <a href="#section-contact">Section 10</a>.
        </p>
        <p>
          We may update this policy from time to time. The “Last updated” date at the top of this page shows when it
          last changed. Material changes will be reflected here; your continued use of the website after an update
          means you accept the updated policy.
        </p>
      </LegalSection>

      {/* 02 — Information We Collect */}
      <LegalSection id="information-we-collect" number="02" title="Information We Collect">
        <p>We collect only the information needed to run this website, respond to enquiries and deliver bookings:</p>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-left text-[13px] leading-relaxed">
            <thead>
              <tr className="border-b border-line bg-white/[0.03]">
                <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-paper">What</th>
                <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-paper">Examples</th>
                <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-paper">How we get it</th>
              </tr>
            </thead>
            <tbody className="[&_td]:border-t [&_td]:border-line/60 [&_td]:px-4 [&_td]:py-3 [&_tr:first-child_td]:border-t-0">
              <tr>
                <td className="font-semibold text-paper">Booking enquiry details</td>
                <td>Name, phone, email (optional), service &amp; package chosen, quantity, shoot location, preferred date/time, reference link, notes</td>
                <td>You enter them in the booking form</td>
              </tr>
              <tr>
                <td className="font-semibold text-paper">Direct messages</td>
                <td>Anything you share on WhatsApp, email or phone calls</td>
                <td>You message or call us</td>
              </tr>
              <tr>
                <td className="font-semibold text-paper">Technical data</td>
                <td>IP address (for spam protection &amp; visitor counting), browser/device basics from server &amp; hosting logs</td>
                <td>Automatically when you visit or submit a form</td>
              </tr>
              <tr>
                <td className="font-semibold text-paper">Booking draft</td>
                <td>Partial form entries saved in your own browser</td>
                <td>Automatically as you type (see Section 8)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>What we do not collect on this website:</strong> there are no public user accounts, no online checkout
          and no card-payment fields on this site, so we do not collect payment-card data here. There is also no
          newsletter signup and no advertising tracking pixel on this website at present.
        </p>
      </LegalSection>

      {/* 03 — Personal Information */}
      <LegalSection id="personal-information" number="03" title="Personal Information">
        <p>When you submit the booking form, we ask for the following personal information:</p>
        <LegalList>
          <li><strong>Name and phone number</strong> — required, so we can call or message you about your booking.</li>
          <li><strong>Email address</strong> — optional, used only if you provide it and only to reply or send booking details.</li>
          <li><strong>Shoot location / address</strong> — required, so we can plan travel and the shoot.</li>
          <li><strong>Preferred date and time slot</strong> — optional, to check availability.</li>
          <li><strong>Reference link (optional)</strong> — a URL to inspiration or prior work you want us to see.</li>
          <li><strong>Notes</strong> — anything else you want us to know about the shoot.</li>
        </LegalList>
        <p>
          The form also contains a hidden field used only to detect automated spam submissions. It is not personal
          information and is not shown to visitors.
        </p>
        <p>
          Please share only information you are comfortable sharing. Do not include sensitive information such as
          passwords, bank details or government ID numbers in the form, notes, or WhatsApp messages unless we
          specifically ask for it for a confirmed booking.
        </p>
      </LegalSection>

      {/* 04 — Photos and Videos Uploaded by Clients */}
      <LegalSection id="photos-videos" number="04" title="Photos and Videos Uploaded by Clients">
        <p>
          The booking form <strong>does not accept file uploads</strong>. If you want us to see photos, videos or
          references, please share a link (for example, a Drive, Instagram or YouTube link) in the reference-link
          field or on WhatsApp. That link is stored together with your booking enquiry so our team can review it.
        </p>
        <LegalList>
          <li>Only share links and content you own or have the right to share with us for the purpose of your booking.</li>
          <li>Do not share illegal, harmful or third-party content without permission. We may decline to review or use material that does not meet this standard.</li>
          <li>Links you share are used only to plan and deliver your booking. We do not publish your reference material publicly.</li>
          <li>Photos and videos we create for you are handled under our <Link href="/terms-and-conditions#section-copyright">Terms &amp; Conditions</Link> — including who owns the final files and how they may be used.</li>
          <li>The portfolio gallery on this website is managed by our team. Client work appears there only as described in the Terms &amp; Conditions (Section 11).</li>
        </LegalList>
      </LegalSection>

      {/* 05 — How We Use Your Information */}
      <LegalSection id="how-we-use" number="05" title="How We Use Your Information">
        <p>We use the information above only for the following purposes:</p>
        <LegalList>
          <li>To respond to your enquiry, prepare an estimate or custom quote, and confirm your booking.</li>
          <li>To schedule, plan and deliver the shoot, editing and related services you book.</li>
          <li>To contact you about your booking by phone, WhatsApp or email.</li>
          <li>To keep the website secure — for example, rate-limiting form submissions to prevent spam and abuse.</li>
          <li>To understand basic website usage (aggregate visitor counts) and improve the site.</li>
          <li>To meet legal, tax or accounting obligations where they apply.</li>
        </LegalList>
        <p>
          <strong>We do not sell your personal information.</strong> We do not send marketing emails or WhatsApp
          broadcasts to people who have only visited the website. If you contact us on WhatsApp, we reply in that
          conversation about your enquiry — we do not add you to a marketing list without your clear agreement.
        </p>
      </LegalSection>

      {/* 06 — Data Storage and Security */}
      <LegalSection id="storage-security" number="06" title="Data Storage and Security">
        <p>Booking enquiries are stored so our team can follow up and keep a record of bookings. Depending on how the website is deployed, enquiry data may be held in:</p>
        <LegalList>
          <li>The website&apos;s server-side store (local files on a dedicated server, or a managed database service on serverless hosting when configured).</li>
          <li>A Google Sheet and the owner&apos;s email inbox, if the lead-automation webhook is configured.</li>
          <li>Our WhatsApp chat history, if you contact us there.</li>
        </LegalList>
        <p>We take reasonable steps to protect the information we hold, including:</p>
        <LegalList>
          <li>Serving the website over HTTPS on our hosting provider.</li>
          <li>Validating all form submissions on the server before they are stored.</li>
          <li>Rate-limiting form and login attempts to reduce spam and brute-force abuse.</li>
          <li>Keeping the owner-only admin session in an HttpOnly cookie that visitors cannot read from scripts.</li>
        </LegalList>
        <p>
          No method of transmission or storage is completely secure, and email and WhatsApp are governed by their own
          providers&apos; security practices. Please do not send highly sensitive information through the website form.
        </p>
        {isConfigured(cfg.dataRetentionPeriod) ? (
          <p>Booking enquiry data is kept for <strong>{cfg.dataRetentionPeriod}</strong> and then deleted or anonymised, subject to any legal or accounting retention duties.</p>
        ) : (
          <ConfigNote label="Retention period">
            A fixed retention period for booking enquiries has not yet been confirmed by the owner. Until it is set in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, enquiries are kept while they are needed for follow-up, records and legal duties. You can ask us to delete your enquiry at any time using Section 10.
          </ConfigNote>
        )}
      </LegalSection>

      {/* 07 — Third-Party Services */}
      <LegalSection id="third-party" number="07" title="Third-Party Services">
        <p>
          This website links to or embeds a small number of third-party services. When you use those services, they
          process information under their own privacy policies — we do not control them.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-left text-[13px] leading-relaxed">
            <thead>
              <tr className="border-b border-line bg-white/[0.03]">
                <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-paper">Service</th>
                <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-paper">Why it is used</th>
              </tr>
            </thead>
            <tbody className="[&_td]:border-t [&_td]:border-line/60 [&_td]:px-4 [&_td]:py-3 [&_tr:first-child_td]:border-t-0">
              <tr><td className="font-semibold text-paper">Website hosting (Vercel)</td><td>Serves the website and processes basic technical logs.</td></tr>
              <tr><td className="font-semibold text-paper">Managed database (Upstash Redis, if configured)</td><td>Stores enquiries and site data on serverless hosting.</td></tr>
              <tr><td className="font-semibold text-paper">Google Apps Script → Google Sheets &amp; email (if configured)</td><td>Sends new booking enquiries to the owner&apos;s sheet and inbox.</td></tr>
              <tr><td className="font-semibold text-paper">WhatsApp (wa.me links)</td><td>Lets you message us directly. WhatsApp processes the conversation under Meta&apos;s policies.</td></tr>
              <tr><td className="font-semibold text-paper">Instagram embeds &amp; profile links</td><td>Shows Instagram reels in the portfolio lightbox and links to our profile.</td></tr>
              <tr><td className="font-semibold text-paper">YouTube, Facebook &amp; Google Maps links</td><td>Outbound links to our channels and location. Opening them leaves this website.</td></tr>
              <tr><td className="font-semibold text-paper">Cloudinary (if configured)</td><td>Hosts images uploaded by our team for the gallery.</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          At present this website does <strong>not</strong> run third-party advertising or product-analytics trackers.
          If that changes, this section will be updated before the new service is added.
        </p>
      </LegalSection>

      {/* 08 — Cookies and Website Analytics */}
      <LegalSection id="cookies-analytics" number="08" title="Cookies and Website Analytics">
        <p>This website uses very limited storage — no advertising cookies and no cross-site tracking:</p>
        <LegalList>
          <li><strong>Owner admin session cookie</strong> — set only when our team signs in to the private <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">/admin</code> dashboard. It is HttpOnly, lasts 12 hours, and visitors never receive it.</li>
          <li><strong>Booking draft (browser storage)</strong> — as you fill the booking form, partial entries are saved in your own browser so you do not lose them if the page reloads. The draft is cleared when you submit or reset the form, and you can also clear it via your browser settings. It never leaves your device until you submit.</li>
          <li><strong>Visitor counter</strong> — the site keeps an aggregate count of visits (total and per day). An IP address is counted at most once every 30 minutes to avoid inflating the count. We do not build individual visitor profiles from this.</li>
        </LegalList>
        <p>
          Instagram embeds in the portfolio may set their own cookies when you play or interact with a reel. You can
          control cookies through your browser settings; blocking cookies may affect the admin login and the booking
          draft, but browsing the website will still work.
        </p>
      </LegalSection>

      {/* 09 — Data Retention and Deletion */}
      <LegalSection id="retention-deletion" number="09" title="Data Retention and Deletion">
        <p>
          We keep booking enquiries for as long as they are needed to follow up, deliver the service, keep business
          records and meet legal duties. The website&apos;s enquiry store keeps only the most recent 1,000 enquiries;
          older entries roll off automatically.
        </p>
        <p>You can ask us at any time to:</p>
        <LegalList>
          <li>Show you the personal information we hold about you from a booking enquiry.</li>
          <li>Correct information that is inaccurate.</li>
          <li>Delete your booking enquiry, subject to any records we must keep by law.</li>
        </LegalList>
        <p>
          To make a request, email <a href={`mailto:${c.email}?subject=${encodeURIComponent("Privacy Request")}`}>{c.email}</a> or
          message us on WhatsApp with the subject “Privacy Request”, along with the name and phone number used in your
          enquiry so we can locate it. We will verify your identity, respond within a reasonable time, and confirm once
          the request is complete. Deleting the booking draft from your own browser is covered in Section 8.
        </p>
        {isConfigured(cfg.grievanceContact) ? (
          <p>For privacy concerns, contact: <strong>{cfg.grievanceContact}</strong>.</p>
        ) : (
          <ConfigNote label="Grievance contact">
            A named grievance or privacy contact has not yet been published. Until one is confirmed in{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neon-soft">lib/legal.ts</code>, please use the email address in Section 10 for privacy requests.
          </ConfigNote>
        )}
      </LegalSection>

      {/* 10 — Contact Information */}
      <LegalSection id="contact" number="10" title="Contact Information">
        <p>For any question about this Privacy Policy or a privacy request, contact us:</p>
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
        <p>
          Please include “Privacy Request” in your subject line so we can route your message correctly. See also our{" "}
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link> for booking, payment and delivery terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
