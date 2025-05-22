/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Search, MoreHorizontal, Plus, Edit, Trash2, Copy, ArrowUpDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Mock coupons data
const mockCoupons = [
  {
    id: "COUPON-001",
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    minPurchase: 100,
    maxDiscount: 50,
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2025-08-31T23:59:59Z",
    usageLimit: 1000,
    usageCount: 342,
    isActive: true,
    categories: ["Women's Clothing", "Men's Clothing"],
    products: [],
    createdAt: "2025-05-15T10:30:00Z",
  },
  {
    id: "COUPON-002",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minPurchase: 0,
    maxDiscount: null,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    usageLimit: 1,
    usageCount: 523,
    isActive: true,
    categories: [],
    products: [],
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "COUPON-003",
    code: "FREESHIP",
    type: "fixed",
    value: 15,
    minPurchase: 75,
    maxDiscount: null,
    startDate: "2025-05-01T00:00:00Z",
    endDate: "2025-05-31T23:59:59Z",
    usageLimit: 500,
    usageCount: 213,
    isActive: true,
    categories: [],
    products: [],
    createdAt: "2025-04-25T14:15:00Z",
  },
  {
    id: "COUPON-004",
    code: "FLASH50",
    type: "percentage",
    value: 50,
    minPurchase: 200,
    maxDiscount: 100,
    startDate: "2025-05-20T00:00:00Z",
    endDate: "2025-05-22T23:59:59Z",
    usageLimit: 200,
    usageCount: 87,
    isActive: true,
    categories: ["Accessories"],
    products: [],
    createdAt: "2025-05-18T09:00:00Z",
  },
  {
    id: "COUPON-005",
    code: "HOLIDAY30",
    type: "percentage",
    value: 30,
    minPurchase: 150,
    maxDiscount: 75,
    startDate: "2024-12-15T00:00:00Z",
    endDate: "2025-01-05T23:59:59Z",
    usageLimit: 1000,
    usageCount: 876,
    isActive: false,
    categories: [],
    products: [],
    createdAt: "2024-12-10T11:30:00Z",
  },
];

// Form schema for coupon creation/editing
const couponFormSchema = z.object({
  code: z.string().min(3, {
    message: "Coupon code must be at least 3 characters.",
  }).toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(1, {
    message: "Value must be at least 1.",
  }),
  minPurchase: z.coerce.number().min(0, {
    message: "Minimum purchase must be at least 0.",
  }),
  maxDiscount: z.coerce.number().min(0, {
    message: "Maximum discount must be at least 0.",
  }).nullable().optional(),
  startDate: z.string(),
  endDate: z.string(),
  usageLimit: z.coerce.number().min(1, {
    message: "Usage limit must be at least 1.",
  }),
  isActive: z.boolean().default(true),
  categories: z.array(z.string()).default([]),
  products: z.array(z.string()).default([]),
});

const CouponsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);
  const itemsPerPage = 10;

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.email !== "admin@example.com") {
      navigate("/");
    }
  }, [user, navigate]);

  // Setup form for adding/editing coupons
  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      maxDiscount: null,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      isActive: true,
      categories: [],
      products: [],
    },
  });

  // Filter coupons based on search term and status filter
  const filteredCoupons = mockCoupons.filter((coupon) => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && coupon.isActive) ||
      (statusFilter === "inactive" && !coupon.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Sort coupons
  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === "code") {
      comparison = a.code.localeCompare(b.code);
    } else if (sortField === "value") {
      comparison = a.value - b.value;
    } else if (sortField === "usageCount") {
      comparison = a.usageCount - b.usageCount;
    } else if (sortField === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortField === "endDate") {
      comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Paginate coupons
  const totalPages = Math.ceil(sortedCoupons.length / itemsPerPage);
  const paginatedCoupons = sortedCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddCoupon = () => {
    form.reset({
      code: "",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      maxDiscount: null,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      isActive: true,
      categories: [],
      products: [],
    });
    setIsAddDialogOpen(true);
  };

  const handleEditCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    form.reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase,
      maxDiscount: coupon.maxDiscount,
      startDate: new Date(coupon.startDate).toISOString().split('T')[0],
      endDate: new Date(coupon.endDate).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
      categories: coupon.categories,
      products: coupon.products,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Coupon code copied",
      description: `${code} has been copied to clipboard.`,
    });
  };

  const onSubmitAdd = (values: z.infer<typeof couponFormSchema>) => {
    // In a real app, this would call an API to create the coupon
    toast({
      title: "Coupon created",
      description: `${values.code} has been created successfully.`,
    });
    setIsAddDialogOpen(false);
  };

  const onSubmitEdit = (values: z.infer<typeof couponFormSchema>) => {
    // In a real app, this would call an API to update the coupon
    toast({
      title: "Coupon updated",
      description: `${values.code} has been updated successfully.`,
    });
    setIsEditDialogOpen(false);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the coupon
    toast({
      title: "Coupon deleted",
      description: `${selectedCoupon?.code} has been deleted.`,
    });
    setIsDeleteDialogOpen(false);
  };

  // Mock categories for selection
  const availableCategories = [
    "Women's Clothing",
    "Men's Clothing",
    "Accessories",
    "Footwear",
    "Seasonal",
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Coupons</h1>
            <p className="text-muted-foreground">
              Manage discount coupons and promotions
            </p>
          </div>
          <Button onClick={handleAddCoupon}>
            <Plus className="mr-2 h-4 w-4" />
            Add Coupon
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coupon Management</CardTitle>
            <CardDescription>
              Create and manage discount coupons for your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search coupons..."
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
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort("code")} className="cursor-pointer">
                      <div className="flex items-center">
                        Code
                        {sortField === "code" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead onClick={() => handleSort("value")} className="cursor-pointer">
                      <div className="flex items-center">
                        Value
                        {sortField === "value" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort("endDate")} className="cursor-pointer">
                      <div className="flex items-center">
                        Expiry
                        {sortField === "endDate" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort("usageCount")} className="cursor-pointer">
                      <div className="flex items-center">
                        Usage
                        {sortField === "usageCount" && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCoupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No coupons found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCoupons.map((coupon) => {
                      const isExpired = new Date(coupon.endDate) < new Date();
                      const isActive = coupon.isActive && !isExpired;
                      
                      return (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {coupon.code}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-6 w-6"
                                onClick={() => handleCopyCoupon(coupon.code)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                          </TableCell>
                          <TableCell>
                            {coupon.type === "percentage" ? 
                              `${coupon.value}% ${coupon.maxDiscount ? `(Max $${coupon.maxDiscount})` : ''}` : 
                              `$${coupon.value.toFixed(2)}`}
                          </TableCell>
                          <TableCell>
                            {new Date(coupon.endDate).toLocaleDateString()}
                            {isExpired && <span className="text-red-500 ml-2">(Expired)</span>}
                          </TableCell>
                          <TableCell>
                            {coupon.usageCount} / {coupon.usageLimit}
                          </TableCell>
                          <TableCell>
                            <Badge variant={isActive ? "default" : "secondary"}>
                              {isActive ? "Active" : "Inactive"}
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
                                <DropdownMenuItem onClick={() => handleEditCoupon(coupon)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCopyCoupon(coupon.code)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Code
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteCoupon(coupon)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
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

      {/* Add Coupon Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Coupon</DialogTitle>
            <DialogDescription>
              Create a new discount coupon for your store.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input placeholder="SUMMER25" {...field} />
                    </FormControl>
                    <FormDescription>
                      Customers will enter this code at checkout.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
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
                      <FormLabel>Minimum Purchase</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Discount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="No limit" 
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty for no limit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of times this coupon can be used.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Active
                      </FormLabel>
                      <FormDescription>
                        This coupon will be available for use immediately.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Coupon</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Coupon Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>
              Update the details for coupon "{selectedCoupon?.code}".
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input placeholder="SUMMER25" {...field} />
                    </FormControl>
                    <FormDescription>
                      Customers will enter this code at checkout.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
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
                      <FormLabel>Minimum Purchase</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Discount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="No limit" 
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty for no limit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of times this coupon can be used.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Active
                      </FormLabel>
                      <FormDescription>
                        This coupon will be available for use immediately.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Coupon</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the coupon "{selectedCoupon?.code}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CouponsPage;
