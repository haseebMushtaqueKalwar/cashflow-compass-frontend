
import { Product } from '../types/Product';

export class ProductService {
  private static instance: ProductService;
  
  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  validateProduct(product: Omit<Product, 'id'>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!product.name?.trim()) errors.push('Product name is required');
    if (!product.price || product.price <= 0) errors.push('Valid price is required');
    if (product.stock === undefined || product.stock < 0) errors.push('Valid stock quantity is required');
    if (!product.category?.trim()) errors.push('Category is required');
    if (!product.storeId?.trim()) errors.push('Store selection is required');
    
    return { isValid: errors.length === 0, errors };
  }

  generateProductId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatProductData(formData: any, isAdmin: boolean, userStoreId?: string): Product {
    const storeId = isAdmin ? formData.storeId : userStoreId || '1';
    return {
      id: formData.id || this.generateProductId(),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      storeId,
      storeName: storeId === '1' ? 'Downtown Store' : 'Mall Store',
    };
  }

  filterProducts(products: Product[], filters: {
    searchTerm?: string;
    selectedStore?: string;
    userStoreId?: string;
    isAdmin?: boolean;
  }): Product[] {
    return products.filter(product => {
      const matchesRole = filters.isAdmin ? true : product.storeId === filters.userStoreId;
      const matchesSearch = !filters.searchTerm || 
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesStore = !filters.selectedStore || product.storeId === filters.selectedStore;
      
      return matchesRole && matchesSearch && matchesStore;
    });
  }
}

export const productService = ProductService.getInstance();
