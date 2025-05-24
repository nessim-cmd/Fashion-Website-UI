import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, AlertCircle, Clock, ArrowRight, ShoppingBag } from "lucide-react";
import React from "react";

// Mock orders data for the current user
const mockOrders = [
  {
    id: "ORD-001",
    date: "2025-05-15T10:30:00Z",
    status: "delivered",
    total: 129.99,
    items: [
      { id: "1", name: "Floral Summer Dress", quantity: 1, price: 59.99, image: "/images/products/dress1.jpg" },
      { id: "4", name: "Formal Leather Shoes", quantity: 1, price: 70.00, image: "/images/products/shoes1.jpg" },
    ],
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card",
    trackingNumber: "TRK123456789",
    deliveryDate: "2025-05-20T14:25:00Z",
  },
  {
    id: "ORD-002",
    date: "2025-04-22T09:15:00Z",
    status: "delivered",
    total: 249.99,
    items: [
      { id: "2", name: "Designer Handbag", quantity: 1, price: 249.99, image: "/images/products/bag1.jpg" },
    ],
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "PayPal",
    trackingNumber: "TRK987654321",
    deliveryDate: "2025-04-27T11:30:00Z",
  },
  {
    id: "ORD-003",
    date: "2025-03-11T11:05:00Z",
    status: "cancelled",
    total: 129.99,
    items: [
      { id: "3", name: "Slim Fit Dress Shirt", quantity: 1, price: 69.99, image: "/images/products/shirt1.jpg" },
      { id: "5", name: "Casual Denim Jacket", quantity: 1, price: 60.00, image: "/images/products/jacket1.jpg" },
    ],
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card",
    cancellationReason: "Customer requested cancellation",
  },
  {
    id: "ORD-004",
    date: "2025-05-18T16:20:00Z",
    status: "processing",
    total: 189.98,
    items: [
      { id: "1", name: "Floral Summer Dress", quantity: 2, price: 59.99, image: "/images/products/dress1.jpg" },
      { id: "3", name: "Slim Fit Dress Shirt", quantity: 1, price: 69.99, image: "/images/products/shirt1.jpg" },
    ],
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Credit Card",
    estimatedDelivery: "2025-05-25T00:00:00Z",
  },
  {
    id: "ORD-005",
    date: "2025-05-20T11:05:00Z",
    status: "pending",
    total: 129.99,
    items: [
      { id: "4", name: "Formal Leather Shoes", quantity: 1, price: 129.99, image: "/images/products/shoes1.jpg" },
    ],
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    paymentMethod: "Cash on Delivery",
    estimatedDelivery: "2025-05-27T00:00:00Z",
  },
];

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user && user.email === "admin@example.com") {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "processing":
        return "secondary";
      case "shipped":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            View and track your order history
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    {activeTab === "all" 
                      ? "You haven't placed any orders yet." 
                      : `You don't have any ${activeTab} orders.`}
                  </p>
                  <Link to="/shop">
                    <Button>
                      Start Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            Order #{order.id}
                            <Badge variant={getStatusBadgeVariant(order.status)} className="ml-3 capitalize">
                              {order.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Placed on {formatDate(order.date)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${order.total.toFixed(2)}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            {expandedOrder === order.id ? "Hide Details" : "View Details"}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedOrder === order.id && (
                      <>
                        <Separator />
                        <CardContent className="pt-4">
                          <Accordion type="single" collapsible defaultValue="items">
                            <AccordionItem value="items">
                              <AccordionTrigger>Order Items</AccordionTrigger>
                              <AccordionContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[80px]">Image</TableHead>
                                      <TableHead>Product</TableHead>
                                      <TableHead className="text-right">Price</TableHead>
                                      <TableHead className="text-right">Quantity</TableHead>
                                      <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>
                                          <div className="w-12 h-12 rounded-md overflow-hidden">
                                            <img 
                                              src={item.image} 
                                              alt={item.name} 
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Image';
                                              }}
                                            />
                                          </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow>
                                      <TableCell colSpan={4} className="text-right font-bold">
                                        Total:
                                      </TableCell>
                                      <TableCell className="text-right font-bold">
                                        ${order.total.toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="shipping">
                              <AccordionTrigger>Shipping Information</AccordionTrigger>
                              <AccordionContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-medium mb-2">Shipping Address</h4>
                                    <address className="not-italic text-muted-foreground">
                                      <div>{order.shippingAddress.fullName}</div>
                                      <div>{order.shippingAddress.streetAddress}</div>
                                      <div>
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                      </div>
                                      <div>{order.shippingAddress.country}</div>
                                      <div className="mt-1">{order.shippingAddress.phone}</div>
                                    </address>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Payment Method</h4>
                                    <p className="text-muted-foreground">{order.paymentMethod}</p>
                                    
                                    {order.status === "shipped" && (
                                      <div className="mt-4">
                                        <h4 className="font-medium mb-2">Tracking Information</h4>
                                        <p className="text-muted-foreground">
                                          Tracking Number: {order.trackingNumber}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {(order.status === "pending" || order.status === "processing") && (
                                      <div className="mt-4">
                                        <h4 className="font-medium mb-2">Estimated Delivery</h4>
                                        <p className="text-muted-foreground">
                                          {formatDate(order.estimatedDelivery || "")}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {order.status === "delivered" && (
                                      <div className="mt-4">
                                        <h4 className="font-medium mb-2">Delivered On</h4>
                                        <p className="text-muted-foreground">
                                          {formatDate(order.deliveryDate || "")}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {order.status === "cancelled" && (
                                      <div className="mt-4">
                                        <h4 className="font-medium mb-2">Cancellation Reason</h4>
                                        <p className="text-muted-foreground">
                                          {order.cancellationReason}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between border-t pt-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            {getStatusIcon(order.status)}
                            <span className="ml-2">
                              {order.status === "pending" && "Your order has been placed and is awaiting processing."}
                              {order.status === "processing" && "Your order is being processed and prepared for shipping."}
                              {order.status === "shipped" && "Your order has been shipped and is on its way."}
                              {order.status === "delivered" && "Your order has been delivered."}
                              {order.status === "cancelled" && "Your order has been cancelled."}
                            </span>
                          </div>
                          
                          {(order.status === "delivered") && (
                            <Link to={`/product/${order.items[0].id}`}>
                              <Button variant="outline" size="sm">
                                Buy Again
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          
                          {(order.status === "pending") && (
                            <Button variant="outline" size="sm">
                              Cancel Order
                            </Button>
                          )}
                        </CardFooter>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
