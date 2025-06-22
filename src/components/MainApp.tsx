
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './auth/LoginForm';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Stores from './pages/Stores';
import Users from './pages/Users';

const MainApp = () => {
  const { isAuthenticated, initializeAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'invoices':
        return <Invoices />;
      case 'reports':
        return <Reports />;
      case 'stores':
        return <Stores />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;
