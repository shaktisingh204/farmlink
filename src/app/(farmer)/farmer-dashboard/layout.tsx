
'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { FarmerSidebar } from '@/components/layout/farmer-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <FarmerSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
