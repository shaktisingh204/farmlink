
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
  Building,
  AreaChart,
  Users2,
  Activity,
  TruckIcon,
  Wallet,
  Bell,
  Home,
  UserCircle,
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function MarketSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mainLinks = [
    { href: '/local-market-dashboard', label: t('marketSidebar_overview'), icon: Home },
    { href: '/local-market-dashboard/market-overview', label: t('marketSidebar_marketOverview'), icon: AreaChart },
    { href: '/local-market-dashboard/farmer-participation', label: t('marketSidebar_farmerParticipation'), icon: Users2 },
    { href: '/local-market-dashboard/retailer-activity', label: t('marketSidebar_retailerActivity'), icon: Activity },
    { href: '/local-market-dashboard/logistics-snapshot', label: t('marketSidebar_logisticsSnapshot'), icon: TruckIcon },
    { href: '/local-market-dashboard/revenue-payments', label: t('marketSidebar_revenuePayments'), icon: Wallet },
    { href: '/local-market-dashboard/alerts', label: t('marketSidebar_alerts'), icon: Bell },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold font-headline">FarmLink</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Building className="w-3 h-3" /> {t('marketSidebar_portalName')}</span>
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
            <Link href="/local-market-dashboard/profile">
              <SidebarMenuButton
                  variant={pathname === '/local-market-dashboard/profile' ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
                  tooltip={t('sidebar_profile')}
                  isActive={pathname === '/local-market-dashboard/profile'}
                >
                <UserCircle className="w-5 h-5"/>
                <span>{t('sidebar_profile')}</span>
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
                  tooltip={t('sidebar_backToPortals')}
                >
                  <span>{t('sidebar_backToPortals')}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
