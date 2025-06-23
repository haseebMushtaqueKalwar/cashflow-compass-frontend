
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { addToCart, updateCartQuantity, removeFromCart, clearCart, addInvoice } from '../../store/slices/invoicesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Minus, Trash2, Search, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Invoices = () => {
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();
  const { products } = useSelector((state: RootState) => state.products);
  const { cart, invoices } = useSelector((state: RootState) => state.invoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedStore, setSelectedStore] = useState(user?.storeId || '');
  const [errors, setErrors] = useState<any>({});

  const userProducts = isAdmin ? 
    (selectedStore ? products.filter(p => p.storeId === selectedStore) : products) : 
    products.filter(p => p.storeId === user?.storeId);
    
  const userInvoices = isAdmin ? invoices : invoices.filter(i => i.storeId === user?.storeId);
  
  const filteredProducts = userProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const generateInvoiceId = () => {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = String(invoices.length + 1).padStart(3, '0');
    return `INV-${dateStr}-${timeStr}`;
  };

  const validateInvoice = () => {
    const newErrors: any = {};
    
    if (!customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (cart.length === 0) newErrors.cart = 'At least one product must be added to cart';
    if (isAdmin && !selectedStore) newErrors.store = 'Store selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }));
    toast.success(`${product.name} added to cart`);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id));
      return;
    }
    dispatch(updateCartQuantity({ id, quantity: newQuantity }));
  };

  const handleCreateInvoice = () => {
    if (!validateInvoice()) {
      if (errors.customerName) toast.error(errors.customerName);
      if (errors.cart) toast.error(errors.cart);
      if (errors.store) toast.error(errors.store);
      return;
    }

    const storeId = isAdmin ? selectedStore : user?.storeId || '1';
    const storeName = storeId === '1' ? 'Downtown Store' : 'Mall Store';

    const newInvoice = {
      id: generateInvoiceId(),
      customerName: customerName.trim(),
      items: [...cart],
      total: cartTotal,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      storeId,
      storeName
    };

    dispatch(addInvoice(newInvoice));
    dispatch(clearCart());
    setCustomerName('');
    setErrors({});
    toast.success(`Invoice ${newInvoice.id} created successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Create new invoices and manage sales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {isAdmin && (
                  <div>
                    <Label>Select Store</Label>
                    <Select value={selectedStore} onValueChange={setSelectedStore}>
                      <SelectTrigger className={errors.store ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Store" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Downtown Store</SelectItem>
                        <SelectItem value="2">Mall Store</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.store && <p className="text-red-500 text-xs mt-1">{errors.store}</p>}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.stock === 0 ? 'bg-red-100 text-red-800' :
                          product.stock < 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {product.stock} left
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart and Invoice Details */}
        <div className="space-y-4">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className={errors.customerName ? 'border-red-500' : ''}
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Cart is empty</p>
                  <p className="text-sm text-gray-400">Add products to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    {errors.cart && <p className="text-red-500 text-xs">{errors.cart}</p>}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleCreateInvoice}
                    >
                      Create Invoice
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => dispatch(clearCart())}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                {isAdmin && <TableHead>Store</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userInvoices.slice(0, 10).map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customerName || 'N/A'}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.time || 'N/A'}</TableCell>
                  <TableCell>{invoice.items.length} items</TableCell>
                  <TableCell className="font-bold text-green-600">${invoice.total.toFixed(2)}</TableCell>
                  {isAdmin && <TableCell>{invoice.storeName}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
