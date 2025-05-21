
import { Link } from "react-router-dom";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ product, featured = false, viewMode = "grid" }: ProductCardProps) => {
  const { addItem } = useCart();

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  if (viewMode === "list") {
    return (
      <Link 
        to={`/product/${product.slug}`}
        className="product-card block group rounded-lg overflow-hidden border w-full hover:shadow-md transition-shadow"
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-48 h-48">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg font-bold px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
            {product.salePrice && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                Sale
              </Badge>
            )}
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm">{product.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
            
            {/* Color options */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1 mb-3">
                {product.colors.slice(0, 4).map((color) => (
                  <div
                    key={color.name}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="text-xs text-gray-500">+{product.colors.length - 4} more</div>
                )}
              </div>
            )}
            
            {/* Size options */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1 mb-3 text-xs text-gray-500">
                <span>Sizes:</span>
                {product.sizes.slice(0, 5).map((size, index) => (
                  <span key={size}>
                    {size}{index < Math.min(product.sizes?.length || 0, 5) - 1 ? "," : ""}
                  </span>
                ))}
                {(product.sizes?.length || 0) > 5 && <span>...</span>}
              </div>
            )}
            
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                {product.salePrice ? (
                  <>
                    <span className="price text-lg">${product.salePrice.toFixed(2)}</span>
                    <span className="sale-price ml-2">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="price text-lg">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              <Button 
                onClick={onAddToCart} 
                variant="outline" 
                className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default grid view
  return (
    <Link 
      to={`/product/${product.slug}`}
      className={cn(
        "product-card block group rounded-lg overflow-hidden border", 
        featured && "featured-product"
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg font-bold px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}
        {product.salePrice && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            Sale
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Color options */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color.name}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="text-xs text-gray-500">+{product.colors.length - 4}</div>
            )}
          </div>
        )}
        
        {/* Size options */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 text-xs text-gray-500">
            <span>Sizes: {product.sizes.slice(0, 3).join(", ")}{product.sizes.length > 3 ? "..." : ""}</span>
          </div>
        )}
        
        <div className="mt-2 flex items-center">
          {product.salePrice ? (
            <>
              <span className="price">${product.salePrice.toFixed(2)}</span>
              <span className="sale-price ml-2">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="price">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="mt-3">
          <Button 
            onClick={onAddToCart} 
            variant="outline" 
            className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
