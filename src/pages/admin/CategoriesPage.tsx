import { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "@/lib/data";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Plus, MoreHorizontal, Search, ChevronRight, ChevronDown } from "lucide-react";

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName && newCategorySlug) {
      // In a real app, this would call an API to add the category
      toast({
        title: "Category added",
        description: `Category "${newCategoryName}" has been added.`,
      });
      
      // Reset form
      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewCategorySlug("");
      setIsDialogOpen(false);
    }
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    // In a real app, this would call an API to delete the category
    toast({
      title: "Category deleted",
      description: `Category "${categoryName}" has been deleted.`,
    });
  };

  const generateSlug = () => {
    if (newCategoryName) {
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setNewCategorySlug(slug);
    }
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new product category
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Category description"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      placeholder="category-slug"
                      value={newCategorySlug}
                      onChange={(e) => setNewCategorySlug(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={generateSlug}>
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              Manage categories, subcategories, and sub-subcategories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search categories..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="/admin/attributes">
                <Button variant="outline">Manage Attributes</Button>
              </Link>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="w-[100px]">Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <>
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleCategoryExpansion(category.id)}
                              >
                                {expandedCategories.includes(category.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <span className="font-medium">{category.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{category.description || "-"}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {category.subcategories?.length || 0} subcategories
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
                                <Link to={`/admin/categories/edit/${category.id}`}>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                </Link>
                                <Link to={`/admin/categories/${category.id}/subcategories/new`}>
                                  <DropdownMenuItem>Add Subcategory</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteCategory(category.id, category.name)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        
                        {/* Subcategories */}
                        {expandedCategories.includes(category.id) &&
                          category.subcategories?.map((subcategory) => (
                            <>
                              <TableRow key={`${category.id}-${subcategory.id}`} className="bg-muted/50">
                                <TableCell>
                                  <div className="flex items-center gap-2 ml-6">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => toggleCategoryExpansion(`${category.id}-${subcategory.id}`)}
                                    >
                                      {expandedCategories.includes(`${category.id}-${subcategory.id}`) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <span>{subcategory.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{subcategory.description || "-"}</TableCell>
                                <TableCell>{subcategory.slug}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {subcategory.subSubcategories?.length || 0} sub-subcategories
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
                                      <Link to={`/admin/categories/${category.id}/subcategories/edit/${subcategory.id}`}>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                      </Link>
                                      <Link to={`/admin/categories/${category.id}/subcategories/${subcategory.id}/sub-subcategories/new`}>
                                        <DropdownMenuItem>Add Sub-subcategory</DropdownMenuItem>
                                      </Link>
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => handleDeleteCategory(subcategory.id, subcategory.name)}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                              
                              {/* Sub-subcategories */}
                              {expandedCategories.includes(`${category.id}-${subcategory.id}`) &&
                                subcategory.subSubcategories?.map((subSubcategory) => (
                                  <TableRow key={`${category.id}-${subcategory.id}-${subSubcategory.id}`} className="bg-muted/20">
                                    <TableCell>
                                      <div className="flex items-center gap-2 ml-12">
                                        <span>{subSubcategory.name}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>{subSubcategory.slug}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline">
                                        0 products
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
                                          <Link to={`/admin/categories/${category.id}/subcategories/${subcategory.id}/sub-subcategories/edit/${subSubcategory.id}`}>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                          </Link>
                                          <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => handleDeleteCategory(subSubcategory.id, subSubcategory.name)}
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </>
                          ))}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;
