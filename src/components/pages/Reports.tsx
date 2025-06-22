
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Calendar } from 'lucide-react';

const Reports = () => {
  const { user, isAdmin } = useAuth();
  const { invoices } = useSelector((state: RootState) => state.invoices);
  const { products } = useSelector((state: RootState) => state.products);
  
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');

  const userInvoices = isAdmin ? invoices : invoices.filter(i => i.storeId === user?.storeId);
  const userProducts = isAdmin ? products : products.filter(p => p.storeId === user?.storeId);

  // Sample data for charts
  const monthlySales = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 15000 },
    { month: 'Mar', sales: 18000 },
    { month: 'Apr', sales: 16000 },
    { month: 'May', sales: 22000 },
    { month: 'Jun', sales: 25000 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 65, color: '#3b82f6' },
    { name: 'Accessories', value: 25, color: '#10b981' },
    { name: 'Software', value: 10, color: '#f59e0b' },
  ];

  const topProducts = [
    { name: 'Laptop', sold: 45, revenue: 44999 },
    { name: 'Mouse', sold: 120, revenue: 3599 },
    { name: 'Keyboard', sold: 85, revenue: 6799 },
    { name: 'Monitor', sold: 32, revenue: 9599 },
  ];

  const handleExportCSV = () => {
    const csvData = userInvoices.map(invoice => ({
      'Invoice ID': invoice.id,
      'Date': invoice.date,
      'Total': invoice.total,
      'Items Count': invoice.items.length,
      'Store': invoice.storeName
    }));
    
    // Simple CSV export simulation
    console.log('Exporting CSV:', csvData);
    alert('CSV export functionality would be implemented here');
  };

  const totalRevenue = userInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalTransactions = userInvoices.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">
            {isAdmin ? 'Comprehensive reports across all stores' : `Reports for ${user?.storeName}`}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Apply Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalTransactions}</div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${averageTransaction.toFixed(2)}</div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Products Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">482</div>
            <p className="text-xs text-gray-500">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#10b981" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Invoice ID</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Total</th>
                  {isAdmin && <th className="text-left p-2">Store</th>}
                </tr>
              </thead>
              <tbody>
                {userInvoices.slice(0, 10).map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{invoice.id}</td>
                    <td className="p-2">{invoice.date}</td>
                    <td className="p-2">{invoice.items.length} items</td>
                    <td className="p-2 font-bold text-green-600">${invoice.total.toFixed(2)}</td>
                    {isAdmin && <td className="p-2">{invoice.storeName}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
