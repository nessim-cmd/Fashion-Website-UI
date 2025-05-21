/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { coupons } from "@/lib/data";
import { Coupon } from "@/lib/types";
import { Calendar, Clock, DollarSign, Package, Users } from "lucide-react";

const couponSchema = z.object({
  code: z.string().min(4, {
    message: "Coupon code must be at least 4 characters",
  }),
  discount: z.coerce.number().min(1, {
    message: "Discount must be at least 1",
  }),
  type: z.enum(["percentage", "fixed"]),
  minPurchase: z.coerce.number().optional(),
  expiresAt: z.string().min(1, {
    message: "Expiration date is required",
  }),
});

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const ordersStr = localStorage.getItem("orders");
      return ordersStr ? JSON.parse(ordersStr) : [];
    } catch (error) {
      console.error("Error loading orders:", error);
      return [];
    }
  });

  const [adminCoupons, setAdminCoupons] = useState<Coupon[]>(coupons);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discount: 10,
      type: "percentage",
      minPurchase: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  });

  if (!isAdmin || !user) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = (data: z.infer<typeof couponSchema>) => {
    setIsLoading(true);
    
    // Create a new coupon
    const newCoupon: Coupon = {
      id: String(adminCoupons.length + 1),
      code: data.code.toUpperCase(),
      discount: data.discount,
      type: data.type,
      minPurchase: data.minPurchase,
      expiresAt: new Date(data.expiresAt).toISOString(),
      isActive: true,
    };

    // Simulate API call
    setTimeout(() => {
      setAdminCoupons([...adminCoupons, newCoupon]);
      toast.success(`Coupon "${newCoupon.code}" created successfully!`);
      form.reset();
      setIsLoading(false);
    }, 1000);
  };

  const toggleCouponStatus = (couponId: string) => {
    setAdminCoupons(
      adminCoupons.map((coupon) =>
        coupon.id === couponId
          ? { ...coupon, isActive: !coupon.isActive }
          : coupon
      )
    );
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const uniqueCustomers = new Set(orders.map(order => order.userId)).size;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button>Export Data</Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold">{pendingOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-2xl font-bold">{uniqueCustomers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:w-[400px]">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage customer orders and track deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>{order.shippingAddress?.fullName || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {order.status || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Coupon */}
            <Card>
              <CardHeader>
                <CardTitle>Create Coupon</CardTitle>
                <CardDescription>Add a new discount coupon</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon Code</FormLabel>
                          <FormControl>
                            <Input placeholder="SUMMER25" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Amount</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minPurchase"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Purchase ($)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expiresAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Coupon"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Existing Coupons */}
            <Card>
              <CardHeader>
                <CardTitle>Active Coupons</CardTitle>
                <CardDescription>Manage existing discount coupons</CardDescription>
              </CardHeader>
              <CardContent>
                {adminCoupons.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No coupons yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminCoupons.map((coupon) => (
                      <div 
                        key={coupon.id} 
                        className={`border rounded-lg p-4 ${
                          !coupon.isActive && "bg-gray-50 opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-lg font-semibold">
                              {coupon.code}{" "}
                              <Badge variant={coupon.isActive ? "default" : "secondary"} className="ml-2">
                                {coupon.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                              {coupon.type === "percentage" 
                                ? `${coupon.discount}% off` 
                                : `$${coupon.discount} off`}
                              
                              {coupon.minPurchase && coupon.minPurchase > 0 && (
                                <span> on orders over ${coupon.minPurchase}</span>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <Button 
                              variant={coupon.isActive ? "default" : "outline"} 
                              size="sm"
                              onClick={() => toggleCouponStatus(coupon.id)}
                            >
                              {coupon.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
