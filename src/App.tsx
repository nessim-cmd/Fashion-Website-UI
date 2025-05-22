import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import WishlistPage from "./pages/WishlistPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProductFormPage from "./pages/admin/ProductFormPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import CategoryFormPage from "./pages/admin/CategoryFormPage";
import AttributesPage from "./pages/admin/AttributesPage";
import OrdersPage from "./pages/admin/OrdersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import ProductsAdminPage from "./pages/admin/ProductsPage";
import CouponsPage from "./pages/admin/CouponsPage";
import BannersPage from "./pages/admin/BannersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/category/:slug" element={<ProductsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                      path="/order-confirmation/:orderId"
                      element={<OrderConfirmation />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/admin" element={<AdminDashboard />} />

                    <Route path="/admin/banners" element={<BannersPage />} />

                    <Route path="/admin/products" element={<ProductsAdminPage />} />
                    <Route path="/admin/products/new" element={<ProductFormPage />}/>
                    <Route path="/admin/products/edit/:id" element={<ProductFormPage />} />

                    <Route path="/admin/categories" element={<CategoriesPage />} />
                    <Route path="/admin/categories/new" element={<CategoryFormPage />} />
                    
                    <Route path="/admin/attributes" element={<AttributesPage />} />

                    <Route path="/admin/orders" element={<OrdersPage />} />
                    <Route path="/admin/orders/pending" element={<OrdersPage />} />
                    
                    <Route path="/admin/customers" element={<CustomersPage />} />

                    <Route path="/admin/coupons" element={<CouponsPage />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
