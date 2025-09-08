
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

const mainLinks = [
  { href: '/retailer-dashboard', label: 'Overview', icon: Home },
  { href: '/retailer-dashboard/browse-produce', label: 'Browse Produce', icon: Search },
  { href: '/retailer-dashboard/my-orders', label: 'My Orders', icon: Receipt },
  { href: '/retailer-dashboard/recommended-deals', label: 'Recommended Deals', icon: Tags },
  { href: '/retailer-dashboard/payments', label: 'Payments', icon: Wallet },
  { href: '/retailer-dashboard/favorites', label: 'Favorites', icon: Heart },
]

export function RetailerSidebar() {
  const pathname = usePathname();

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
                variant={pathname === '/retailer-dashboard/profile' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                size="lg"
                tooltip='Profile'
              >
              <Link href="/retailer-dashboard/profile">
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
