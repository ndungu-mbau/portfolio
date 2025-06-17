"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Sidebar } from "~/components/sidebar";
import { BottomNav } from "~/components/bottom-nav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const isMediumScreen = useMediaQuery({
    minWidth: 768,
    maxWidth: 1023,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder while waiting for client-side hydration
  if (!mounted) return <div className="h-screen w-screen" />;

  return (
    <div className="flex h-screen bg-neutral-950">
      {(isLargeScreen || isMediumScreen) && (
        <Sidebar collapsed={isMediumScreen} />
      )}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
      {!isLargeScreen && !isMediumScreen && <BottomNav />}
    </div>
  );
}
