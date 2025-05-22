/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Search, MoreHorizontal, Plus, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React from "react";

// Mock categories data with hierarchical structure
const mockCategories = [
  {
    id: "cat-1",
    name: "Women's Clothing",
    slug: "womens-clothing",
    description: "Clothing items for women",
    subcategories: [
      {
        id: "subcat-1",
        name: "Dresses",
        slug: "dresses",
        description: "Women's dresses",
        parent: "cat-1",
        subcategories: [
          {
            id: "subsubcat-1",
            name: "Summer Dresses",
            slug: "summer-dresses",
            description: "Summer dresses for women",
            parent: "subcat-1"
          },
          {
            id: "subsubcat-2",
            name: "Evening Dresses",
            slug: "evening-dresses",
            description: "Evening and formal dresses",
            parent: "subcat-1"
          }
        ]
      },
      {
        id: "subcat-2",
        name: "Tops",
        slug: "tops",
        description: "Women's tops and blouses",
        parent: "cat-1",
        subcategories: []
      },
      {
        id: "subcat-3",
        name: "Bottoms",
        slug: "bottoms",
        description: "Women's pants, skirts, and shorts",
        parent: "cat-1",
        subcategories: []
      }
    ]
  },
  {
    id: "cat-2",
    name: "Men's Clothing",
    slug: "mens-clothing",
    description: "Clothing items for men",
    subcategories: [
      {
        id: "subcat-4",
        name: "Shirts",
        slug: "shirts",
        description: "Men's shirts",
        parent: "cat-2",
        subcategories: []
      },
      {
        id: "subcat-5",
        name: "Pants",
        slug: "pants",
        description: "Men's pants and trousers",
        parent: "cat-2",
        subcategories: []
      }
    ]
  },
  {
    id: "cat-3",
    name: "Accessories",
    slug: "accessories",
    description: "Fashion accessories",
    subcategories: [
      {
        id: "subcat-6",
        name: "Bags",
        slug: "bags",
        description: "Handbags and purses",
        parent: "cat-3",
        subcategories: []
      },
      {
        id: "subcat-7",
        name: "Jewelry",
        slug: "jewelry",
        description: "Fashion jewelry",
        parent: "cat-3",
        subcategories: []
      }
    ]
  },
  {
    id: "cat-4",
    name: "Footwear",
    slug: "footwear",
    description: "Shoes and boots",
    subcategories: []
  },
  {
    id: "cat-5",
    name: "Seasonal",
    slug: "seasonal",
    description: "Seasonal collections",
    subcategories: []
  }
];

// Form schema for category creation/editing
const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens.",
  }),
  description: z.string().optional(),
  parent: z.string().optional(),
});

const CategoriesAdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [parentCategory, setParentCategory] = useState<string | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.email !== "admin@example.com") {
      navigate("/");
    }
  }, [user, navigate]);

  // Setup form for adding/editing categories
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent: "",
    },
  });

  // Filter categories based on search term
  const filteredCategories = searchTerm
    ? flattenCategories(mockCategories).filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockCategories;

  // Helper function to flatten the category hierarchy for searching
  function flattenCategories(categories: any[], parentPath = ""): any[] {
    return categories.reduce((acc, category) => {
      const currentPath = parentPath ? `${parentPath} > ${category.name}` : category.name;
      const flatCategory = { ...category, path: currentPath };
      
      if (category.subcategories && category.subcategories.length > 0) {
        return [...acc, flatCategory, ...flattenCategories(category.subcategories, currentPath)];
      }
      
      return [...acc, flatCategory];
    }, []);
  }

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCategory = (parentId: string | null = null) => {
    setParentCategory(parentId);
    form.reset({
      name: "",
      slug: "",
      description: "",
      parent: parentId || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parent: category.parent || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const onSubmitAdd = (values: z.infer<typeof categoryFormSchema>) => {
    // In a real app, this would call an API to create the category
    toast({
      title: "Category created",
      description: `${values.name} has been created successfully.`,
    });
    setIsAddDialogOpen(false);
  };

  const onSubmitEdit = (values: z.infer<typeof categoryFormSchema>) => {
    // In a real app, this would call an API to update the category
    toast({
      title: "Category updated",
      description: `${values.name} has been updated successfully.`,
    });
    setIsEditDialogOpen(false);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the category
    toast({
      title: "Category deleted",
      description: `${selectedCategory?.name} has been deleted.`,
    });
    setIsDeleteDialogOpen(false);
  };

  // Render category tree recursively
  const renderCategoryTree = (categories: any[], level = 0) => {
    return categories.map((category) => {
      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
      const isExpanded = expandedCategories.includes(category.id);
      
      return (
        <React.Fragment key={category.id}>
          <TableRow>
            <TableCell className="font-medium">
              <div 
                className="flex items-center" 
                style={{ paddingLeft: `${level * 1.5}rem` }}
              >
                {hasSubcategories && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 mr-2"
                    onClick={() => toggleExpand(category.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                {!hasSubcategories && <div className="w-8" />}
                {category.name}
              </div>
            </TableCell>
            <TableCell>{category.slug}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleAddCategory(category.id)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subcategory
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          
          {hasSubcategories && isExpanded && renderCategoryTree(category.subcategories, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">
              Manage product categories and subcategories
            </p>
          </div>
          <Button onClick={() => handleAddCategory()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Management</CardTitle>
            <CardDescription>
              View, edit, and organize your product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchTerm ? (
                      // Flat list for search results
                      filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            {category.path || category.name}
                          </TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleAddCategory(category.id)}>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Subcategory
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteCategory(category)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Tree view for normal display
                      renderCategoryTree(filteredCategories)
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {parentCategory ? "Add Subcategory" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {parentCategory 
                ? "Create a new subcategory within the selected category." 
                : "Create a new top-level category."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Category description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the details for "{selectedCategory?.name}".
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Category description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
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
              Are you sure you want to delete "{selectedCategory?.name}"? 
              {selectedCategory?.subcategories?.length > 0 && 
                " This will also delete all subcategories."}
              This action cannot be undone.
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

export default CategoriesAdminPage;
