
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Users as UsersIcon, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([
    { id: '1', username: 'admin', role: 'Admin', storeId: '', storeName: 'All Stores', status: 'Active' },
    { id: '2', username: 'store1', role: 'StoreUser', storeId: '1', storeName: 'Downtown Store', status: 'Active' },
    { id: '3', username: 'store2', role: 'StoreUser', storeId: '2', storeName: 'Mall Store', status: 'Active' },
    { id: '4', username: 'john_doe', role: 'StoreUser', storeId: '1', storeName: 'Downtown Store', status: 'Inactive' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'StoreUser',
    storeId: '',
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
    
    const userData = {
      id: editingUser?.id || Date.now().toString(),
      username: formData.username,
      role: formData.role as 'Admin' | 'StoreUser',
      storeId: formData.role === 'Admin' ? '' : formData.storeId,
      storeName: formData.role === 'Admin' 
        ? 'All Stores' 
        : formData.storeId === '1' 
          ? 'Downtown Store' 
          : 'Mall Store',
      status: 'Active',
    };

    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? userData : user
      ));
      toast.success('User updated successfully');
    } else {
      setUsers([...users, userData]);
      toast.success('User added successfully');
    }

    resetForm();
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      storeId: user.storeId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
    toast.success('User status updated');
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'StoreUser',
      storeId: '',
    });
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const activeUsers = users.filter(user => user.status === 'Active').length;
  const adminUsers = users.filter(user => user.role === 'Admin').length;
  const storeUsers = users.filter(user => user.role === 'StoreUser').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setEditingUser(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                  required={!editingUser}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="StoreUser">Store User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              {formData.role === 'StoreUser' && (
                <div>
                  <Label htmlFor="storeId">Assigned Store</Label>
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
                  {editingUser ? 'Update' : 'Add'} User
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">{activeUsers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">Admin accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeUsers}</div>
            <p className="text-xs text-muted-foreground">Store accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Store</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.storeName}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={user.role === 'Admin' && adminUsers === 1}
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

export default Users;
