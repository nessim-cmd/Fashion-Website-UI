/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer, ShoppingBag } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order from localStorage
    try {
      const ordersStr = localStorage.getItem("orders");
      if (ordersStr) {
        const orders = JSON.parse(ordersStr);
        const foundOrder = orders.find((o: any) => o.id === orderId);
        setOrder(foundOrder || null);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="rounded-full bg-gray-200 h-24 w-24 mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-8">We couldn't find the order you're looking for.</p>
        <Link to="/orders">
          <Button>View Your Orders</Button>
        </Link>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-4 mb-6">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Thank you for your order. We've received your order and will begin
            processing it soon.
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden mb-8">
          <div className="bg-muted p-4 sm:p-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(order.date)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Order details */}
            <div>
              <h3 className="font-semibold mb-4">Order Details</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="font-medium">
                          ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${(item.product.salePrice || item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <h3 className="font-semibold mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {order.shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>${order.shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <address className="not-italic text-gray-600">
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.streetAddress}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </address>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Method</h3>
                <p className="text-gray-600">
                  Standard Shipping (5-7 business days)
                </p>
                <p className="mt-2">
                  <span className="font-medium">Estimated delivery:</span>{" "}
                  {formatDate(estimatedDelivery.toISOString())}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p className="text-gray-600">
                {order.paymentMethod === "credit-card"
                  ? "Credit/Debit Card"
                  : order.paymentMethod === "paypal"
                  ? "PayPal"
                  : "Bank Transfer"}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p>
            Questions about your order?{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
          <Link to="/products">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
