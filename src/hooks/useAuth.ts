
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction, loadUserFromStorage } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const login = async (username: string, password: string) => {
    dispatch(loginStart());
    
    try {
      // Mock login - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = [
        { id: '1', username: 'admin', password: 'admin123', role: 'Admin' as const },
        { id: '2', username: 'store1', password: 'store123', role: 'StoreUser' as const, storeId: '1', storeName: 'Downtown Store' },
        { id: '3', username: 'store2', password: 'store123', role: 'StoreUser' as const, storeId: '2', storeName: 'Mall Store' }
      ];

      const foundUser = mockUsers.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        const token = `mock-jwt-token-${Date.now()}`;
        
        dispatch(loginSuccess({ user: userWithoutPassword, token }));
        toast.success('Login successful!');
        return true;
      } else {
        dispatch(loginFailure());
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error) {
      dispatch(loginFailure());
      toast.error('Login failed');
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    toast.success('Logged out successfully');
  };

  const initializeAuth = () => {
    dispatch(loadUserFromStorage());
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    initializeAuth,
    isAdmin: user?.role === 'Admin'
  };
};
