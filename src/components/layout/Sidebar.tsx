
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ChartBar, 
  Store, 
  User, 
  Calendar,
  Search,
  FileText,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBar, available: true },
    { id: 'products', label: 'Products', icon: Search, available: true },
    { id: 'invoices', label: 'Invoices', icon: Calendar, available: true },
    { id: 'reports', label: 'Reports', icon: FileText, available: true },
    { id: 'stores', label: 'Stores', icon: Store, available: isAdmin },
    { id: 'users', label: 'Users', icon: User, available: isAdmin },
  ].filter(item => item.available);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-gray-900 text-white transition-transform duration-300 z-50 w-64",
        "md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-gray-700 md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Button
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-white hover:bg-gray-700",
                      activeTab === item.id && "bg-blue-600 hover:bg-blue-700"
                    )}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
