
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCards from '../dashboard/DashboardCards';
import SalesChart from '../dashboard/SalesChart';
import { Plus, FileText, Users, Store } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

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
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
          {isAdmin && (
            <>
              <Button variant="outline">
                <Store className="h-4 w-4 mr-2" />
                Manage Stores
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </>
          )}
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <DashboardCards />

      {/* Charts */}
      <SalesChart />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Invoice #INV-001 created</p>
                <p className="text-sm text-gray-600">2 hours ago • $999.99</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Completed
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Low stock alert: Mouse</p>
                <p className="text-sm text-gray-600">4 hours ago • 5 units remaining</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Warning
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
