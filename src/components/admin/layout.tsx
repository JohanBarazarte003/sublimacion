import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { exigirAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await exigirAdmin();
  return <AdminShell email={email}>{children}</AdminShell>;
}