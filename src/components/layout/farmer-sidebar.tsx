
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
  User,
  List,
  Tags,
  Receipt,
  Wallet,
  Bell,
  Home,
  Database,
  Microscope,
  Route,
  UserCircle,
  Bot,
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function FarmerSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mainLinks = [
    { href: '/farmer-dashboard', label: t('farmerSidebar_overview'), icon: Home },
    { href: '/farmer-dashboard/my-produce-listings', label: t('farmerSidebar_myProduceListings'), icon: List },
    { href: '/farmer-dashboard/ai-price-advisor', label: t('farmerSidebar_aiPriceAdvisor'), icon: Microscope },
    { href: '/farmer-dashboard/market-price-suggestions', label: t('farmerSidebar_marketPriceSuggestions'), icon: Tags },
    { href: '/farmer-dashboard/agri-assist', label: t('farmerSidebar_agriAssistant'), icon: Bot },
    { href: '/farmer-dashboard/market-prices', label: t('farmerSidebar_dailyMarketPrices'), icon: Database },
    { href: '/farmer-dashboard/orders-received', label: t('farmerSidebar_ordersReceived'), icon: Receipt },
    { href: '/farmer-dashboard/payments-earnings', label: t('farmerSidebar_paymentsEarnings'), icon: Wallet },
    { href: '/farmer-dashboard/alerts', label: t('farmerSidebar_alerts'), icon: Bell },
  ];

  const isActive = (href: string) => {
    if (href === '/farmer-dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold font-headline">FarmLink</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> {t('farmerSidebar_portalName')}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainLinks.map((item) => (
             <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  variant={isActive(item.href) ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
                  tooltip={item.label}
                  isActive={isActive(item.href)}
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
              <Link href="/farmer-dashboard/profile">
                <SidebarMenuButton
                  variant={pathname === '/farmer-dashboard/profile' ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
                  tooltip={t('sidebar_profile')}
                  isActive={pathname === '/farmer-dashboard/profile'}
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
