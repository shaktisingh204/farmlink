
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
