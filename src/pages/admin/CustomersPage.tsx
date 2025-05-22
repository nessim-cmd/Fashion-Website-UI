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
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import { Search, MoreHorizontal, Eye, Mail, ShoppingBag, Heart, User, UserX } from "lucide-react";

// Mock customers data
const mockCustomers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
    registeredDate: "2025-01-15T10:30:00Z",
    lastLogin: "2025-05-20T14:25:00Z",
    totalOrders: 5,
    totalSpent: 649.95,
    status: "active",
    wishlist: [
      { id: "1", name: "Floral Summer Dress", price: 59.99 },
      { id: "2", name: "Designer Handbag", price: 249.99 },
    ],
    orders: [
      { id: "ORD-001", date: "2025-05-15T10:30:00Z", total: 129.99, status: "pending" },
      { id: "ORD-003", date: "2025-04-22T09:15:00Z", total: 69.99, status: "delivered" },
      { id: "ORD-005", date: "2025-03-11T11:05:00Z", total: 129.99, status: "cancelled" },
    ],
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "United States",
    },
    registeredDate: "2025-02-20T15:45:00Z",
    lastLogin: "2025-05-19T11:10:00Z",
    totalOrders: 3,
    totalSpent: 349.97,
    status: "active",
    wishlist: [
      { id: "3", name: "Slim Fit Dress Shirt", price: 69.99 },
    ],
    orders: [
      { id: "ORD-002", date: "2025-05-14T14:45:00Z", total: 249.99, status: "processing" },
      { id: "ORD-004", date: "2025-04-02T16:20:00Z", total: 99.98, status: "delivered" },
    ],
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 456-7890",
    address: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      postalCode: "60007",
      country: "United States",
    },
    registeredDate: "2025-03-05T09:15:00Z",
    lastLogin: "2025-05-18T16:30:00Z",
    totalOrders: 2,
    totalSpent: 139.98,
    status: "active",
    wishlist: [],
    orders: [
      { id: "ORD-003", date: "2025-05-13T09:15:00Z", total: 69.99, status: "shipped" },
      { id: "ORD-006", date: "2025-04-25T13:40:00Z", total: 69.99, status: "delivered" },
    ],
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 789-0123",
    address: {
      street: "321 Maple Rd",
      city: "Houston",
      state: "TX",
      postalCode: "77001",
      country: "United States",
    },
    registeredDate: "2025-01-10T16:20:00Z",
    lastLogin: "2025-05-21T09:45:00Z",
    totalOrders: 4,
    totalSpent: 429.94,
    status: "active",
    wishlist: [
      { id: "4", name: "Formal Leather Shoes", price: 129.99 },
      { id: "5", name: "Casual Denim Jacket", price: 89.99 },
    ],
    orders: [
      { id: "ORD-004", date: "2025-05-12T16:20:00Z", total: 189.98, status: "delivered" },
      { id: "ORD-007", date: "2025-04-18T10:55:00Z", total: 239.96, status: "delivered" },
    ],
  },
  {
    id: "CUST-005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "+1 (555) 234-5678",
    address: {
      street: "654 Cedar Ln",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
    },
    registeredDate: "2025-02-28T11:05:00Z",
    lastLogin: "2025-04-15T14:20:00Z",
    totalOrders: 1,
    totalSpent: 129.99,
    status: "inactive",
    wishlist: [
      { id: "1", name: "Floral Summer Dress", price: 59.99 },
    ],
    orders: [
      { id: "ORD-005", date: "2025-05-11T11:05:00Z", total: 129.99, status: "cancelled" },
    ],
  },
];

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const itemsPerPage = 10;

  // Filter customers based on search term and status filter
  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch = 
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginate customers
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsCustomerDetailsOpen(true);
  };

  const handleSendEmail = (email: string) => {
    // In a real app, this would open an email composition dialog
    toast({
      title: "Email action triggered",
      description: `Preparing to send email to ${email}`,
    });
  };

  const handleToggleStatus = (customerId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    // In a real app, this would call an API to update the customer status
    toast({
      title: "Customer status updated",
      description: `Customer ${customerId} status changed to ${newStatus}.`,
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">
              Manage customer accounts and view customer information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>
              View and manage all customer accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="w-full md:w-40">
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.totalOrders}</TableCell>
                        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"} className="capitalize">
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendEmail(customer.email)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(customer.id, customer.status)}>
                                {customer.status === "active" ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <User className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
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

      {/* Customer Details Dialog */}
      <Dialog open={isCustomerDetailsOpen} onOpenChange={setIsCustomerDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              {selectedCustomer && `Customer ID: ${selectedCustomer.id}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>
                
                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="grid grid-cols-1 gap-2 text-sm">
                          <div className="grid grid-cols-3">
                            <dt className="font-medium">Name:</dt>
                            <dd className="col-span-2">{selectedCustomer.name}</dd>
                          </div>
                          
                          <div className="grid grid-cols-3">
                            <dt className="font-medium">Email:</dt>
                            <dd className="col-span-2">{selectedCustomer.email}</dd>
                          </div>
                          
                          <div className="grid grid-cols-3">
                            <dt className="font-medium">Phone:</dt>
                            <dd className="col-span-2">{selectedCustomer.phone}</dd>
                          </div>
                          
                          <div className="grid grid-cols-3">
                            <dt className="font-medium">Status:</dt>
                            <dd className="col-span-2">
                              <Badge variant={selectedCustomer.status === "active" ? "default" : "secondary"} className="capitalize">
                                {selectedCustomer.status}
                              </Badge>
                            </dd>
                          </div>
                          
                          <div className="grid grid-cols-3">
                            <dt className="font-medium">Registered:</dt>
                            <dd className="col-span-2">{new Date(selectedCustomer.registeredDate).toLocaleDateString()}</dd>
                          </div>
                          
                          <div className="grid grid-cols-3">
                            <dt className="font-medium">Last Login:</dt>
                            <dd className="col-span-2">{new Date(selectedCustomer.lastLogin).toLocaleDateString()}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <address className="not-italic text-sm space-y-1">
                          <div>{selectedCustomer.address.street}</div>
                          <div>
                            {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.postalCode}
                          </div>
                          <div>{selectedCustomer.address.country}</div>
                        </address>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Purchase Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold">{selectedCustomer.totalOrders}</div>
                          <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Total Spent</div>
                        </div>
                        
                        <div className="bg-muted rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold">
                            ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">Average Order Value</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCustomer.orders.length === 0 ? (
                        <div className="text-center py-8 border rounded-md">
                          <p className="text-muted-foreground">No orders found</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedCustomer.orders.map((order: any) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>${order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="capitalize">
                                    {order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Wishlist Tab */}
                <TabsContent value="wishlist">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Wishlist Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCustomer.wishlist.length === 0 ? (
                        <div className="text-center py-8 border rounded-md">
                          <p className="text-muted-foreground">No wishlist items found</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product ID</TableHead>
                              <TableHead>Product Name</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedCustomer.wishlist.map((item: any) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Product
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleSendEmail(selectedCustomer.email)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button 
                    variant={selectedCustomer.status === "active" ? "destructive" : "default"}
                    onClick={() => handleToggleStatus(selectedCustomer.id, selectedCustomer.status)}
                  >
                    {selectedCustomer.status === "active" ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        Deactivate Account
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Activate Account
                      </>
                    )}
                  </Button>
                </div>
                <Button onClick={() => setIsCustomerDetailsOpen(false)}>
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

export default CustomersPage;
