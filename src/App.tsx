import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/Index";
import ShopPage from "@/pages/ProductsPage";
import ProductDetail from "@/pages/ProductDetail";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Signup";
import WishlistPage from "@/pages/WishlistPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import AdminDashboard from "@/pages/AdminDashboard";
import ProductsPage from "@/pages/admin/ProductsPage";
import ProductFormPage from "@/pages/admin/ProductFormPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import CouponsPage from "@/pages/admin/CouponsPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<ProductsPage />} />
                  <Route path="/admin/products/new" element={<ProductFormPage />} />
                  <Route path="/admin/products/edit/:id" element={<ProductFormPage />} />
                  <Route path="/admin/categories" element={<CategoriesPage />} />
                  <Route path="/admin/orders" element={<OrdersPage />} />
                  <Route path="/admin/customers" element={<CustomersPage />} />
                  <Route path="/admin/coupons" element={<CouponsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
