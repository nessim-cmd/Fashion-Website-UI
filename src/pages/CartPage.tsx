
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MinusCircle, PlusCircle, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { coupons } from "@/lib/data";
import { Coupon } from "@/lib/types";

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
    );

    if (!coupon) {
      toast.error("Invalid or expired coupon code");
      return;
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      toast.error(
        `This coupon requires a minimum purchase of $${coupon.minPurchase.toFixed(2)}`
      );
      return;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied successfully!`);
    setCouponCode("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;

  const shippingAmount = subtotal >= 75 ? 0 : 15;
  const total = subtotal - discountAmount + shippingAmount;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8 flex justify-center">
          <ShoppingBag className="h-24 w-24 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="w-full lg:w-2/3">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-medium">Product</th>
                  <th className="p-4 text-center font-medium">Quantity</th>
                  <th className="p-4 text-right font-medium">Price</th>
                  <th className="p-4 text-right font-medium">Total</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => {
                  const price = item.product.salePrice || item.product.price;
                  const itemTotal = price * item.quantity;

                  return (
                    <tr key={item.productId} className="bg-card">
                      {/* Product */}
                      <td className="p-4">
                        <div className="flex items-center">
                          <Link to={`/product/${item.product.slug}`} className="mr-4">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </Link>
                          <Link to={`/product/${item.product.slug}`} className="font-medium hover:text-primary">
                            {item.product.name}
                          </Link>
                        </div>
                      </td>
                      
                      {/* Quantity */}
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity === 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      
                      {/* Price */}
                      <td className="p-4 text-right">
                        <div>
                          {item.product.salePrice ? (
                            <div>
                              <span className="font-medium">${item.product.salePrice.toFixed(2)}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${item.product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">${item.product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      
                      {/* Total */}
                      <td className="p-4 text-right font-medium">
                        ${itemTotal.toFixed(2)}
                      </td>
                      
                      {/* Remove */}
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Link to="/products">
              <Button variant="outline" className="flex items-center gap-2">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-1/3">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <div className="flex items-center">
                    <span>Discount</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 text-gray-400 hover:text-gray-600"
                      onClick={removeCoupon}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {shippingAmount === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span className="font-medium">${shippingAmount.toFixed(2)}</span>
                )}
              </div>
              
              <div className="border-t pt-4 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            {!appliedCoupon && (
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleApplyCoupon}>Apply</Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Try "WELCOME10" for 10% off your first order
                </p>
              </div>
            )}

            {subtotal < 75 && shippingAmount > 0 && (
              <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
                <AlertDescription>
                  Add ${(75 - subtotal).toFixed(2)} more to qualify for free shipping!
                </AlertDescription>
              </Alert>
            )}

            <Link to="/checkout">
              <Button className="w-full flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
