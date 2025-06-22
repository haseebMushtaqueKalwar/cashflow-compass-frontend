
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { addToCart, updateCartQuantity, removeFromCart, clearCart, addInvoice } from '../../store/slices/invoicesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCart, Plus, Minus, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Invoices = () => {
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();
  const { products } = useSelector((state: RootState) => state.products);
  const { cart, invoices } = useSelector((state: RootState) => state.invoices);
  const [searchTerm, setSearchTerm] = useState('');

  const userProducts = isAdmin ? products : products.filter(p => p.storeId === user?.storeId);
  const userInvoices = isAdmin ? invoices : invoices.filter(i => i.storeId === user?.storeId);
  
  const filteredProducts = userProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (product: any) => {
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
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const newInvoice = {
      id: `INV-${Date.now()}`,
      items: [...cart],
      total: cartTotal,
      date: new Date().toISOString().split('T')[0],
      storeId: user?.storeId || '1',
      storeName: user?.storeName || 'Downtown Store'
    };

    dispatch(addInvoice(newInvoice));
    dispatch(clearCart());
    toast.success('Invoice created successfully');
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
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
                          product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
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

        {/* Cart */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
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
                        <span className="w-8 text-center">{item.quantity}</span>
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
                  
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                      onClick={handleCreateInvoice}
                    >
                      Create Invoice
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full mt-2"
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
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                {isAdmin && <TableHead>Store</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userInvoices.slice(0, 10).map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.items.length} items</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
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
