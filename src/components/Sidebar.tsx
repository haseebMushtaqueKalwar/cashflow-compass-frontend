
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChartBar, 
  Store, 
  User, 
  Menu, 
  LogOut,
  Calendar,
  Search
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const { user, logout, isAdmin } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBar, available: true },
    { id: 'products', label: 'Products', icon: Search, available: true },
    { id: 'invoices', label: 'Invoices', icon: Calendar, available: true },
    { id: 'stores', label: 'Stores', icon: Store, available: isAdmin },
    { id: 'users', label: 'Users', icon: User, available: isAdmin },
  ].filter(item => item.available);

  return (
    <div className={cn(
      "bg-gray-900 text-white transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold">POS System</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-gray-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-700">
          <div className="text-sm">
            <p className="font-medium">{user?.username}</p>
            <p className="text-gray-400">{user?.role}</p>
            {user?.storeName && (
              <p className="text-gray-400 text-xs">{user.storeName}</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    activeTab === item.id && "bg-gray-700",
                    isCollapsed && "px-2"
                  )}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-white hover:bg-gray-700",
            isCollapsed && "px-2"
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
