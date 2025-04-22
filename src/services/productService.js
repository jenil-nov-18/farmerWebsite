import { validateProduct, validateQuantity } from '@/lib/validation';
import { toast } from 'sonner';

const API_BASE_URL = 'https://backendfarmer-6xty.onrender.com';

class ProductService {
  static async getProducts(category = '', searchQuery = '') {
    try {
      const queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (searchQuery) queryParams.append('search', searchQuery);

      const response = await fetch(
        `${API_BASE_URL}/products?${queryParams.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }

      const products = await response.json();
      // Validate each product
      return products.filter(product => {
        const validation = validateProduct(product);
        if (!validation.isValid) {
          console.error('Invalid product data:', product.id, validation.errors);
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Product service error:', error);
      throw error;
    }
  }

  static async getProduct(productId) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await fetch(`${API_BASE_URL}/products/${productId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch product');
      }

      const product = await response.json();
      const validation = validateProduct(product);
      
      if (!validation.isValid) {
        console.error('Invalid product data:', validation.errors);
        throw new Error('Invalid product data received from server');
      }

      return product;
    } catch (error) {
      console.error('Product fetch error:', error);
      throw error;
    }
  }

  static async createProduct(productData) {
    try {
      const validation = validateProduct(productData);
      if (!validation.isValid) {
        Object.values(validation.errors).forEach(error => toast.error(error));
        throw new Error('Invalid product data');
      }

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      return await response.json();
    } catch (error) {
      console.error('Product creation error:', error);
      throw error;
    }
  }

  static async updateProduct(productId, updates) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      // Validate updates
      const validation = validateProduct({ id: productId, ...updates });
      if (!validation.isValid) {
        Object.values(validation.errors).forEach(error => toast.error(error));
        throw new Error('Invalid product update data');
      }

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      return await response.json();
    } catch (error) {
      console.error('Product update error:', error);
      throw error;
    }
  }

  static async updateStock(productId, quantity) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      if (!validateQuantity(quantity)) {
        throw new Error('Invalid quantity');
      }

      const response = await fetch(`${API_BASE_URL}/products/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update stock');
      }

      return await response.json();
    } catch (error) {
      console.error('Stock update error:', error);
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      return true;
    } catch (error) {
      console.error('Product deletion error:', error);
      throw error;
    }
  }

  static validateStock(product, requestedQuantity) {
    try {
      if (!validateQuantity(requestedQuantity)) {
        return false;
      }

      const validation = validateProduct(product);
      if (!validation.isValid) {
        return false;
      }

      return product.stockQuantity >= requestedQuantity;
    } catch (error) {
      console.error('Stock validation error:', error);
      return false;
    }
  }
}

export default ProductService;