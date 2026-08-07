import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | ComplyBuddy",
  description: "About ComplyBuddy — AI compliance scanner — automatically check websites and documents for regulatory compliance.",
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-sm leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">About ComplyBuddy</h1>

      <section className="mb-8">
        <p className="text-base leading-7">
          ComplyBuddy scans any text — ad copy, social posts, email campaigns, terms of service, privacy
          policies, NDAs — and flags the specific legal and regulatory issues in it, in plain English,
          in under a minute.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">What it checks for</h2>
        <ul className="list-disc pl-5 space-y-2 opacity-80">
          <li><strong>GDPR</strong> — Article 13 data-collection notices, third-party sharing disclosures, retention periods.</li>
          <li><strong>FTC disclosure rules</strong> — missing #ad/#sponsored tags, undisclosed material connections, unsubstantiated claims.</li>
          <li><strong>Copyright</strong> — missing attribution, likely infringing reuse of protected content.</li>
          <li><strong>ADA / accessibility language</strong> — wording that creates accessibility or discrimination risk.</li>
          <li><strong>Contract red flags</strong> — arbitration clauses, opt-out mechanisms, data-sharing terms buried in fine print.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">How the scan works</h2>
        <p>
          Paste your content, pick the content type (social post, ad, contract, policy, email), and the
          scanner runs it against each compliance category above. You get a risk score, a plain-English
          verdict, and — for every issue found — the specific law it violates and a suggested fix. No
          legal jargon, no account required for the first 10 scans a month.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Who it&apos;s for</h2>
        <p>
          Solo creators, small marketing teams, and indie founders who need a fast compliance sanity-check
          before publishing — not a substitute for legal counsel on high-stakes contracts, but a first
          pass that catches the mistakes that trigger takedowns, fines, or platform strikes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Privacy First</h2>
        <p>
          We collect only the data necessary to provide the service. We do not sell your data to third
          parties. See our{" "}
          <a href="/privacy" className="underline">Privacy Policy</a> for full details.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Advertising</h2>
        <p>
          ComplyBuddy is supported by advertising through Google AdSense. Ads help us keep the service
          free for everyone. We work to ensure ads are relevant and non-intrusive.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Get in Touch</h2>
        <p>
          We&apos;d love to hear from you — feedback, bug reports or partnership enquiries are all welcome.
          Reach us at{" "}
          <a href="mailto:info.siva@gmail.com" className="underline">info.siva@gmail.com</a> or use our{" "}
          <a href="/contact" className="underline">contact page</a>.
        </p>
      </section>

      <p className="mt-10 opacity-40 text-xs">© 2026 ComplyBuddy. All rights reserved.</p>
    </main>
  );
}
