import { Link, useLocation } from "wouter";
import { useAdminLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Layers, LogOut, Menu, X, User } from "lucide-react";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const logout = useAdminLogout();
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout.mutate(undefined as any, {
      onSuccess: () => {
        setLocation("/admin/login");
      }
    });
  };

  const navItems = [
    { href: "/admin/paintings", label: "Paintings", icon: ImageIcon },
    { href: "/admin/series", label: "Series", icon: Layers },
    { href: "/admin/about", label: "About Page", icon: User },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-stone-900 text-white sticky top-0 z-50">
        <span className="font-serif text-xl tracking-tight">MARJAN</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-stone-900 text-stone-300 md:relative md:flex md:flex-col md:w-64 md:translate-x-0 transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full px-4 py-8">
          <div className="hidden md:block mb-10 px-4">
            <h1 className="font-serif text-2xl text-white tracking-tight">MARJAN</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-1 font-medium">Portfolio Manager</p>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-md transition-colors cursor-pointer
                      ${isActive 
                        ? "bg-stone-800 text-white" 
                        : "hover:bg-stone-800/50 hover:text-stone-100"}
                    `}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-stone-800">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-stone-400 hover:text-white hover:bg-stone-800 px-4"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 md:p-10 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
