import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import { CircleUser } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"

export function AppHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const getProfileLink = () => {
    if (pathname.startsWith('/admin-dashboard')) return '/admin-dashboard/profile';
    if (pathname.startsWith('/farmer-dashboard')) return '/farmer-dashboard/profile';
    if (pathname.startsWith('/retailer-dashboard')) return '/retailer-dashboard/profile';
    if (pathname.startsWith('/local-market-dashboard')) return '/local-market-dashboard/profile';
    return '/'; // Fallback
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden"/>
        <Logo className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold font-headline">FarmLink</h1>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user?.photoURL || `https://picsum.photos/100/100?random=${user?.uid}`} alt="User" />
                <AvatarFallback>
                  <CircleUser className="h-5 w-5"/>
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={getProfileLink()}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
