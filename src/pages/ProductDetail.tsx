import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { products } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Heart, 
  Share, 
  MinusCircle, 
  PlusCircle, 
  Star, 
  StarHalf, 
  Truck 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductColor } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(undefined);

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you are looking for does not exist.</p>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        variant: "destructive",
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  // Check if product has sizes or colors
  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter(
      (p) => p.categoryId === product.categoryId && p.id !== product.id
    )
    .slice(0, 4);

  // Generate rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  // Helper function to determine if a color is light or dark
  const isLightColor = (hex: string) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Calculate brightness (using common formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return true if color is light
    return brightness > 128;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[selectedImage]}
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
              <Badge className="absolute top-4 right-4 bg-red-500 px-3 py-1 text-base">
                Sale
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`w-20 h-20 rounded border-2 overflow-hidden ${
                  index === selectedImage ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          {/* Product info */}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewCount} reviews)
            </span>
          </div>
          
          <div className="mb-6">
            {product.salePrice ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-primary">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="ml-3 text-xl line-through text-gray-500">
                  ${product.price.toFixed(2)}
                </span>
                <Badge className="ml-3 bg-red-500">
                  Save ${(product.price - product.salePrice).toFixed(2)}
                </Badge>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="prose prose-sm mb-6 max-w-none">
            <p>{product.description}</p>
          </div>

          {/* Color Selection */}
          {hasColors && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Select Color:</h3>
              <RadioGroup 
                value={selectedColor ? selectedColor.name : ""} 
                onValueChange={(value) => {
                  const color = product.colors?.find(c => c.name === value);
                  setSelectedColor(color);
                }}
                className="flex flex-wrap gap-3"
              >
                {product.colors?.map((color) => (
                  <div key={color.name} className="flex items-center gap-2">
                    <RadioGroupItem 
                      value={color.name} 
                      id={`color-${color.name}`}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`color-${color.name}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                        selectedColor?.name === color.name 
                          ? "ring-2 ring-offset-2 ring-primary" 
                          : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor?.name === color.name && (
                        <span className={`text-xs ${
                          isLightColor(color.hex) ? "text-black" : "text-white"
                        }`}>✓</span>
                      )}
                    </label>
                    <span className="text-sm">{color.name}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Size Selection */}
          {hasSizes && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Select Size:</h3>
                <button className="text-sm text-primary">Size Guide</button>
              </div>
              <Select
                value={selectedSize}
                onValueChange={setSelectedSize}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes?.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Stock status */}
          <div className="flex items-center mb-6">
            <Badge variant={product.inStock ? "default" : "destructive"} className="px-3 py-1">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
            
            {product.inStock && (
              <div className="ml-4 flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-1" />
                <span>Free shipping on orders over $75</span>
              </div>
            )}
          </div>

          {/* Quantity selector */}
          {product.inStock && (
            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || (hasSizes && !selectedSize)}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={toggleWishlist}
              className={isInWishlist(product.id) ? "bg-pink-50 text-pink-600 border-pink-300 hover:bg-pink-100" : ""}
            >
              <Heart className={`mr-2 h-5 w-5 ${isInWishlist(product.id) ? "fill-pink-600" : ""}`} />
              {isInWishlist(product.id) ? "In Wishlist" : "Wishlist"}
            </Button>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Share className="h-5 w-5" />
            </Button>
          </div>

          {/* Size selection warning */}
          {hasSizes && !selectedSize && product.inStock && (
            <p className="text-sm text-red-500 mb-4">
              Please select a size before adding to cart
            </p>
          )}
        </div>
      </div>

      {/* Product details tabs */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 border rounded-b-lg">
            <div className="prose max-w-none">
              <p>
                {product.description}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla 
                quam velit, vulputate eu pharetra nec, mattis ac neque. Duis 
                vulputate commodo lectus, ac blandit elit tincidunt id.
              </p>
              <ul>
                <li>High-quality materials</li>
                <li>Durable construction</li>
                <li>Designed for everyday use</li>
                <li>Modern aesthetics</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="specs" className="p-6 border rounded-b-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <div className="font-medium">Category</div>
                <div className="text-gray-600">
                  {product.categoryId === "1" && "Women"}
                  {product.categoryId === "2" && "Men"}
                  {product.categoryId === "3" && "Kids"}
                  {product.categoryId === "4" && "Seasonal"}
                </div>
              </div>
              <div className="border-b pb-2">
                <div className="font-medium">Product ID</div>
                <div className="text-gray-600">{product.id}</div>
              </div>
              <div className="border-b pb-2">
                <div className="font-medium">Rating</div>
                <div className="text-gray-600">{product.rating} out of 5</div>
              </div>
              <div className="border-b pb-2">
                <div className="font-medium">Stock Status</div>
                <div className="text-gray-600">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>
              <div className="border-b pb-2">
                <div className="font-medium">On Sale</div>
                <div className="text-gray-600">
                  {product.salePrice ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-6 border rounded-b-lg">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xl font-medium">
                  {product.rating.toFixed(1)} out of 5
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Based on {product.reviewCount} reviews
              </div>
            </div>

            <div className="space-y-6">
              {/* Example reviews - in a real app these would come from API */}
              <div className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(5)}
                  </div>
                  <div className="font-medium">John D.</div>
                </div>
                <p className="text-sm mb-1">
                  Great product, exactly as described. Would buy again!
                </p>
                <div className="text-xs text-gray-500">2 months ago</div>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(4)}
                  </div>
                  <div className="font-medium">Sarah M.</div>
                </div>
                <p className="text-sm mb-1">
                  Good quality but shipping took a bit longer than expected.
                </p>
                <div className="text-xs text-gray-500">1 month ago</div>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(5)}
                  </div>
                  <div className="font-medium">David R.</div>
                </div>
                <p className="text-sm mb-1">
                  Absolutely love it! The quality exceeded my expectations.
                </p>
                <div className="text-xs text-gray-500">2 weeks ago</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
