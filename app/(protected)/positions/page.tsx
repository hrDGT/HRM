import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { fetchPositions } from "@/components/positions/queries/get-positions-query";
import { PositionsClient } from "@/components/positions/ui/positions-client";
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

  return <PositionsClient initialPositions={positions} isAdmin={isAdmin} />;
}

export default async function PositionsPage() {
  const user = await requireUser();
  const isAdmin = user?.role === "Admin";

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return (
    <Suspense fallback={<PositionsTableSkeleton isAdmin={isAdmin} />}>
      <PositionsData isAdmin={isAdmin} token={token} />
    </Suspense>
  );
}
