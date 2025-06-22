
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Minus, ShoppingCart, Trash, Calendar } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Invoice {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  customerName?: string;
}

const InvoiceSystem = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      date: '2025-01-15',
      items: [
        { id: '1', name: 'Espresso Coffee', price: 3.50, stock: 120, category: 'Beverages', quantity: 2 },
        { id: '2', name: 'Croissant', price: 2.80, stock: 45, category: 'Bakery', quantity: 1 }
      ],
      total: 9.80,
      customerName: 'John Doe'
    },
    {
      id: 'INV-002',
      date: '2025-01-15',
      items: [
        { id: '3', name: 'Cappuccino', price: 4.20, stock: 80, category: 'Beverages', quantity: 1 }
      ],
      total: 4.20
    }
  ]);

  // Mock products
  const products: Product[] = [
    { id: '1', name: 'Espresso Coffee', price: 3.50, stock: 120, category: 'Beverages' },
    { id: '2', name: 'Croissant', price: 2.80, stock: 45, category: 'Bakery' },
    { id: '3', name: 'Cappuccino', price: 4.20, stock: 80, category: 'Beverages' },
    { id: '4', name: 'Sandwich', price: 6.50, stock: 30, category: 'Food' },
    { id: '5', name: 'Orange Juice', price: 3.00, stock: 25, category: 'Beverages' },
    { id: '6', name: 'Muffin', price: 3.20, stock: 20, category: 'Bakery' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.08; // 8% tax
  };

  const generateInvoice = () => {
    if (cart.length === 0) return;

    const newInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      total: calculateTotal() + calculateTax(),
      customerName: customerName || undefined
    };

    setInvoices([newInvoice, ...invoices]);
    setCart([]);
    setCustomerName('');
    alert(`Invoice ${newInvoice.id} generated successfully!`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Invoice System</h1>
          <p className="text-gray-600 mt-1">Create sales invoices and manage transactions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            Create Invoice
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
          >
            Invoice History
          </Button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Products</CardTitle>
                <CardDescription>Search and add products to the invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <Plus className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <Badge variant="secondary">{product.stock} in stock</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart & Invoice */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Current Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Customer name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                
                <Separator />

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No items in cart</p>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%):</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${(calculateTotal() + calculateTax()).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={generateInvoice}
                  disabled={cart.length === 0}
                >
                  Generate Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Invoice History */
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Invoice History
              </CardTitle>
              <CardDescription>View all generated invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{invoice.id}</h3>
                        <p className="text-sm text-gray-600">{invoice.date}</p>
                        {invoice.customerName && (
                          <p className="text-sm text-gray-600">Customer: {invoice.customerName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${invoice.total.toFixed(2)}
                        </p>
                        <Badge>{invoice.items.length} items</Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {invoice.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InvoiceSystem;
