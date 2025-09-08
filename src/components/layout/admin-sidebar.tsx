
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  Settings,
  Users,
  BarChart,
  AreaChart,
  FileWarning,
  Server,
  Shield,
  Home,
  UserCircle,
  Mail,
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mainLinks = [
    { href: '/admin-dashboard', label: t('sidebar.admin.overview'), icon: Home },
    { href: '/admin-dashboard/user-management', label: t('sidebar.admin.userManagement'), icon: Users },
    { href: '/admin-dashboard/transactions', label: t('sidebar.admin.transactions'), icon: BarChart },
    { href: '/admin-dashboard/analytics', label: t('sidebar.admin.analytics'), icon: AreaChart },
    { href: '/admin-dashboard/complaints', label: t('sidebar.admin.complaints'), icon: FileWarning },
    { href: '/admin-dashboard/contact-messages', label: t('sidebar.admin.contactMessages'), icon: Mail },
    { href: '/admin-dashboard/system-health', label: t('sidebar.admin.systemHealth'), icon: Server },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold font-headline">FarmLink</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="w-3 h-3" /> {t('portals.admin.title')}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainLinks.map((item) => (
             <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  variant={pathname === item.href ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
                  tooltip={item.label}
                  isActive={pathname === item.href}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
           </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
           <SidebarMenuItem>
             <Link href="/admin-dashboard/profile">
                <SidebarMenuButton
                    variant={pathname === '/admin-dashboard/profile' ? 'primary' : 'ghost'}
                    className="w-full justify-start"
                    size="lg"
                    tooltip={t('sidebar.common.profile')}
                    isActive={pathname === '/admin-dashboard/profile'}
                  >
                  <UserCircle className="w-5 h-5"/>
                  <span>{t('sidebar.common.profile')}</span>
                </SidebarMenuButton>
              </Link>
           </SidebarMenuItem>
           <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton
                  asChild
                  variant='outline'
                  className="w-full justify-start"
                  size="lg"
                  tooltip={t('sidebar.common.backToPortals')}
                >
                  <span>{t('sidebar.common.backToPortals')}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
