import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { addProduct, updateProduct, deleteProduct, setSearchTerm, setSelectedStore } from '../../store/slices/productsSlice';
import { addCategory } from '../../store/slices/categoriesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import toast from 'react-hot-toast';
import CategoryManager from '../modals/CategoryManager';

const Products = () => {
  const dispatch = useDispatch();
  const { user, isAdmin } = useAuth();
  const { products, searchTerm, selectedStore, loading } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    storeId: user?.storeId || '',
  });
  const [errors, setErrors] = useState<any>({});

  // Filter products based on user role and search/filter criteria
  const filteredProducts = products.filter(product => {
    const matchesRole = isAdmin ? true : product.storeId === user?.storeId;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = selectedStore ? product.storeId === selectedStore : true;
    
    return matchesRole && matchesSearch && matchesStore;
  });

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (isAdmin && !formData.storeId) newErrors.storeId = 'Store selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const productData = {
      id: editingProduct?.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      storeId: isAdmin ? formData.storeId : user?.storeId || '1',
      storeName: (isAdmin ? formData.storeId : user?.storeId) === '1' ? 'Downtown Store' : 'Mall Store',
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

  const handleCategoryChange = (value: string) => {
    if (value === 'add_new') {
      setShowNewCategoryInput(true);
      setFormData({ ...formData, category: '' });
    } else {
      setFormData({ ...formData, category: value });
      setShowNewCategoryInput(false);
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const categoryData = {
        id: Date.now().toString(),
        name: newCategory.trim(),
        description: `Category: ${newCategory.trim()}`,
      };
      
      dispatch(addCategory(categoryData));
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowNewCategoryInput(false);
      toast.success('New category added');
    }
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
    setErrors({});
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
    setErrors({});
    setShowNewCategoryInput(false);
    setNewCategory('');
    setIsModalOpen(false);
  };

  return (
    <LoadingOverlay isLoading={loading} text="Loading products...">
      <div className="space-y-4 md:space-y-6 p-2 md:p-4 lg:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
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
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className={errors.stock ? 'border-red-500' : ''}
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  {!showNewCategoryInput ? (
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="add_new">+ Add New Category</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                      <Button type="button" size="sm" onClick={handleAddNewCategory}>
                        Add
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setShowNewCategoryInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                
                {isAdmin && (
                  <div>
                    <Label htmlFor="storeId">Store *</Label>
                    <Select value={formData.storeId} onValueChange={(value) => setFormData({ ...formData, storeId: value })}>
                      <SelectTrigger className={errors.storeId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select Store" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Downtown Store</SelectItem>
                        <SelectItem value="2">Mall Store</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.storeId && <p className="text-red-500 text-xs mt-1">{errors.storeId}</p>}
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
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

        {/* Category Management Section */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Category Management</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryManager />
          </CardContent>
        </Card>

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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          <CardContent className="overflow-x-auto">
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
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
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
    </LoadingOverlay>
  );
};

export default Products;
