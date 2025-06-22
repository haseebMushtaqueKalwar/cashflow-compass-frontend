
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { addProduct, updateProduct, deleteProduct, setSearchTerm, setSelectedStore } from '../../store/slices/productsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();
  const { products, searchTerm, selectedStore } = useSelector((state: RootState) => state.products);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    storeId: user?.storeId || '',
  });

  // Filter products based on user role and search/filter criteria
  const filteredProducts = products.filter(product => {
    const matchesRole = isAdmin ? true : product.storeId === user?.storeId;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = selectedStore ? product.storeId === selectedStore : true;
    
    return matchesRole && matchesSearch && matchesStore;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      storeId: formData.storeId,
      storeName: formData.storeId === '1' ? 'Downtown Store' : 'Mall Store',
    };

    if (editingProduct) {
      dispatch(updateProduct(productData));
      toast.success('Product updated successfully');
    } else {
      dispatch(addProduct(productData));
      toast.success('Product added successfully');
    }

    resetForm();
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      storeId: product.storeId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
      toast.success('Product deleted successfully');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: '',
      storeId: user?.storeId || '',
    });
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">
            {isAdmin ? 'Manage products across all stores' : `Manage products for ${user?.storeName}`}
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setEditingProduct(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
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
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              {isAdmin && (
                <div>
                  <Label htmlFor="storeId">Store</Label>
                  <select
                    id="storeId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    required
                  >
                    <option value="">Select Store</option>
                    <option value="1">Downtown Store</option>
                    <option value="2">Mall Store</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            {isAdmin && (
              <div className="sm:w-48">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedStore}
                  onChange={(e) => dispatch(setSelectedStore(e.target.value))}
                >
                  <option value="">All Stores</option>
                  <option value="1">Downtown Store</option>
                  <option value="2">Mall Store</option>
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                {isAdmin && <TableHead>Store</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock < 10 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock} units
                    </span>
                  </TableCell>
                  {isAdmin && <TableCell>{product.storeName}</TableCell>}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
