
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
  Globe,
  Users,
  Building,
  BarChart,
  CircleDollarSign,
  Route,
} from 'lucide-react';

const mainLinks = [
    { href: '/farmers', label: 'Farmers', icon: Users },
    { href: '/markets', label: 'Markets', icon: Building },
    { href: '/market-prices', label: 'Price Tracking', icon: BarChart },
    { href: '/price-estimator', label: 'Price Estimator', icon: CircleDollarSign },
    { href: '/distribution-optimizer', label: 'Distribution Optimizer', icon: Route },
]

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold font-headline">FarmLink</span>
             <span className="text-xs text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> Main Site</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainLinks.map((item) => (
             <SidebarMenuItem key={item.href}>
             <SidebarMenuButton
               asChild
               variant={pathname.startsWith(item.href) ? 'primary' : 'ghost'}
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
                variant={pathname === '/settings' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                size="lg"
                tooltip='Settings'
              >
              <Link href="/settings">
                <Settings className="w-5 h-5"/>
                <span>Settings</span>
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
