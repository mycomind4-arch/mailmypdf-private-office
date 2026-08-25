import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Private Office" },
      { name: "description", content: "Transparent pricing for professional correspondence preparation and certified mailing." },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="eyebrow">Pricing</div>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Simple, transparent pricing</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Pay per document. No subscriptions. Choose your mail class and add preparation.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { name: "Standard", price: "$4.99", desc: "USPS Standard Mail with tracking" },
            { name: "Certified", price: "$14.94", desc: "USPS Certified Mail with tracking and proof of delivery" },
            { name: "Registered", price: "$32.49", desc: "USPS Registered Mail for high-value documents" },
          ].map((tier) => (
            <div key={tier.name} className="rounded-2xl border border-rule bg-paper-deep/30 p-6">
              <h2 className="font-serif text-xl">{tier.name}</h2>
              <p className="mt-2 text-3xl font-semibold">{tier.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Preparation fee: $24.99 per document. Includes document analysis, guided response drafting, and review.
        </p>
      </main>
      <SiteFooter />
    </>
  ),
});
