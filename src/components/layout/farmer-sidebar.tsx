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
} from 'lucide-react';

const mainLinks = [
  { href: '/farmer-dashboard', label: 'Overview', icon: Home },
  { href: '/farmer-dashboard/my-produce-listings', label: 'My Produce Listings', icon: List },
  { href: '/farmer-dashboard/ai-price-advisor', label: 'AI Price Advisor', icon: Microscope },
  { href: '/farmer-dashboard/market-price-suggestions', label: 'Market Price Suggestions', icon: Tags },
  { href: '/farmer-dashboard/market-prices', label: 'Daily Market Prices', icon: Database },
  { href: '/farmer-dashboard/orders-received', label: 'Orders Received', icon: Receipt },
  { href: '/farmer-dashboard/payments-earnings', label: 'Payments & Earnings', icon: Wallet },
  { href: '/farmer-dashboard/alerts', label: 'Alerts', icon: Bell },
]

export function FarmerSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold font-headline">FarmLink</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Farmer Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainLinks.map((item) => (
             <SidebarMenuItem key={item.href}>
             <Link href={item.href} legacyBehavior passHref>
               <SidebarMenuButton
                 variant={pathname.startsWith(item.href) && item.href !== '/farmer-dashboard' || pathname === item.href ? 'primary' : 'ghost'}
                 className="w-full justify-start"
                 size="lg"
                 tooltip={item.label}
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
            <Link href="/settings" legacyBehavior passHref>
              <SidebarMenuButton
                  variant={pathname === '/settings' ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
                  tooltip='Settings'
                >
                <Settings className="w-5 h-5"/>
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
           </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/" legacyBehavior passHref>
                <SidebarMenuButton
                  variant='outline'
                  className="w-full justify-start"
                  size="lg"
                  tooltip='Back to Portal Selection'
                >
                  <span>Back to Portal Selection</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
