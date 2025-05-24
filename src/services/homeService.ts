import { api } from "@/utils/api";

export const homeService = {
  // Get banners
  getBanners: async () => {
    try {
      return await api.getBanners();
    } catch (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }
  },

  // Get special offers
  getSpecialOffers: async () => {
    try {
      return await api.getSpecialOffers();
    } catch (error) {
      console.error("Error fetching special offers:", error);
      throw error;
    }
  }
};
