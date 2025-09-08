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
  Users,
  BarChart,
  AreaChart,
  FileWarning,
  Server,
  Shield,
  Home,
  UserCircle,
} from 'lucide-react';

const mainLinks = [
  { href: '/admin-dashboard', label: 'Overview', icon: Home },
  { href: '/admin-dashboard/user-management', label: 'User Management', icon: Users },
  { href: '/admin-dashboard/transactions', label: 'Transactions', icon: BarChart },
  { href: '/admin-dashboard/analytics', label: 'Analytics', icon: AreaChart },
  { href: '/admin-dashboard/complaints', label: 'Complaints', icon: FileWarning },
  { href: '/admin-dashboard/system-health', label: 'System Health', icon: Server },
]

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold font-headline">FarmLink</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="w-3 h-3" /> Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainLinks.map((item) => (
             <SidebarMenuItem key={item.href}>
             <Link href={item.href} legacyBehavior passHref>
               <SidebarMenuButton
                 variant={pathname === item.href ? 'primary' : 'ghost'}
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
            <Link href="/admin-dashboard/profile" legacyBehavior passHref>
              <SidebarMenuButton
                  variant={pathname === '/admin-dashboard/profile' ? 'primary' : 'ghost'}
                  className="w-full justify-start"
                  size="lg"
                  tooltip='Profile'
                >
                <UserCircle className="w-5 h-5"/>
                <span>Profile</span>
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
