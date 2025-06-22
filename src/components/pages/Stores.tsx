
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Stores = () => {
  const { isAdmin } = useAuth();
  const [stores, setStores] = useState([
    { id: '1', name: 'Downtown Store', address: '123 Main St, Downtown', manager: 'John Doe', users: 3, status: 'Active' },
    { id: '2', name: 'Mall Store', address: '456 Mall Ave, Shopping Center', manager: 'Jane Smith', users: 2, status: 'Active' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    manager: '',
  });

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storeData = {
      id: editingStore?.id || Date.now().toString(),
      name: formData.name,
      address: formData.address,
      manager: formData.manager,
      users: editingStore?.users || 0,
      status: 'Active',
    };

    if (editingStore) {
      setStores(stores.map(store => 
        store.id === editingStore.id ? storeData : store
      ));
      toast.success('Store updated successfully');
    } else {
      setStores([...stores, storeData]);
      toast.success('Store added successfully');
    }

    resetForm();
  };

  const handleEdit = (store: any) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      manager: store.manager,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      setStores(stores.filter(store => store.id !== id));
      toast.success('Store deleted successfully');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      manager: '',
    });
    setEditingStore(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600">Manage all store locations and settings</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setEditingStore(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStore ? 'Edit Store' : 'Add New Store'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingStore ? 'Update' : 'Add'} Store
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stores.reduce((sum, store) => sum + store.users, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Users/Store</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stores.length > 0 ? Math.round(stores.reduce((sum, store) => sum + store.users, 0) / stores.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Users per location</p>
          </CardContent>
        </Card>
      </div>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Store List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>{store.manager}</TableCell>
                  <TableCell>{store.users}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {store.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(store)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(store.id)}
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

export default Stores;
