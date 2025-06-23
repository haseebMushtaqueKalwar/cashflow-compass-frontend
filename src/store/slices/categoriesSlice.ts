
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: [
    { id: '1', name: 'Electronics', description: 'Electronic devices and accessories' },
    { id: '2', name: 'Accessories', description: 'Computer and device accessories' },
    { id: '3', name: 'Software', description: 'Software licenses and applications' },
    { id: '4', name: 'Hardware', description: 'Computer hardware components' },
    { id: '5', name: 'Office Supplies', description: 'Office and business supplies' },
    { id: '6', name: 'Mobile Devices', description: 'Smartphones and tablets' },
    { id: '7', name: 'Gaming', description: 'Gaming devices and accessories' },
    { id: '8', name: 'Audio & Video', description: 'Audio and video equipment' },
  ],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
