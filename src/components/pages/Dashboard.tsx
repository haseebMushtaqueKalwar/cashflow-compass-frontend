
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCards from '../dashboard/DashboardCards';
import SalesChart from '../dashboard/SalesChart';
import { Plus, FileText, Users, Store } from 'lucide-react';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();

  const handleNewInvoice = () => {
    if (onNavigate) {
      onNavigate('invoices');
    }
  };

  const handleManageStores = () => {
    if (onNavigate) {
      onNavigate('stores');
    }
  };

  const handleManageUsers = () => {
    if (onNavigate) {
      onNavigate('users');
    }
  };

  const handleViewReports = () => {
    if (onNavigate) {
      onNavigate('reports');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">
            {isAdmin ? 'Admin Dashboard - Overview of all stores' : `${user?.storeName} Dashboard`}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleNewInvoice}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
          {isAdmin && (
            <>
              <Button 
                variant="outline"
                onClick={handleManageStores}
              >
                <Store className="h-4 w-4 mr-2" />
                Manage Stores
              </Button>
              <Button 
                variant="outline"
                onClick={handleManageUsers}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </>
          )}
          <Button 
            variant="outline"
            onClick={handleViewReports}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <DashboardCards />

      {/* Charts */}
      <SalesChart />

      {/* Recent Activity - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Activity
            <span className="text-sm font-normal text-gray-500">Last 24 hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Invoice #INV-001 created</p>
                  <p className="text-sm text-gray-600">2 hours ago • $999.99</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Low stock alert: Mouse</p>
                  <p className="text-sm text-gray-600">4 hours ago • 5 units remaining</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Warning
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-600">6 hours ago • John Doe joined</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                New
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
