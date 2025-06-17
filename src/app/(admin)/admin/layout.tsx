import React from "react";
import { DashboardLayout } from "~/components/dashboard-layout";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
