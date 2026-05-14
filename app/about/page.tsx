import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Your Trusted Yoga Customization Partner",
  description:
    "Learn about our supply chain advantages, quality commitment, and how we help brands bring their yoga product visions to life.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">About YogaCustom</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900">Our Story</h2>
        <p className="mt-4 text-zinc-600 leading-relaxed">
          YogaCustom was founded to bridge the gap between designer vision and
          physical product. We partner with premium manufacturers across Asia
          specializing in yoga apparel and accessory production, giving designers
          and brands direct access to industrial-grade supply chains.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">Our Advantage</h2>
        <div className="mt-6 space-y-6">
          {[
            {
              title: "Supply Chain Expertise",
              description:
                "Years of partnership with specialized yoga wear factories means we know exactly who can deliver quality at the right price point.",
            },
            {
              title: "One-Piece Sample Service",
              description:
                "Unlike traditional manufacturers demanding bulk orders, we support single-piece sampling so you can validate designs before committing.",
            },
            {
              title: "End-to-End Customization",
              description:
                "From fabric selection to logo embroidery, custom hang tags to packaging design — we handle every detail of your brand presentation.",
            },
            {
              title: "Quality Control",
              description:
                "Every order goes through multi-point inspection. We stand behind the quality of every piece we ship.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 bg-zinc-50 rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-zinc-900">Ready to Start?</h2>
        <p className="mt-2 text-zinc-600">
          Get in touch and we&apos;ll help you bring your yoga brand to life.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center px-6 py-2.5 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
