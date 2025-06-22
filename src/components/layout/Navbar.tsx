
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, User } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">POS System</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span className="font-medium">{user?.username}</span>
          <span className="text-gray-400">•</span>
          <span className="text-blue-600">{user?.role}</span>
          {user?.storeName && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-green-600">{user.storeName}</span>
            </>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
