import { getCurrentUser } from "@/app/all-api/get-current-user";
import { getDashboardPath, isAdmin } from "@/lib/roles";
import { redirect } from "next/navigation";

/**
 * Authoritative admin guard.
 *
 * The proxy only performs an optimistic cookie check; role authorization must
 * happen on the server where the session can be validated.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isAdmin(user)) {
    redirect(getDashboardPath(user));
  }

  return <>{children}</>;
}
