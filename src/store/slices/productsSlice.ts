
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  storeId: string;
  storeName: string;
  category: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  searchTerm: string;
  selectedStore: string;
}

const initialState: ProductsState = {
  products: [
    { id: '1', name: 'Laptop', price: 999.99, stock: 10, storeId: '1', storeName: 'Downtown Store', category: 'Electronics' },
    { id: '2', name: 'Mouse', price: 29.99, stock: 50, storeId: '1', storeName: 'Downtown Store', category: 'Electronics' },
    { id: '3', name: 'Keyboard', price: 79.99, stock: 25, storeId: '2', storeName: 'Mall Store', category: 'Electronics' },
    { id: '4', name: 'Monitor', price: 299.99, stock: 15, storeId: '1', storeName: 'Downtown Store', category: 'Electronics' },
  ],
  loading: false,
  searchTerm: '',
  selectedStore: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedStore: (state, action: PayloadAction<string>) => {
      state.selectedStore = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct, setSearchTerm, setSelectedStore, setLoading } = productsSlice.actions;
export default productsSlice.reducer;
