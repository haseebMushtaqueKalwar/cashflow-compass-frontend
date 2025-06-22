
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ProductManagement from '../components/ProductManagement';
import InvoiceSystem from '../components/InvoiceSystem';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'invoices':
        return <InvoiceSystem />;
      case 'stores':
        return (
          <ProtectedRoute requireAdmin>
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Store Management</h1>
              <p className="text-gray-600">Store management features coming soon...</p>
            </div>
          </ProtectedRoute>
        );
      case 'users':
        return (
          <ProtectedRoute requireAdmin>
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">User Management</h1>
              <p className="text-gray-600">User management features coming soon...</p>
            </div>
          </ProtectedRoute>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${isMobile && isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} ${isMobile ? '' : 'relative'}`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={!isMobile && isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0' : (isSidebarCollapsed ? 'ml-16' : 'ml-64')}`}>
        <div className="min-h-screen">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
