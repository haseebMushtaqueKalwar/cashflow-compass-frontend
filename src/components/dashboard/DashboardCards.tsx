
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { DollarSign, Package, Users, Store } from 'lucide-react';

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

  if (isAdmin) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Operational stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Across all stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${todaySales.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{user?.storeName}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
          <p className="text-xs text-muted-foreground">Items below 10 units</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Invoices</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userInvoices.length}</div>
          <p className="text-xs text-muted-foreground">Total invoices</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
