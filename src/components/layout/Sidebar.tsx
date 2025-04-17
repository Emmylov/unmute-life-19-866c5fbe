
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Compass,
  Users,
  Video,
  MessageSquare,
  Heart,
  User,
  Sparkles,
  Bookmark,
  PlusCircle,
  LucideIcon,
  Gamepad2,
  Music,
  Moon,
  Sun
} from "lucide-react";

// Add a simple ModeToggle component since it's missing
const ModeToggle = () => {
  return (
    <button className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span>Toggle Theme</span>
    </button>
  );
};

interface NavItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ name, href, icon: Icon, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <li>
      <Link
        to={href}
        className={`flex items-center p-2 rounded-md hover:bg-secondary transition-colors ${isActive ? 'bg-secondary font-semibold' : ''}`}
      >
        <Icon className="w-5 h-5 mr-2" />
        {name}
        {badge && (
          <Badge variant="secondary" className="ml-auto">
            {badge}
          </Badge>
        )}
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const { user, profile } = useAuth();
  const notificationCount = 5; // Example notification count

  const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Communities", href: "/communities", icon: Users },
    { name: "Reels", href: "/reels", icon: Video },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Music", href: "/music", icon: Music },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Notifications", href: "/notifications", icon: Heart, badge: notificationCount },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Wellness", href: "/wellness", icon: Sparkles },
    { name: "Saved", href: "/saved", icon: Bookmark },
    { name: "Create", href: "/content-creator", icon: PlusCircle },
  ];

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary h-10 px-4 py-2 lg:hidden">Menu</button>
        </SheetTrigger>
        <SheetContent className="w-full sm:w-3/4 md:w-2/5 right-0 border-l">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navigate through the app.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />

          <nav className="flex flex-col space-y-1">
            <ul className="space-y-0.5">
              {navigation.map((item) => (
                <NavItem key={item.name} name={item.name} href={item.href} icon={item.icon} badge={item.badge} />
              ))}
            </ul>
          </nav>

          <Separator className="my-4" />

          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={profile?.avatar || ""} />
              <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0">
              <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {profile?.username}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <ModeToggle />
        </SheetContent>
      </Sheet>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-background border-r py-4">
        <div className="px-6">
          <Link to="/home" className="flex items-center text-2xl font-semibold">
            Moodify
          </Link>
        </div>
        <Separator className="my-4" />

        <nav className="flex flex-col space-y-1">
          <ul className="space-y-0.5">
            {navigation.map((item) => (
              <NavItem key={item.name} name={item.name} href={item.href} icon={item.icon} badge={item.badge} />
            ))}
          </ul>
        </nav>

        <Separator className="my-4" />

        <div className="px-6">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={profile?.avatar || ""} />
              <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0">
              <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {profile?.username}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto px-6">
          <ModeToggle />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
