import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Users,
  Package,
  Settings,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  Image,
  TicketPercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import NotificationIcon from "@/components/admin/NotificationIcon";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  href: string;
  icon: ReactNode;
  title: string;
  isActive?: boolean;
  isExpanded?: boolean;
  hasSubNav?: boolean;
  subNavOpen?: boolean;
  // Updated to handle event parameter
  onClick?: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem = ({
  href,
  icon,
  title,
  isActive,
  isExpanded,
  hasSubNav,
  subNavOpen,
  onClick,
}: NavItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {(isExpanded || subNavOpen) && <span>{title}</span>}
      {hasSubNav && isExpanded && (
        <ChevronDown
          className={cn("ml-auto h-4 w-4 transition-all", subNavOpen && "rotate-180")}
        />
      )}
    </Link>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeSubNav, setActiveSubNav] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleSubNav = (subNav: string) => {
    setActiveSubNav(activeSubNav === subNav ? null : subNav);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isSubNavActive = (basePath: string) => {
    return location.pathname.startsWith(basePath);
  };

  const navItems = [
    {
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Dashboard",
      exact: true,
    },
    {
      href: "/admin/products",
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Products",
      subNav: [
        { href: "/admin/products", title: "All Products" },
        { href: "/admin/products/new", title: "Add Product" },
      ],
    },
    {
      href: "/admin/categories",
      icon: <Tag className="h-5 w-5" />,
      title: "Categories",
      subNav: [
        { href: "/admin/categories", title: "All Categories" },
        { href: "/admin/categories/new", title: "Add Category" },
        { href: "/admin/attributes", title: "Attributes" },
      ],
    },
    {
      href: "/admin/banners",
      icon: <Image className="h-5 w-5" />,
      title: "Banners",
    },
    {
      href: "/admin/specialoffers",
      icon: <Tag className="h-5 w-5" />,
      title: "Special Offers",
    },
    {
      href: "/admin/orders",
      icon: <Package className="h-5 w-5" />,
      title: "Orders",
      subNav: [
        { href: "/admin/orders", title: "All Orders" },
        { href: "/admin/orders/pending", title: "Pending Orders" },
      ],
    },
    {
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
      title: "Customers",
    },
    {
      href: "/admin/coupons",
      icon: <TicketPercent className="h-5 w-5" />,
      title: "Coupons",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      title: "Settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-30 hidden border-r bg-background transition-all duration-300 md:flex md:flex-col",
          isExpanded ? "md:w-64" : "md:w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          {isExpanded && <span className="text-lg font-semibold">Admin Panel</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const hasSubNav = !!item.subNav;
              const subNavOpen = activeSubNav === item.title;
              const isItemActive = item.exact
                ? isActive(item.href)
                : hasSubNav
                ? isSubNavActive(item.href)
                : isActive(item.href);

              return (
                <div key={item.href}>
                  {hasSubNav ? (
                    <div>
                      <NavItem
                        href={item.href}
                        icon={item.icon}
                        title={item.title}
                        isActive={isItemActive}
                        isExpanded={isExpanded}
                        hasSubNav={hasSubNav}
                        subNavOpen={subNavOpen}
                        onClick={(e) => {
                          e?.preventDefault();
                          toggleSubNav(item.title);
                        }}
                      />
                      {subNavOpen && isExpanded && (
                        <div className="ml-4 mt-1 grid gap-1 border-l pl-2">
                          {item.subNav?.map((subItem) => (
                            <NavItem
                              key={subItem.href}
                              href={subItem.href}
                              icon={<div className="h-1 w-1 rounded-full bg-current" />}
                              title={subItem.title}
                              isActive={isActive(subItem.href)}
                              isExpanded={isExpanded}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavItem
                      href={item.href}
                      icon={item.icon}
                      title={item.title}
                      isActive={isItemActive}
                      isExpanded={isExpanded}
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600",
              !isExpanded && "justify-center"
            )}
            onClick={logout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            {isExpanded && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="text-lg font-semibold">Admin Panel</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)] py-4">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => {
                const hasSubNav = !!item.subNav;
                const subNavOpen = activeSubNav === item.title;
                const isItemActive = item.exact
                  ? isActive(item.href)
                  : hasSubNav
                  ? isSubNavActive(item.href)
                  : isActive(item.href);

                return (
                  <div key={item.href}>
                    {hasSubNav ? (
                      <div>
                        <NavItem
                          href={item.href}
                          icon={item.icon}
                          title={item.title}
                          isActive={isItemActive}
                          isExpanded={true}
                          hasSubNav={hasSubNav}
                          subNavOpen={subNavOpen}
                          onClick={(e) => {
                            e?.preventDefault();
                            toggleSubNav(item.title);
                          }}
                        />
                        {subNavOpen && (
                          <div className="ml-4 mt-1 grid gap-1 border-l pl-2">
                            {item.subNav?.map((subItem) => (
                              <NavItem
                                key={subItem.href}
                                href={subItem.href}
                                icon={<div className="h-1 w-1 rounded-full bg-current" />}
                                title={subItem.title}
                                isActive={isActive(subItem.href)}
                                isExpanded={true}
                                onClick={() => setIsMobileNavOpen(false)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavItem
                        href={item.href}
                        icon={item.icon}
                        title={item.title}
                        isActive={isItemActive}
                        isExpanded={true}
                        onClick={() => setIsMobileNavOpen(false)}
                      />
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={logout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          isExpanded ? "md:ml-64" : "md:ml-16"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <NotificationIcon />

            {/* User Profile Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-5 w-5" />
                {isAuthenticated && user && <span>{user.name.split(" ")[0]}</span>}
              </Button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link to="/">
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          Go to Shop
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        size="sm"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" className="w-full">
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;