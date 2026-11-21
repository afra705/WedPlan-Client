import { getCurrentUser } from "@/app/all-api/get-current-user";
import { getDashboardPath, isCustomer } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isCustomer(user)) {
    redirect(getDashboardPath(user));
  }

  return <>{children}</>;
}
