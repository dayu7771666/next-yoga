import Link from "next/link";

export default function Footer() {

  return (
    <footer className="bg-zinc-900 text-zinc-400">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">YogaCustom</h3>
            <p className="text-sm leading-relaxed">
              One-stop yoga customization service for designers and brands.
              Low MOQ, fast turnaround, premium quality.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/products" className="hover:text-white transition-colors">Products</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <div className="text-sm leading-relaxed">
              <p>Email: info@yogacustom.com</p>
              <p>WhatsApp: +86-123-4567-8900</p>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-xs">
          &copy; 2026 YogaCustom. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
