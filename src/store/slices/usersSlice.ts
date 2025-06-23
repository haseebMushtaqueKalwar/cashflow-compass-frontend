
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  storeId?: string;
  storeName?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: [
    { 
      id: '1', 
      username: 'John Doe', 
      email: 'john@store.com', 
      role: 'Store Manager', 
      storeId: '1', 
      storeName: 'Downtown Store',
      status: 'Active',
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      username: 'Jane Smith', 
      email: 'jane@store.com', 
      role: 'Store Manager', 
      storeId: '2', 
      storeName: 'Mall Store',
      status: 'Active',
      createdAt: '2024-01-20'
    },
    { 
      id: '3', 
      username: 'Mike Johnson', 
      email: 'mike@store.com', 
      role: 'Team Lead', 
      storeId: '1', 
      storeName: 'Downtown Store',
      status: 'Active',
      createdAt: '2024-02-01'
    },
    { 
      id: '4', 
      username: 'Sarah Wilson', 
      email: 'sarah@store.com', 
      role: 'Senior Staff', 
      storeId: '2', 
      storeName: 'Mall Store',
      status: 'Active',
      createdAt: '2024-02-05'
    },
    { 
      id: '5', 
      username: 'Admin User', 
      email: 'admin@company.com', 
      role: 'Admin', 
      status: 'Active',
      createdAt: '2024-01-01'
    },
  ],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
