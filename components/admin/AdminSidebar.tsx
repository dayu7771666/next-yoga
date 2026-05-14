"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "■" },
  { href: "/admin/products", label: "Products", icon: "□" },
  { href: "/admin/blog", label: "Blog Posts", icon: "≡" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "◎" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-zinc-900 text-zinc-400 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-zinc-800">
        <Link href="/admin" className="text-white font-bold">
          YogaCustom Admin
        </Link>
      </div>
      <nav className="flex-1 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-zinc-800">
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← View Site
        </Link>
      </div>
    </aside>
  );
}
