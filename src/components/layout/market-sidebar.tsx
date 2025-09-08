
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

const mainLinks = [
  { href: '/local-market-dashboard', label: 'Overview', icon: Home },
  { href: '/local-market-dashboard/market-overview', label: 'Market Overview', icon: AreaChart },
  { href: '/local-market-dashboard/farmer-participation', label: 'Farmer Participation', icon: Users2 },
  { href: '/local-market-dashboard/retailer-activity', label: 'Retailer Activity', icon: Activity },
  { href: '/local-market-dashboard/logistics-snapshot', label: 'Logistics Snapshot', icon: TruckIcon },
  { href: '/local-market-dashboard/revenue-payments', label: 'Revenue & Payments', icon: Wallet },
  { href: '/local-market-dashboard/alerts', label: 'Alerts', icon: Bell },
]

export function MarketSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold font-headline">FarmLink</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Building className="w-3 h-3" /> Market Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainLinks.map((item) => (
             <SidebarMenuItem key={item.href}>
             <SidebarMenuButton
               asChild
               variant={pathname === item.href ? 'primary' : 'ghost'}
               className="w-full justify-start"
               size="lg"
               tooltip={item.label}
             >
              <Link href={item.href}>
               <item.icon className="w-5 h-5" />
               <span>{item.label}</span>
              </Link>
             </SidebarMenuButton>
           </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                variant={pathname === '/local-market-dashboard/profile' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                size="lg"
                tooltip='Profile'
              >
              <Link href="/local-market-dashboard/profile">
                <UserCircle className="w-5 h-5"/>
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
           </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant='outline'
                className="w-full justify-start"
                size="lg"
                tooltip='Back to Portal Selection'
              >
                <Link href="/">
                <span>Back to Portal Selection</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
