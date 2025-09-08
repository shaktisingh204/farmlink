
import { AppHeader } from '@/components/layout/app-header';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
