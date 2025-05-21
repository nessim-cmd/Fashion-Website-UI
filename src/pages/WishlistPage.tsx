import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const WishlistPage = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleAddToCart = (productId: string) => {
    const product = items.find((item) => item.id === productId);
    if (product) {
      addItem(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="text-red-500 border-red-500 hover:bg-red-50"
          >
            Clear Wishlist
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">
            Add items you love to your wishlist. Review them anytime and easily move them to the cart.
          </p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden"
              onMouseEnter={() => setHoveredItem(product.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative aspect-square">
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
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
                <div
                  className={`absolute top-2 left-2 transition-opacity duration-200 ${
                    hoveredItem === product.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mb-3">
                  {product.salePrice ? (
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-primary">
                        ${product.salePrice.toFixed(2)}
                      </span>
                      <span className="ml-2 text-sm line-through text-gray-500">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <Button
                  className="w-full"
                  disabled={!product.inStock}
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
