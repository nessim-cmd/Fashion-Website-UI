/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/utils/api";

export const orderService = {
  // Get user orders
  getUserOrders: async () => {
    try {
      return await api.getOrders();
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    try {
      return await api.getOrderById(id);
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData: any) => {
    try {
      return await api.createOrder(orderData);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Validate coupon
  validateCoupon: async (code: string) => {
    try {
      return await api.validateCoupon(code);
    } catch (error) {
      console.error(`Error validating coupon ${code}:`, error);
      throw error;
    }
  }
};
