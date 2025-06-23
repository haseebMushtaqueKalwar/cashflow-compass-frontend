
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Package,
  FileText,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      available: true,
      description: 'Overview & Analytics'
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: Package, 
      available: true,
      description: 'Manage Inventory'
    },
    { 
      id: 'invoices', 
      label: 'Invoices', 
      icon: FileText, 
      available: true,
      description: 'Sales & Billing'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart3, 
      available: true,
      description: 'Analytics & Insights'
    },
    { 
      id: 'stores', 
      label: 'Stores', 
      icon: Building2, 
      available: isAdmin,
      description: 'Store Management'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      available: isAdmin,
      description: 'User Administration'
    },
  ].filter(item => item.available);

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <>
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
        "lg:translate-x-0", // Always visible on large screens
        isOpen ? "translate-x-0" : "-translate-x-full" // Mobile: show/hide based on isOpen
      )}>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 lg:hidden text-white hover:bg-slate-700"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-4 lg:w-5 h-4 lg:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                POS System
              </h1>
              <p className="text-slate-400 text-xs">Point of Sale</p>
            </div>
          </div>
          
          {/* User Info */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
            <div className="flex items-center space-x-2">
              <div className="w-6 lg:w-8 h-6 lg:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-white truncate">{user?.username}</p>
                <p className="text-xs text-slate-400">{user?.role}</p>
              </div>
            </div>
            {user?.storeName && (
              <div className="mt-2 pt-2 border-t border-slate-700/50">
                <p className="text-xs text-emerald-400 flex items-center">
                  <Building2 className="w-3 h-3 mr-1" />
                  {user.storeName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Main Menu
            </p>
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-auto p-0 hover:bg-slate-700/50 transition-all duration-200 group",
                        isActive && "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-2 border-blue-500"
                      )}
                      onClick={() => handleNavigation(item.id)}
                    >
                      <div className="flex items-center w-full p-2 lg:p-3 rounded-lg">
                        <div className={cn(
                          "w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center mr-2 lg:mr-3 transition-all duration-200",
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25" 
                            : "bg-slate-700/50 group-hover:bg-slate-600/70"
                        )}>
                          <Icon className={cn(
                            "w-4 lg:w-5 h-4 lg:h-5 transition-colors duration-200",
                            isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                          )} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={cn(
                            "text-sm lg:text-base font-medium transition-colors duration-200",
                            isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                          )}>
                            {item.label}
                          </p>
                          <p className={cn(
                            "text-xs transition-colors duration-200 hidden lg:block",
                            isActive ? "text-blue-200" : "text-slate-400 group-hover:text-slate-300"
                          )}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 lg:p-4 border-t border-slate-700/50">
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-0 hover:bg-red-600/10 transition-all duration-200 group"
            onClick={logout}
          >
            <div className="flex items-center w-full p-2 lg:p-3 rounded-lg">
              <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center mr-2 lg:mr-3 bg-slate-700/50 group-hover:bg-red-600/20 transition-all duration-200">
                <LogOut className="w-4 lg:w-5 h-4 lg:h-5 text-slate-300 group-hover:text-red-400 transition-colors duration-200" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm lg:text-base font-medium text-slate-200 group-hover:text-red-400 transition-colors duration-200">
                  Sign Out
                </p>
                <p className="text-xs text-slate-400 group-hover:text-red-300 transition-colors duration-200 hidden lg:block">
                  Logout from system
                </p>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
