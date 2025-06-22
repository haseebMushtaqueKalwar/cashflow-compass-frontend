
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash, Edit } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  storeId: string;
  storeName: string;
  category: string;
}

const ProductManagement = () => {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock data
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Espresso Coffee', price: 3.50, stock: 120, storeId: '1', storeName: 'Downtown Store', category: 'Beverages' },
    { id: '2', name: 'Croissant', price: 2.80, stock: 45, storeId: '1', storeName: 'Downtown Store', category: 'Bakery' },
    { id: '3', name: 'Cappuccino', price: 4.20, stock: 80, storeId: '2', storeName: 'Mall Store', category: 'Beverages' },
    { id: '4', name: 'Sandwich', price: 6.50, stock: 30, storeId: '1', storeName: 'Downtown Store', category: 'Food' },
    { id: '5', name: 'Orange Juice', price: 3.00, stock: 25, storeId: '2', storeName: 'Mall Store', category: 'Beverages' },
  ]);

  const stores = [
    { id: '1', name: 'Downtown Store' },
    { id: '2', name: 'Mall Store' },
    { id: '3', name: 'Airport Store' },
  ];

  const categories = ['Beverages', 'Food', 'Bakery', 'Snacks'];

  // Filter products based on user role and search
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = isAdmin ? 
      (selectedStore === 'all' || product.storeId === selectedStore) : 
      product.storeId === user?.storeId;
    
    return matchesSearch && matchesStore;
  });

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
    setIsAddModalOpen(false);
  };

  const handleUpdateProduct = (productData: Product) => {
    setProducts(products.map(p => p.id === productData.id ? productData : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock <= 10) return 'bg-red-100 text-red-800';
    if (stock <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your inventory and product catalog</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product in your inventory</DialogDescription>
            </DialogHeader>
            <ProductForm 
              onSubmit={handleAddProduct}
              stores={stores}
              categories={categories}
              userStoreId={user?.storeId}
              isAdmin={isAdmin}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {isAdmin && (
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                  {isAdmin && (
                    <p className="text-sm text-gray-500 mt-1">{product.storeName}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingProduct(product)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge className={getStockBadgeColor(product.stock)}>
                    {product.stock} in stock
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Product Modal */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm 
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              stores={stores}
              categories={categories}
              userStoreId={user?.storeId}
              isAdmin={isAdmin}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Product Form Component
interface ProductFormProps {
  product?: Product;
  onSubmit: (product: any) => void;
  stores: { id: string; name: string }[];
  categories: string[];
  userStoreId?: string;
  isAdmin: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSubmit, 
  stores, 
  categories, 
  userStoreId, 
  isAdmin 
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    storeId: product?.storeId || userStoreId || '',
    category: product?.category || categories[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStore = stores.find(s => s.id === formData.storeId);
    onSubmit({
      ...product,
      ...formData,
      storeName: selectedStore?.name || '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isAdmin && (
        <div>
          <Label htmlFor="store">Store</Label>
          <Select value={formData.storeId} onValueChange={(value) => setFormData({ ...formData, storeId: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stores.map(store => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full">
        {product ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
};

export default ProductManagement;
