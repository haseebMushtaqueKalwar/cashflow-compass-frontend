
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockWeeklySales = [
  { day: 'Mon', sales: 1200 },
  { day: 'Tue', sales: 1800 },
  { day: 'Wed', sales: 1600 },
  { day: 'Thu', sales: 2100 },
  { day: 'Fri', sales: 2400 },
  { day: 'Sat', sales: 2800 },
  { day: 'Sun', sales: 2200 },
];

const mockTopProducts = [
  { name: 'Laptop', sales: 45 },
  { name: 'Mouse', sales: 38 },
  { name: 'Keyboard', sales: 32 },
  { name: 'Monitor', sales: 28 },
];

const SalesChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockWeeklySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTopProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} units`, 'Sold']} />
              <Bar dataKey="sales" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesChart;
