
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings, Menu, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between shadow-sm transition-colors duration-200">
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden transition-transform duration-200 hover:scale-105"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
            Welcome back!
          </h2>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hidden sm:block transition-colors">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
          />
        </div>
        
        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="md:hidden transition-transform duration-200 hover:scale-105">
          <Search className="h-5 w-5" />
        </Button>
        
        {/* Theme toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="transition-transform duration-200 hover:scale-105"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative transition-transform duration-200 hover:scale-105">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
            3
          </span>
        </Button>
        
        {/* Settings */}
        <Button variant="ghost" size="icon" className="transition-transform duration-200 hover:scale-105">
          <Settings className="h-5 w-5" />
        </Button>
        
        {/* User Info */}
        <div className="flex items-center space-x-2 lg:space-x-3 ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-semibold text-white transition-transform duration-200 hover:scale-105">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
