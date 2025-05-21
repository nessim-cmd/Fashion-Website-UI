import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, User, Menu, Search, X, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/lib/data";

const Header = () => {
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ShopHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/products" className="font-medium hover:text-primary">
            Products
          </Link>
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="font-medium hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Search, Cart, Auth */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <div className="relative group">
              <Button variant="ghost" size="sm">
                {user?.name.split(" ")[0]}
              </Button>
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 hidden group-hover:block">
                <Link to="/account">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    My Account
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    My Orders
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-16 pb-4">
              <form onSubmit={handleSearch} className="flex w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" className="ml-2">
                  Search
                </Button>
              </form>
            </SheetContent>
          </Sheet>
          
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md">
                  Home
                </Link>
                <Link to="/products" className="px-4 py-2 hover:bg-accent rounded-md">
                  Products
                </Link>
                <Link to="/wishlist" className="px-4 py-2 hover:bg-accent rounded-md">
                  Wishlist
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="px-4 py-2 hover:bg-accent rounded-md"
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t my-2"></div>
                
                {isAuthenticated ? (
                  <>
                    <Link to="/account" className="px-4 py-2 hover:bg-accent rounded-md">
                      My Account
                    </Link>
                    <Link to="/orders" className="px-4 py-2 hover:bg-accent rounded-md">
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="px-4 py-2 hover:bg-accent rounded-md">
                        Admin Dashboard
                      </Link>
                    )}
                    <Button
                      variant="destructive"
                      className="mt-4"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1">
                      <Button className="w-full">Login</Button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                      <Button variant="outline" className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
