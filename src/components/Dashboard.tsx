
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const productData = [
    { name: 'Coffee', sales: 120 },
    { name: 'Sandwich', sales: 85 },
    { name: 'Pastry', sales: 67 },
    { name: 'Juice', sales: 45 },
  ];

  const adminStats = [
    { title: 'Total Sales', value: '$24,780', change: '+12%', color: 'text-green-600' },
    { title: 'Active Stores', value: '8', change: '+2', color: 'text-blue-600' },
    { title: 'Total Products', value: '156', change: '+8', color: 'text-purple-600' },
    { title: 'Active Users', value: '24', change: '+3', color: 'text-orange-600' },
  ];

  const storeStats = [
    { title: "Today's Sales", value: '$1,240', change: '+8%', color: 'text-green-600' },
    { title: 'Invoices Issued', value: '45', change: '+5', color: 'text-blue-600' },
    { title: 'Products Sold', value: '123', change: '+12', color: 'text-purple-600' },
    { title: 'Low Stock Items', value: '3', change: '-2', color: 'text-red-600' },
  ];

  const stats = isAdmin ? adminStats : storeStats;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {isAdmin ? 'Admin Dashboard' : `${user?.storeName} Dashboard`}
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.username}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>Sales performance over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} sold`, 'Units']} />
                <Bar dataKey="sales" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <div className="text-blue-600 font-semibold">New Invoice</div>
              <div className="text-sm text-gray-600">Create new sale</div>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <div className="text-green-600 font-semibold">Add Product</div>
              <div className="text-sm text-gray-600">Add new item</div>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <div className="text-purple-600 font-semibold">View Reports</div>
              <div className="text-sm text-gray-600">Sales analytics</div>
            </button>
            {isAdmin && (
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
                <div className="text-orange-600 font-semibold">Manage Users</div>
                <div className="text-sm text-gray-600">User administration</div>
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
