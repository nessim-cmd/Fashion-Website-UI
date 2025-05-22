import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/lib/data";
import { Eye, MoreHorizontal, Edit, Package, Users, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/types";

// Mock recent orders data
const recentOrders = [
  {
    id: "ORD-001",
    date: "2025-05-15T10:30:00Z",
    customer: {
      id: "CUST-001",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    status: "pending",
    total: 129.99,
  },
  {
    id: "ORD-002",
    date: "2025-05-14T14:45:00Z",
    customer: {
      id: "CUST-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    status: "processing",
    total: 249.99,
  },
  {
    id: "ORD-003",
    date: "2025-05-13T09:15:00Z",
    customer: {
      id: "CUST-003",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
    },
    status: "shipped",
    total: 69.99,
  },
  {
    id: "ORD-004",
    date: "2025-05-12T16:20:00Z",
    customer: {
      id: "CUST-004",
      name: "Emily Davis",
      email: "emily.davis@example.com",
    },
    status: "delivered",
    total: 189.98,
  },
  {
    id: "ORD-005",
    date: "2025-05-11T11:05:00Z",
    customer: {
      id: "CUST-005",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
    },
    status: "cancelled",
    total: 129.99,
  },
];

// Mock sales data for charts
const salesData = {
  daily: [
    { date: "Mon", amount: 1200 },
    { date: "Tue", amount: 1800 },
    { date: "Wed", amount: 1600 },
    { date: "Thu", amount: 2200 },
    { date: "Fri", amount: 1900 },
    { date: "Sat", amount: 2400 },
    { date: "Sun", amount: 2100 },
  ],
  monthly: [
    { date: "Jan", amount: 12000 },
    { date: "Feb", amount: 14000 },
    { date: "Mar", amount: 16000 },
    { date: "Apr", amount: 18000 },
    { date: "May", amount: 21000 },
    { date: "Jun", amount: 19000 },
    { date: "Jul", amount: 22000 },
    { date: "Aug", amount: 24000 },
    { date: "Sep", amount: 26000 },
    { date: "Oct", amount: 23000 },
    { date: "Nov", amount: 25000 },
    { date: "Dec", amount: 28000 },
  ],
};

// Mock category distribution data
const categoryData = [
  { name: "Women's Clothing", value: 40 },
  { name: "Men's Clothing", value: 30 },
  { name: "Accessories", value: 15 },
  { name: "Footwear", value: 10 },
  { name: "Seasonal", value: 5 },
];

// Add a sold property to the Product type for this component
interface ProductWithSales extends Product {
  sold?: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState("weekly");
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && user.email !== "admin@example.com") {
      navigate("/");
    }
  }, [user, navigate]);

  // Get top selling products - add mock sold data
  const productsWithSales = products.map((product, index) => {
    // Add a mock sold count based on product index
    return {
      ...product,
      sold: Math.floor(Math.random() * 100) + (30 - (index % 30)) // Higher for first products
    } as ProductWithSales;
  });

  // Sort by sold count
  const topProducts = [...productsWithSales]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

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

  // Calculate summary metrics
  const totalRevenue = recentOrders.reduce((sum, order) => 
    order.status !== "cancelled" ? sum + order.total : sum, 0);
  
  const totalOrders = recentOrders.filter(order => 
    order.status !== "cancelled").length;
  
  const totalCustomers = new Set(recentOrders.map(order => order.customer.id)).size;
  
  const totalProducts = products.length;

  // Function to render the sales chart using HTML/CSS
  const renderSalesChart = () => {
    const data = chartPeriod === "weekly" ? salesData.daily : salesData.monthly;
    const maxAmount = Math.max(...data.map(item => item.amount));
    
    return (
      <div className="w-full h-64 flex items-end space-x-2">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-primary/80 hover:bg-primary rounded-t-sm transition-all"
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-xs mt-2">{item.date}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Function to render the category distribution chart
  const renderCategoryChart = () => {
    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="space-y-4">
        {categoryData.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin! Here's an overview of your store.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+8.2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+5.7% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center pt-4 text-sm text-red-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>-2.3% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Sales Overview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={chartPeriod === "weekly" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartPeriod("weekly")}
                  >
                    Weekly
                  </Button>
                  <Button 
                    variant={chartPeriod === "monthly" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartPeriod("monthly")}
                  >
                    Monthly
                  </Button>
                </div>
              </div>
              <CardDescription>
                {chartPeriod === "weekly" ? "Sales for the past week" : "Sales for the past year"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSalesChart()}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>
                Product distribution by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCategoryChart()}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link to="/admin/orders">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <CardDescription>
                Latest customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/orders`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Top Products</CardTitle>
                <Link to="/admin/products">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <CardDescription>
                Best selling products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sold</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.sold || 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link to={`/admin/products`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            </Link>
                            <Link to={`/admin/products/edit/${product.id}`}>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
