/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Product, Category, Subcategory, SubSubcategory } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Search, SlidersHorizontal, LayoutGrid, LayoutList, Loader2, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent 
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { apiClient } from "@/contexts/AuthContext"; // Import API client
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the expected API response structure for products
interface ProductsApiResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ProductsPage = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const queryParams = new URLSearchParams(location.search);

  // State for fetched data
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for filtering and sorting
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const [categoryId, setCategoryId] = useState<string | null>(queryParams.get("category") || null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(queryParams.get("subcategory") || null);
  const [subSubcategoryId, setSubSubcategoryId] = useState<string | null>(queryParams.get("subSubcategory") || null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]); // Adjust max based on actual data?
  const [sortBy, setSortBy] = useState(queryParams.get("sort") || "featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch initial data (products and categories)
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get<ProductsApiResponse>("/products"), // Expect the object structure
        apiClient.get<Category[]>("/categories")
      ]);
      
      // Validate and extract the products array
      if (productsRes.data && Array.isArray(productsRes.data.products)) {
        setAllProducts(productsRes.data.products);
        setFilteredProducts(productsRes.data.products); // Initialize filtered products
      } else {
        console.error("Invalid products data received:", productsRes.data);
        setAllProducts([]);
        setFilteredProducts([]);
        setError("Received invalid product data format.");
      }

      // Validate and set categories
      if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
        setAllCategories(categoriesRes.data);
      } else {
        console.error("Invalid categories data received:", categoriesRes.data);
        setAllCategories([]);
        // Optionally set an error if categories are crucial
      }

    } catch (err: any) {
      console.error("Failed to fetch products or categories:", err);
      setError(err.response?.data?.message || err.message || "Failed to load data. Please try again later.");
      setAllProducts([]); // Clear data on error
      setFilteredProducts([]);
      setAllCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived state for available options based on selection (using fetched categories)
  const availableSubcategories = useMemo(() => {
    if (!categoryId || !allCategories) return [];
    const category = allCategories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  }, [categoryId, allCategories]);

  const availableSubSubcategories = useMemo(() => {
    if (!subcategoryId || !allCategories) return [];
    const category = allCategories.find(cat => cat.id === categoryId);
    const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);
    return subcategory?.subSubcategories || [];
  }, [categoryId, subcategoryId, allCategories]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    // Don't filter until initial data is loaded and valid
    if (isLoading || !Array.isArray(allProducts)) return;

    let filtered = [...allProducts];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Hierarchical category filter
    if (subSubcategoryId) {
      filtered = filtered.filter((product) => product.subSubcategoryId === subSubcategoryId);
    } else if (subcategoryId) {
      filtered = filtered.filter((product) => product.subcategoryId === subcategoryId);
    } else if (categoryId) {
      filtered = filtered.filter((product) => product.categoryId === categoryId);
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => {
        const price = product.salePrice ?? product.price; // Use nullish coalescing
        return price >= priceRange[0] && price <= priceRange[1];
      }
    );

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // On sale filter
    if (onSaleOnly) {
      filtered = filtered.filter((product) => 
        product.salePrice !== null && 
        product.salePrice !== undefined && 
        product.salePrice < product.price
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = a.salePrice ?? a.price;
          const priceB = b.salePrice ?? b.price;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = a.salePrice ?? a.price;
          const priceB = b.salePrice ?? b.price;
          return priceB - priceA;
        });
        break;
      case "newest":
        filtered.sort((a, b) => 
          (b.createdAt && a.createdAt) 
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() 
            : Number(b.id) - Number(a.id)
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
    }

    // Update active filters list (using fetched categories)
    const newActiveFilters: string[] = [];
    if (searchTerm) newActiveFilters.push(`Search: ${searchTerm}`);
    
    if (subSubcategoryId) {
      const category = allCategories.find(cat => cat.id === categoryId);
      const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);
      const subSubcategory = subcategory?.subSubcategories?.find(sub => sub.id === subSubcategoryId);
      if (category && subcategory && subSubcategory) {
        newActiveFilters.push(`Category: ${category.name} > ${subcategory.name} > ${subSubcategory.name}`);
      }
    } else if (subcategoryId) {
      const category = allCategories.find(cat => cat.id === categoryId);
      const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);
      if (category && subcategory) {
        newActiveFilters.push(`Category: ${category.name} > ${subcategory.name}`);
      }
    } else if (categoryId) {
      const category = allCategories.find(cat => cat.id === categoryId);
      if (category) newActiveFilters.push(`Category: ${category.name}`);
    }
    
    const maxPriceInData = Math.max(...allProducts.map(p => p.salePrice ?? p.price), 0);
    if (priceRange[0] > 0 || priceRange[1] < 2000) { 
      newActiveFilters.push(`Price: $${priceRange[0]} - $${priceRange[1]}`);
    }
    if (inStockOnly) newActiveFilters.push("In Stock Only");
    if (onSaleOnly) newActiveFilters.push("On Sale");

    setActiveFilters(newActiveFilters);
    setFilteredProducts(filtered);
  }, [
    searchTerm, 
    categoryId, 
    subcategoryId, 
    subSubcategoryId, 
    priceRange, 
    inStockOnly, 
    onSaleOnly, 
    sortBy, 
    allProducts, 
    allCategories, 
    isLoading
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryId(null);
    setSubcategoryId(null);
    setSubSubcategoryId(null);
    setPriceRange([0, 2000]);
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      setSearchTerm("");
    } else if (filter.startsWith("Category:")) {
      if (filter.includes(">")) {
        const levels = filter.split(">").length - 1;
        if (levels === 2) setSubSubcategoryId(null);
        else if (levels === 1) {
          setSubcategoryId(null);
          setSubSubcategoryId(null);
        }
      } else {
        setCategoryId(null);
        setSubcategoryId(null);
        setSubSubcategoryId(null);
      }
    } else if (filter.startsWith("Price:")) {
      setPriceRange([0, 2000]);
    } else if (filter === "In Stock Only") {
      setInStockOnly(false);
    } else if (filter === "On Sale") {
      setOnSaleOnly(false);
    }
  };

  // Function to render hierarchical category filters
  const renderCategoryFilters = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Categories</h3>
      <Select
        value={categoryId || "all"}
        onValueChange={(value) => {
          setCategoryId(value === "all" ? null : value);
          setSubcategoryId(null);
          setSubSubcategoryId(null);
        }}
        disabled={isLoading || !Array.isArray(allCategories) || allCategories.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {Array.isArray(allCategories) && allCategories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {categoryId && availableSubcategories.length > 0 && (
        <div className="ml-4 border-l-2 border-gray-200 pl-4">
          <h4 className="text-md font-medium mb-2">Subcategories</h4>
          <Select
            value={subcategoryId || "all"}
            onValueChange={(value) => {
              setSubcategoryId(value === "all" ? null : value);
              setSubSubcategoryId(null);
            }}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {availableSubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {categoryId && subcategoryId && availableSubSubcategories.length > 0 && (
        <div className="ml-8 border-l-2 border-gray-200 pl-4">
          <h4 className="text-md font-medium mb-2">Specific Types</h4>
          <Select
            value={subSubcategoryId || "all"}
            onValueChange={(value) => {
              setSubSubcategoryId(value === "all" ? null : value);
            }}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {availableSubSubcategories.map((subSubcategory) => (
                <SelectItem key={subSubcategory.id} value={subSubcategory.id}>
                  {subSubcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  // Function to render all filter components
  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search fashion items..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {renderCategoryFilters()}

      <div>
        <h3 className="text-lg font-medium mb-3">Price Range</h3>
        <Slider 
          min={0} 
          max={2000}
          step={10}
          value={priceRange}
          onValueChange={(value: [number, number]) => setPriceRange(value)}
          className="mb-2"
          disabled={isLoading}
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
            disabled={isLoading}
          />
          <Label htmlFor="inStock">In Stock Only</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="onSale" 
            checked={onSaleOnly} 
            onCheckedChange={(checked) => setOnSaleOnly(checked as boolean)} 
            disabled={isLoading}
          />
          <Label htmlFor="onSale">On Sale</Label>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={clearFilters}
        disabled={isLoading}
      >
        Clear Filters
      </Button>
    </div>
  );

  // Function to render loading skeletons
  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={`skel-${index}`} className="space-y-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ));
  };

  // Function to render products based on view mode
  const renderProducts = () => {
    // Handle loading state
    if (isLoading) {
      if (viewMode === "grid") {
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {renderSkeletons(8)} 
          </div>
        );
      } else {
        return (
          <div className="flex flex-col space-y-4">
            {renderSkeletons(4)} 
          </div>
        );
      }
    }

    // Handle error state after loading
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Products</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    // Defensive check: Ensure filteredProducts is an array before mapping
    if (!Array.isArray(filteredProducts)) {
      console.error("filteredProducts is not an array:", filteredProducts);
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Error</AlertTitle>
          <AlertDescription>
            Could not display products. Received unexpected data format.
          </AlertDescription>
        </Alert>
      );
    }

    // Handle empty state after loading and filtering
    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filter criteria.
          </p>
          <Button variant="link" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      );
    }

    // Render products grid or list
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="list" />
          ))}
        </div>
      );
    }
  };

  // Main component return
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Fashion Collection</h1>

      {/* Active filters display */}
      {!isLoading && activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            {activeFilters.map((filter) => (
              <Badge 
                key={filter} 
                variant="secondary" 
                className="flex items-center gap-1 px-3 py-1"
              >
                {filter}
                <button 
                  onClick={() => removeFilter(filter)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5 text-xs"
                  aria-label={`Remove filter: ${filter}`}
                >
                  ✕
                </button>
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Main layout: Filters sidebar + Products area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar / mobile sheet */}
        <div className="w-full lg:w-1/4 xl:w-1/5">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-start mb-4">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {renderFilters()}
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="hidden lg:block">
              {renderFilters()}
            </div>
          )}
        </div>

        {/* Products grid/list area */}
        <div className="flex-1">
          {/* Sort and view controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span>Showing {Array.isArray(filteredProducts) ? filteredProducts.length : 0} of {Array.isArray(allProducts) ? allProducts.length : 0} products</span>
              )}
            </div>

            <div className="flex gap-3 items-center">
              {/* View mode toggle */}
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")} disabled={isLoading}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <LayoutList className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Render products, skeletons, or error message */}
          {renderProducts()}

          {/* TODO: Add Pagination if needed */}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

