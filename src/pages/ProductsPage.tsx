import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { products, categories } from "@/lib/data";
import { Product, Subcategory, SubSubcategory } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Search, SlidersHorizontal, LayoutGrid, LayoutList } from "lucide-react";
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
import React from "react";

const ProductsPage = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const queryParams = new URLSearchParams(location.search);

  // States for hierarchical filtering
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const [categoryId, setCategoryId] = useState<string | null>(queryParams.get("category") || null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(queryParams.get("subcategory") || null);
  const [subSubcategoryId, setSubSubcategoryId] = useState<string | null>(queryParams.get("subSubcategory") || null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState(queryParams.get("sort") || "featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // New state for view mode (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Derived state for available options based on selection
  const availableSubcategories = useMemo(() => {
    if (!categoryId) return [];
    const category = categories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  }, [categoryId]);

  const availableSubSubcategories = useMemo(() => {
    if (!subcategoryId) return [];
    const category = categories.find(cat => cat.id === categoryId);
    const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);
    return subcategory?.subSubcategories || [];
  }, [categoryId, subcategoryId]);

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
    
    if (subSubcategoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);
      const subSubcategory = subcategory?.subSubcategories?.find(sub => sub.id === subSubcategoryId);
      if (category && subcategory && subSubcategory) {
        newActiveFilters.push(`Category: ${category.name} > ${subcategory.name} > ${subSubcategory.name}`);
      }
    } else if (subcategoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);
      if (category && subcategory) {
        newActiveFilters.push(`Category: ${category.name} > ${subcategory.name}`);
      }
    } else if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) newActiveFilters.push(`Category: ${category.name}`);
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      newActiveFilters.push(`Price: $${priceRange[0]} - $${priceRange[1]}`);
    }
    if (inStockOnly) newActiveFilters.push("In Stock Only");
    if (onSaleOnly) newActiveFilters.push("On Sale");

    setActiveFilters(newActiveFilters);
    setFilteredProducts(filtered);
  }, [searchTerm, categoryId, subcategoryId, subSubcategoryId, priceRange, inStockOnly, onSaleOnly, sortBy]);

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
      // Handle hierarchical category removal
      if (filter.includes(">")) {
        const levels = filter.split(">").length - 1;
        if (levels === 2) {
          // It's a sub-subcategory filter
          setSubSubcategoryId(null);
        } else if (levels === 1) {
          // It's a subcategory filter
          setSubcategoryId(null);
          setSubSubcategoryId(null);
        }
      } else {
        // It's just a category filter
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
      
      {/* Main categories dropdown */}
      <Select
        value={categoryId || "all"}
        onValueChange={(value) => {
          setCategoryId(value === "all" ? null : value);
          setSubcategoryId(null);
          setSubSubcategoryId(null);
        }}
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

      {/* Subcategories - only show if a category is selected */}
      {categoryId && availableSubcategories.length > 0 && (
        <div className="ml-4 border-l-2 border-gray-200 pl-4">
          <h4 className="text-md font-medium mb-2">Subcategories</h4>
          <Select
            value={subcategoryId || "all"}
            onValueChange={(value) => {
              setSubcategoryId(value === "all" ? null : value);
              setSubSubcategoryId(null);
            }}
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

      {/* Sub-Subcategories - only show if both category and subcategory are selected */}
      {categoryId && subcategoryId && availableSubSubcategories.length > 0 && (
        <div className="ml-8 border-l-2 border-gray-200 pl-4">
          <h4 className="text-md font-medium mb-2">Specific Types</h4>
          <Select
            value={subSubcategoryId || "all"}
            onValueChange={(value) => {
              setSubSubcategoryId(value === "all" ? null : value);
            }}
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
          />
        </div>
      </div>

      {/* Hierarchical Category Filters */}
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

  // Function to render products based on view mode
  const renderProducts = () => {
    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      );
    }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Fashion Collection</h1>

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
              {/* View mode toggle */}
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <LayoutList className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

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

          {/* Products grid or list */}
          {renderProducts()}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
