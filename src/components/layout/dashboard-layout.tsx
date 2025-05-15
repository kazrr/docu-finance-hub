
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, File, Home, MenuIcon, PieChart } from "lucide-react";
import { useSidebar } from "./sidebar-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserMenu } from "./UserMenu";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon, label, to, active, collapsed }: SidebarItemProps) => (
  <Link to={to}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
      )}
    >
      <div className="flex items-center">
        <span className="mr-2">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </div>
    </Button>
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const sidebarItems = [
    { icon: <Home size={20} />, label: "Dashboard", to: "/dashboard" },
    { icon: <File size={20} />, label: "Documents", to: "/documents" },
    { icon: <PieChart size={20} />, label: "Finance", to: "/finance" },
    { icon: <Calendar size={20} />, label: "Calendar", to: "/calendar" },
  ];

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "bg-sidebar h-screen sticky top-0 transition-all duration-300 hidden md:block",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {!collapsed && (
              <h2 className="text-xl font-bold text-sidebar-foreground">FinanceDocs</h2>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground">
              <MenuIcon size={20} />
            </Button>
          </div>
          <nav>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1">
        <header className="bg-sidebar text-sidebar-foreground p-4 md:hidden sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">FinanceDocs</h2>
            <div className="flex items-center gap-2">
              <UserMenu />
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <MenuIcon size={20} />
              </Button>
            </div>
          </div>
          {showMobileMenu && (
            <nav className="pt-4 animate-fade-in">
              {sidebarItems.map((item) => (
                <Link 
                  key={item.to} 
                  to={item.to}
                  className={cn(
                    "block py-2 px-4 rounded-md mb-1",
                    location.pathname === item.to ? "bg-sidebar-accent" : ""
                  )}
                  onClick={toggleMobileMenu}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          )}
        </header>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-end p-4 border-b">
          <UserMenu />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
