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
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/market-prices', label: 'Market Prices', icon: LineChart },
  { href: '/farmers', label: 'Farmers', icon: Users },
  { href: '/markets', label: 'Markets', icon: Store },
  { href: '/price-estimator', label: 'Price Estimator', icon: CircleDollarSign },
  { href: '/distribution-optimizer', label: 'Distribution Optimizer', icon: Truck },
];

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
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  variant={pathname.startsWith(item.href) ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
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
