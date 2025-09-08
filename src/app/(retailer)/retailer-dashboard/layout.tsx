import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { RetailerSidebar } from '@/components/layout/retailer-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <RetailerSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
