
'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MarketSidebar } from '@/components/layout/market-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MarketSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
