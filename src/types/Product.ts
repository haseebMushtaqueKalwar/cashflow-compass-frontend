
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  storeId: string;
  storeName: string;
}

export interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  category: string;
  storeId: string;
}

export interface ProductFilters {
  searchTerm: string;
  selectedStore: string;
}
