import { Suspense } from "react";
import { Metadata } from "next";

import { fetchPositions } from "@/components/positions/queries/get-positions-query";
import { PositionsPageContent } from "@/components/positions/ui/positions-page-content";
import { PositionsTableSkeleton } from "@/components/positions/ui/positions-table-skeleton";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Positions",
  description: "Manage company positions and view organizational structure.",
};

async function PositionsData({
  isAdmin,
  token,
  cookieHeader,
}: {
  isAdmin: boolean;
  token?: string;
  cookieHeader?: string;
}) {
  const positions = await fetchPositions(token, cookieHeader);

  return (
    <PositionsPageContent initialPositions={positions} isAdmin={isAdmin} />
  );
}

export default async function PositionsPage() {
  const [user, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);
  const isAdmin = user?.role === "Admin";

  return (
    <Suspense fallback={<PositionsTableSkeleton isAdmin={isAdmin} />}>
      <PositionsData isAdmin={isAdmin} token={token} cookieHeader={cookieHeader} />
    </Suspense>
  );
}
