
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Invoice {
  id: string;
  customerName?: string;
  items: CartItem[];
  total: number;
  date: string;
  time?: string;
  storeId: string;
  storeName: string;
}

interface InvoicesState {
  cart: CartItem[];
  invoices: Invoice[];
  loading: boolean;
}

const initialState: InvoicesState = {
  cart: [],
  invoices: [
    {
      id: 'INV-20240115-001',
      customerName: 'John Smith',
      items: [{ id: '1', name: 'Laptop', price: 999.99, quantity: 1 }],
      total: 999.99,
      date: '2024-01-15',
      time: '14:30:00',
      storeId: '1',
      storeName: 'Downtown Store'
    },
    {
      id: 'INV-20240116-002',
      customerName: 'Jane Doe',
      items: [
        { id: '2', name: 'Mouse', price: 29.99, quantity: 2 },
        { id: '3', name: 'Keyboard', price: 79.99, quantity: 1 }
      ],
      total: 139.97,
      date: '2024-01-16',
      time: '10:15:00',
      storeId: '2',
      storeName: 'Mall Store'
    }
  ],
  loading: false,
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    updateCartQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.cart.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart, addInvoice, setLoading } = invoicesSlice.actions;
export default invoicesSlice.reducer;
