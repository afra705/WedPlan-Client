import { getCurrentUser } from "@/app/all-api/get-current-user";
import { getDashboardPath, isVendor } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isVendor(user)) {
    redirect(getDashboardPath(user));
  }

  return <>{children}</>;
}
