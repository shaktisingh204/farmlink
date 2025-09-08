
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
  ShoppingBag,
  Search,
  Receipt,
  Tags,
  Wallet,
  Heart,
  Home,
  UserCircle,
} from 'lucide-react';

export function RetailerSidebar() {
  const pathname = usePathname();

  const mainLinks = [
    { href: '/retailer-dashboard', label: 'Overview', icon: Home },
    { href: '/retailer-dashboard/browse-produce', label: 'Browse Produce', icon: Search },
    { href: '/retailer-dashboard/my-orders', label: 'My Orders', icon: Receipt },
    { href: '/retailer-dashboard/recommended-deals', label: 'Recommended Deals', icon: Tags },
    { href: '/retailer-dashboard/payments', label: 'Payments', icon: Wallet },
    { href: '/retailer-dashboard/favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold font-headline">FarmLink</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> Retailer Portal</span>
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
            <Link href="/retailer-dashboard/profile">
              <SidebarMenuButton
                  variant={pathname === '/retailer-dashboard/profile' ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
                  tooltip='Profile'
                  isActive={pathname === '/retailer-dashboard/profile'}
                >
                <UserCircle className="w-5 h-5"/>
                <span>Profile</span>
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
