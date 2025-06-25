import React from "react";
import { auth, signIn } from "~/server/auth";
import { DashboardLayout } from "~/components/dashboard-layout";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return signIn();
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
