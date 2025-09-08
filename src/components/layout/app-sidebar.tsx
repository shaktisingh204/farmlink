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
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  LayoutDashboard,
  LineChart,
  Users,
  Store,
  CircleDollarSign,
  Truck,
  Settings,
  ChevronDown,
  User,
  ShoppingBag,
  Building,
  Shield,
  List,
  Tags,
  Receipt,
  Wallet,
  Bell,
  Search,
  Heart,
  AreaChart,
  Users2,
  Activity,
  TruckIcon,
  BarChart,
  FileWarning,
  Server,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '@/lib/utils';
import React from 'react';

const dashboards = [
  {
    title: 'Farmer Dashboard',
    icon: User,
    basePath: '/farmer-dashboard',
    links: [
      { href: '/my-produce-listings', label: 'My Produce Listings', icon: List },
      { href: '/market-price-suggestions', label: 'Market Price Suggestions', icon: Tags },
      { href: '/orders-received', label: 'Orders Received', icon: Receipt },
      { href: '/payments-earnings', label: 'Payments & Earnings', icon: Wallet },
      { href: '/alerts', label: 'Alerts', icon: Bell },
    ],
  },
  {
    title: 'Retailer Dashboard',
    icon: ShoppingBag,
    basePath: '/retailer-dashboard',
    links: [
      { href: '/browse-produce', label: 'Browse Produce', icon: Search },
      { href: '/my-orders', label: 'My Orders', icon: Receipt },
      { href: '/recommended-deals', label: 'Recommended Deals', icon: Tags },
      { href: '/payments', label: 'Payments', icon: Wallet },
      { href: '/favorites', label: 'Favorites', icon: Heart },
    ],
  },
  {
    title: 'Local Market Dashboard',
    icon: Building,
    basePath: '/local-market-dashboard',
    links: [
      { href: '/market-overview', label: 'Market Overview', icon: AreaChart },
      { href: '/farmer-participation', label: 'Farmer Participation', icon: Users2 },
      { href: '/retailer-activity', label: 'Retailer Activity', icon: Activity },
      { href: '/logistics-snapshot', label: 'Logistics Snapshot', icon: TruckIcon },
      { href: '/revenue-payments', label: 'Revenue & Payments', icon: Wallet },
      { href: '/alerts', label: 'Alerts', icon: Bell },
    ],
  },
  {
    title: 'Admin Dashboard',
    icon: Shield,
    basePath: '/admin-dashboard',
    links: [
      { href: '/user-management', label: 'User Management', icon: Users },
      { href: '/transactions', label: 'Transactions', icon: BarChart },
      { href: '/analytics', label: 'Analytics', icon: AreaChart },
      { href: '/complaints', label: 'Complaints', icon: FileWarning },
      { href: '/system-health', label: 'System Health', icon: Server },
    ],
  },
];

const mainLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/market-prices', label: 'Market Prices', icon: LineChart },
  { href: '/farmers', label: 'Farmers', icon: Users },
  { href: '/markets', label: 'Markets', icon: Store },
  { href: '/price-estimator', label: 'Price Estimator', icon: CircleDollarSign },
  { href: '/distribution-optimizer', label: 'Distribution Optimizer', icon: Truck },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <span className="text-xl font-semibold font-headline">FarmLink</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainLinks.map((item) => (
             <SidebarMenuItem key={item.href}>
             <Link href={item.href} legacyBehavior passHref>
               <SidebarMenuButton
                 variant={pathname.startsWith(item.href) ? 'primary' : 'ghost'}
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
        <Separator className="my-4" />
        <SidebarMenu>
          {dashboards.map((dashboard) => {
            const isActive = pathname.startsWith(dashboard.basePath);
            return (
              <Collapsible key={dashboard.basePath} defaultOpen={isActive}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    variant={isActive ? 'primary' : 'ghost'}
                    className="w-full justify-between"
                    size="lg"
                  >
                    <div className="flex items-center gap-2">
                      <dashboard.icon className="w-5 h-5" />
                      <span>{dashboard.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        isActive && 'rotate-180'
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {dashboard.links.map((link) => (
                      <SidebarMenuSubItem key={link.href}>
                        <Link href={`${dashboard.basePath}${link.href}`} legacyBehavior passHref>
                          <SidebarMenuSubButton
                            isActive={pathname === `${dashboard.basePath}${link.href}`}
                          >
                             <link.icon className="w-4 h-4" />
                            <span>{link.label}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <div
          className={`p-4 ${
            state === 'collapsed' ? 'hidden' : 'block'
          } space-y-4`}
        >
          <Separator />
          <div className="p-4 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            <h3 className="font-bold">Upgrade to Pro</h3>
            <p className="text-sm">
              Get access to exclusive features and premium support.
            </p>
            <Button
              variant="primary"
              className="w-full mt-2"
              size="sm"
            >
              Upgrade
            </Button>
          </div>
        </div>
        <Separator className={`${state === 'collapsed' ? 'hidden' : 'block'}`} />
        <SidebarMenu>
           <SidebarMenuItem>
            <Link href="/settings" legacyBehavior passHref>
              <SidebarMenuButton
                  variant={pathname === '/settings' ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
                >
                <Settings className="w-5 h-5"/>
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
