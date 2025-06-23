
import React, { useState } from 'react';
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
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
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
        return <Dashboard onNavigate={setActiveTab} />;
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
      
      {/* Main content area with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainApp;
