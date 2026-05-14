import { Suspense } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<aside className="w-56 bg-zinc-900 min-h-screen" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 bg-zinc-50">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-end px-6">
          <AdminLogoutButton />
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
