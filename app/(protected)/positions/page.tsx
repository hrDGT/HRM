import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { fetchPositions } from "@/components/positions/queries/get-positions-query";
import { PositionsPageContent } from "@/components/positions/ui/positions-page-content";
import { PositionsTableSkeleton } from "@/components/positions/ui/positions-table-skeleton";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Positions",
  description: "Manage company positions and view organizational structure.",
};

async function PositionsData({
  isAdmin,
  token,
}: {
  isAdmin: boolean;
  token?: string;
}) {
  const positions = await fetchPositions(token);

  return (
    <PositionsPageContent initialPositions={positions} isAdmin={isAdmin} />
  );
}

export default async function PositionsPage() {
  const [user, cookieStore] = await Promise.all([requireUser(), cookies()]);
  const isAdmin = user?.role === "Admin";

  const token = cookieStore.get("access_token")?.value;

  return (
    <Suspense fallback={<PositionsTableSkeleton isAdmin={isAdmin} />}>
      <PositionsData isAdmin={isAdmin} token={token} />
    </Suspense>
  );
}
