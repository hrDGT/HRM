import { PropsWithChildren, Suspense } from "react";

import { UserProvider } from "@/components/providers/user-provider";
import { DashboardLoader } from "@/components/ui/loader";
import { requireUser } from "@/lib/auth/require-user";

async function ProtectedDataProvider({ children }: PropsWithChildren) {
  const currentUser = await requireUser();

  return <UserProvider user={currentUser}>{children}</UserProvider>;
}

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col px-4">
        <Suspense fallback={<DashboardLoader />}>
          <ProtectedDataProvider>{children}</ProtectedDataProvider>
        </Suspense>
      </main>
    </div>
  );
}
