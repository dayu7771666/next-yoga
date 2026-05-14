import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact Us — Start Your Custom Yoga Project",
  description:
    "Ready to bring your yoga brand to life? Contact us for a free consultation and quote.",
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 text-center">Contact Us</h1>
        <p className="mt-2 text-zinc-600 text-center">
          Tell us about your project and we&apos;ll get back to you within 24 hours.
        </p>

        <div className="mt-8">
          <InquiryForm />
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="p-4 bg-zinc-50 rounded-xl">
            <h3 className="font-medium text-zinc-900">Email</h3>
            <p className="mt-1 text-sm text-zinc-600">info@yogacustom.com</p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-xl">
            <h3 className="font-medium text-zinc-900">WhatsApp</h3>
            <p className="mt-1 text-sm text-zinc-600">+86-123-4567-8900</p>
          </div>
        </div>
      </div>
    </div>
  );
}
