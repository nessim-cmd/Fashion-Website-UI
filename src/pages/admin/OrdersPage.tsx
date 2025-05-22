/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import { Search, MoreHorizontal, Filter, Eye, Truck, CheckCircle } from "lucide-react";

// Mock orders data
const mockOrders = [
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
    items: [
      { id: "1", name: "Floral Summer Dress", quantity: 1, price: 59.99 },
      { id: "4", name: "Formal Leather Shoes", quantity: 1, price: 70.00 },
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
    paymentMethod: "cash-on-delivery",
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
    items: [
      { id: "2", name: "Designer Handbag", quantity: 1, price: 249.99 },
    ],
    shippingAddress: {
      fullName: "Jane Smith",
      streetAddress: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "United States",
      phone: "+1 (555) 987-6543",
    },
    paymentMethod: "cash-on-delivery",
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
    items: [
      { id: "3", name: "Slim Fit Dress Shirt", quantity: 1, price: 69.99 },
    ],
    shippingAddress: {
      fullName: "Robert Johnson",
      streetAddress: "789 Pine St",
      city: "Chicago",
      state: "IL",
      postalCode: "60007",
      country: "United States",
      phone: "+1 (555) 456-7890",
    },
    paymentMethod: "cash-on-delivery",
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
    items: [
      { id: "1", name: "Floral Summer Dress", quantity: 2, price: 59.99 },
      { id: "3", name: "Slim Fit Dress Shirt", quantity: 1, price: 69.99 },
    ],
    shippingAddress: {
      fullName: "Emily Davis",
      streetAddress: "321 Maple Rd",
      city: "Houston",
      state: "TX",
      postalCode: "77001",
      country: "United States",
      phone: "+1 (555) 789-0123",
    },
    paymentMethod: "cash-on-delivery",
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
    items: [
      { id: "4", name: "Formal Leather Shoes", quantity: 1, price: 129.99 },
    ],
    shippingAddress: {
      fullName: "Michael Wilson",
      streetAddress: "654 Cedar Ln",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
      phone: "+1 (555) 234-5678",
    },
    paymentMethod: "cash-on-delivery",
  },
];

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const itemsPerPage = 10;

  // Filter orders based on search term and status filter
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginate orders
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would call an API to update the order status
    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    });
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
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              Manage customer orders and track deliveries
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              View and manage all customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by order ID or customer..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="w-full md:w-40">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div>
                            <div>{order.customer.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.customer.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {order.status === "pending" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "processing")}>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Mark as Processing
                                </DropdownMenuItem>
                              )}
                              {order.status === "processing" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "shipped")}>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Mark as Shipped
                                </DropdownMenuItem>
                              )}
                              {order.status === "shipped" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "delivered")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Delivered
                                </DropdownMenuItem>
                              )}
                              {(order.status === "pending" || order.status === "processing") && (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleUpdateStatus(order.id, "cancelled")}
                                >
                                  Cancel Order
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order ID: ${selectedOrder.id}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <dt className="font-medium">Order ID:</dt>
                      <dd>{selectedOrder.id}</dd>
                      
                      <dt className="font-medium">Date:</dt>
                      <dd>{new Date(selectedOrder.date).toLocaleString()}</dd>
                      
                      <dt className="font-medium">Status:</dt>
                      <dd>
                        <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="capitalize">
                          {selectedOrder.status}
                        </Badge>
                      </dd>
                      
                      <dt className="font-medium">Payment Method:</dt>
                      <dd className="capitalize">{selectedOrder.paymentMethod.replace(/-/g, ' ')}</dd>
                      
                      <dt className="font-medium">Total:</dt>
                      <dd className="font-bold">${selectedOrder.total.toFixed(2)}</dd>
                    </dl>
                  </CardContent>
                </Card>
                
                {/* Customer Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-2 text-sm">
                      <dt className="font-medium">Name:</dt>
                      <dd>{selectedOrder.customer.name}</dd>
                      
                      <dt className="font-medium">Email:</dt>
                      <dd>{selectedOrder.customer.email}</dd>
                      
                      <dt className="font-medium">Shipping Address:</dt>
                      <dd className="space-y-1">
                        <div>{selectedOrder.shippingAddress.fullName}</div>
                        <div>{selectedOrder.shippingAddress.streetAddress}</div>
                        <div>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                        </div>
                        <div>{selectedOrder.shippingAddress.country}</div>
                        <div>{selectedOrder.shippingAddress.phone}</div>
                      </dd>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              
              {/* Order Items */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${selectedOrder.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Order Actions */}
              <DialogFooter className="flex justify-between items-center">
                <div>
                  <Select
                    defaultValue={selectedOrder.status}
                    onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setIsOrderDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default OrdersPage;
