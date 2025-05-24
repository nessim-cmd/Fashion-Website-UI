import { api } from "@/utils/api";

export const productService = {
  // Get all products with filtering
  getProducts: async (filters = {}) => {
    try {
      return await api.getProducts(filters);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id: string) => {
    try {
      return await api.getProductById(id);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Get product by slug
  getProductBySlug: async (slug: string) => {
    try {
      return await api.getProductBySlug(slug);
    } catch (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      return await api.getFeaturedProducts();
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      return await api.getCategories();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    try {
      return await api.getCategoryBySlug(slug);
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  }
};
