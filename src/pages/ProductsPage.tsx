
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { products, categories } from "@/lib/data";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const ProductsPage = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const queryParams = new URLSearchParams(location.search);

  // States for filtering
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const [categoryId, setCategoryId] = useState<string | null>(queryParams.get("category") || null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState(queryParams.get("sort") || "featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryId) {
      filtered = filtered.filter((product) => product.categoryId === categoryId);
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => {
        const price = product.salePrice || product.price;
        return price >= priceRange[0] && price <= priceRange[1];
      }
    );

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // On sale filter
    if (onSaleOnly) {
      filtered = filtered.filter((product) => product.salePrice !== null);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
        break;
      case "newest":
        // In a real app, this would sort by creation date
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
    }

    // Update active filters list
    const newActiveFilters: string[] = [];
    if (searchTerm) newActiveFilters.push(`Search: ${searchTerm}`);
    if (categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) newActiveFilters.push(`Category: ${category.name}`);
    }
    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      newActiveFilters.push(`Price: $${priceRange[0]} - $${priceRange[1]}`);
    }
    if (inStockOnly) newActiveFilters.push("In Stock Only");
    if (onSaleOnly) newActiveFilters.push("On Sale");

    setActiveFilters(newActiveFilters);
    setFilteredProducts(filtered);
  }, [searchTerm, categoryId, priceRange, inStockOnly, onSaleOnly, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryId(null);
    setPriceRange([0, 2000]);
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      setSearchTerm("");
    } else if (filter.startsWith("Category:")) {
      setCategoryId(null);
    } else if (filter.startsWith("Price:")) {
      setPriceRange([0, 2000]);
    } else if (filter === "In Stock Only") {
      setInStockOnly(false);
    } else if (filter === "On Sale") {
      setOnSaleOnly(false);
    }
  };

  // Function to render filter components
  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Categories</h3>
        <Select
          value={categoryId || "all"}
          onValueChange={(value) => setCategoryId(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Price Range</h3>
        <Slider 
          min={0} 
          max={2000} 
          step={10}
          value={priceRange}
          // Fix the TypeScript error by using a properly typed callback
          onValueChange={(value: [number, number]) => setPriceRange(value)}
          className="mb-2"
        />
        <div className="flex justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-3">Filter By</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="inStock" 
            checked={inStockOnly} 
            onCheckedChange={(checked) => setInStockOnly(checked as boolean)} 
          />
          <Label htmlFor="inStock">In Stock Only</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="onSale" 
            checked={onSaleOnly} 
            onCheckedChange={(checked) => setOnSaleOnly(checked as boolean)} 
          />
          <Label htmlFor="onSale">On Sale</Label>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge 
                key={filter} 
                variant="secondary" 
                className="flex items-center gap-1 px-3 py-1"
              >
                {filter}
                <button 
                  onClick={() => removeFilter(filter)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  ✕
                </button>
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-7"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="w-full lg:w-64 hidden lg:block">
          {renderFilters()}
        </div>

        {/* Products grid */}
        <div className="flex-1">
          {/* Sort and filter controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Showing {filteredProducts.length} products
            </div>

            <div className="flex gap-3 items-center">
              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile filter button */}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <SlidersHorizontal className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    {renderFilters()}
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
