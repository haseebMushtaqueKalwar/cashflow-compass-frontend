
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { DollarSign, Package, Users, Store, TrendingUp, AlertTriangle, FileText, ShoppingCart } from 'lucide-react';

const DashboardCards = () => {
  const { user, isAdmin } = useAuth();
  const { products } = useSelector((state: RootState) => state.products);
  const { invoices } = useSelector((state: RootState) => state.invoices);

  const userProducts = isAdmin ? products : products.filter(p => p.storeId === user?.storeId);
  const userInvoices = isAdmin ? invoices : invoices.filter(i => i.storeId === user?.storeId);
  
  const totalSales = userInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const todaySales = userInvoices
    .filter(invoice => invoice.date === new Date().toISOString().split('T')[0])
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const lowStockProducts = userProducts.filter(p => p.stock < 10);
  const outOfStockProducts = userProducts.filter(p => p.stock === 0);

  if (isAdmin) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Sales</CardTitle>
            <div className="p-2 bg-green-500 rounded-full">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">${totalSales.toLocaleString()}</div>
            <div className="flex items-center mt-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Active Stores</CardTitle>
            <div className="p-2 bg-blue-500 rounded-full">
              <Store className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">2</div>
            <p className="text-xs text-blue-600 mt-2">Operational stores</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Total Products</CardTitle>
            <div className="p-2 bg-purple-500 rounded-full">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{products.length}</div>
            <p className="text-xs text-purple-600 mt-2">
              {lowStockProducts.length} low stock items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Total Invoices</CardTitle>
            <div className="p-2 bg-orange-500 rounded-full">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{invoices.length}</div>
            <p className="text-xs text-orange-600 mt-2">
              {invoices.filter(i => i.date === new Date().toISOString().split('T')[0]).length} today
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Today's Sales</CardTitle>
          <div className="p-2 bg-green-500 rounded-full">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">${todaySales.toLocaleString()}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-green-600">{user?.storeName}</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+8%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br border-2 ${
        outOfStockProducts.length > 0 
          ? 'from-red-50 to-rose-50 border-red-200' 
          : lowStockProducts.length > 0 
            ? 'from-yellow-50 to-amber-50 border-yellow-200'
            : 'from-green-50 to-emerald-50 border-green-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${
            outOfStockProducts.length > 0 ? 'text-red-700' : 
            lowStockProducts.length > 0 ? 'text-yellow-700' : 'text-green-700'
          }`}>
            Stock Status
          </CardTitle>
          <div className={`p-2 rounded-full ${
            outOfStockProducts.length > 0 ? 'bg-red-500' : 
            lowStockProducts.length > 0 ? 'bg-yellow-500' : 'bg-green-500'
          }`}>
            {outOfStockProducts.length > 0 || lowStockProducts.length > 0 ? (
              <AlertTriangle className="h-4 w-4 text-white" />
            ) : (
              <Package className="h-4 w-4 text-white" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            outOfStockProducts.length > 0 ? 'text-red-800' : 
            lowStockProducts.length > 0 ? 'text-yellow-800' : 'text-green-800'
          }`}>
            {outOfStockProducts.length > 0 ? outOfStockProducts.length : lowStockProducts.length}
          </div>
          <p className={`text-xs mt-2 ${
            outOfStockProducts.length > 0 ? 'text-red-600' : 
            lowStockProducts.length > 0 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {outOfStockProducts.length > 0 ? 'Out of stock' : 
             lowStockProducts.length > 0 ? 'Low stock items' : 'All items in stock'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Recent Invoices</CardTitle>
          <div className="p-2 bg-blue-500 rounded-full">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">{userInvoices.length}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-blue-600">Total invoices</p>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+5%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
