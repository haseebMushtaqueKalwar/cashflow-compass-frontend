
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateUser } from '../../store/slices/usersSlice';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, MapPin, Users, Building, User, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Stores = () => {
  const { isAdmin } = useAuth();
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.users);
  
  const [stores, setStores] = useState([
    { 
      id: '1', 
      name: 'Downtown Store', 
      address: '123 Main St, Downtown', 
      managerId: '1',
      manager: 'John Doe', 
      users: 3, 
      status: 'Active',
      revenue: 125000,
      growth: '+12%'
    },
    { 
      id: '2', 
      name: 'Mall Store', 
      address: '456 Mall Ave, Shopping Center', 
      managerId: '2',
      manager: 'Jane Smith', 
      users: 2, 
      status: 'Active',
      revenue: 98000,
      growth: '+8%'
    },
  ]);
  
  // Get available managers (users with manager/lead roles or no store assignment)
  const availableManagers = users.filter(user => 
    user.role === 'Store Manager' || 
    user.role === 'Team Lead' || 
    user.role === 'Senior Staff' ||
    !user.storeId
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    managerId: '',
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
    
    const selectedManager = availableManagers.find(m => m.id === formData.managerId);
    
    const storeData = {
      id: editingStore?.id || Date.now().toString(),
      name: formData.name,
      address: formData.address,
      managerId: formData.managerId,
      manager: selectedManager?.username || 'Unassigned',
      users: editingStore?.users || 0,
      status: 'Active',
      revenue: editingStore?.revenue || 0,
      growth: editingStore?.growth || '+0%',
    };

    // Update the user's store assignment if a manager was selected
    if (selectedManager) {
      const updatedUser = {
        ...selectedManager,
        storeId: storeData.id,
        storeName: formData.name,
        role: 'Store Manager' // Ensure they become store manager
      };
      dispatch(updateUser(updatedUser));
    }

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
      managerId: store.managerId || '',
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
      managerId: '',
    });
    setEditingStore(null);
    setIsModalOpen(false);
  };

  const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0);

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage all store locations, managers, and settings</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setEditingStore(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md mx-auto">
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
                <Label htmlFor="manager">Store Manager</Label>
                <Select value={formData.managerId} onValueChange={(value) => setFormData({ ...formData, managerId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.username} ({manager.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  This will assign the selected user as Store Manager and associate them with this store
                </p>
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

      {/* Enhanced Stats Cards with consistent theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Stores</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stores.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active locations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Revenue</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Combined stores
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stores.reduce((sum, store) => sum + store.users, 0)}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <User className="h-3 w-3 mr-1" />
              Across all stores
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Avg Staff/Store</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stores.length > 0 ? Math.round(stores.reduce((sum, store) => sum + store.users, 0) / stores.length) : 0}
            </div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Staff per location
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Stores Table */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Store Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Store Details</TableHead>
                  <TableHead className="font-medium">Manager</TableHead>
                  <TableHead className="font-medium">Performance</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{store.name}</div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {store.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{store.manager}</div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          {store.users} staff members
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-green-600">${store.revenue.toLocaleString()}</div>
                        <div className="text-sm text-green-600">{store.growth}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {store.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(store)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(store.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stores;
