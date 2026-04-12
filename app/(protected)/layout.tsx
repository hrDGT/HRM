import { PropsWithChildren } from "react";

import { UserProvider } from "@/components/providers/user-provider";
import { requireUser } from "@/lib/auth/require-user";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const currentUser = await requireUser();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col px-4 pt-6">
        <UserProvider user={currentUser}>{children}</UserProvider>
      </main>
    </div>
  );
}
