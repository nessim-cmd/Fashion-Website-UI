import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products, categories } from "@/lib/data";
import { Product, ProductColor } from "@/lib/types";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Plus, Trash, Save, ArrowLeft } from "lucide-react";

// Form schema
const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  salePrice: z.coerce.number().nonnegative().optional().nullable(),
  categoryId: z.string({ required_error: "Please select a category" }),
  subcategoryId: z.string().optional(),
  subSubcategoryId: z.string().optional(),
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [productSizes, setProductSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [productColors, setProductColors] = useState<ProductColor[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      salePrice: null,
      categoryId: "",
      subcategoryId: "",
      subSubcategoryId: "",
      featured: false,
      inStock: true,
      slug: "",
    },
  });

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          subSubcategoryId: product.subSubcategoryId,
          featured: product.featured,
          inStock: product.inStock,
          slug: product.slug,
        });
        
        setSelectedCategory(product.categoryId);
        setSelectedSubcategory(product.subcategoryId || null);
        setProductImages(product.images || []);
        setProductSizes(product.sizes || []);
        setProductColors(product.colors || []);
      }
    }
  }, [isEditMode, id, form]);

  // Handle category change
  useEffect(() => {
    if (selectedCategory) {
      form.setValue("categoryId", selectedCategory);
      form.setValue("subcategoryId", "");
      form.setValue("subSubcategoryId", "");
      setSelectedSubcategory(null);
    }
  }, [selectedCategory, form]);

  // Handle subcategory change
  useEffect(() => {
    if (selectedSubcategory) {
      form.setValue("subcategoryId", selectedSubcategory);
      form.setValue("subSubcategoryId", "");
    }
  }, [selectedSubcategory, form]);

  // Get subcategories based on selected category
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    const category = categories.find(c => c.id === selectedCategory);
    return category?.subcategories || [];
  };

  // Get sub-subcategories based on selected subcategory
  const getSubSubcategories = () => {
    if (!selectedCategory || !selectedSubcategory) return [];
    const category = categories.find(c => c.id === selectedCategory);
    const subcategory = category?.subcategories?.find(s => s.id === selectedSubcategory);
    return subcategory?.subSubcategories || [];
  };

  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    // Create product object
    const productData: Partial<Product> = {
      ...data,
      images: productImages,
      sizes: productSizes.length > 0 ? productSizes : undefined,
      colors: productColors.length > 0 ? productColors : undefined,
      rating: isEditMode ? products.find(p => p.id === id)?.rating || 0 : 0,
      reviewCount: isEditMode ? products.find(p => p.id === id)?.reviewCount || 0 : 0,
    };
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode) {
        toast({
          title: "Product updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        toast({
          title: "Product created",
          description: `${data.name} has been created successfully.`,
        });
      }
      setIsSubmitting(false);
      navigate("/admin/products");
    }, 1000);
  };

  // Handle image addition
  const handleAddImage = () => {
    if (imageUrl && !productImages.includes(imageUrl)) {
      setProductImages([...productImages, imageUrl]);
      setImageUrl("");
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  // Handle size addition
  const handleAddSize = () => {
    if (sizeInput && !productSizes.includes(sizeInput)) {
      setProductSizes([...productSizes, sizeInput]);
      setSizeInput("");
    }
  };

  // Handle size removal
  const handleRemoveSize = (size: string) => {
    setProductSizes(productSizes.filter(s => s !== size));
  };

  // Handle color addition
  const handleAddColor = () => {
    if (colorName && colorHex && !productColors.some(c => c.name === colorName)) {
      setProductColors([...productColors, { name: colorName, hex: colorHex }]);
      setColorName("");
      setColorHex("#000000");
    }
  };

  // Handle color removal
  const handleRemoveColor = (colorName: string) => {
    setProductColors(productColors.filter(c => c.name !== colorName));
  };

  // Generate slug from name
  const generateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", slug);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/products")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Enter the basic details of your product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
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
                            <Textarea
                              placeholder="Enter product description"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sale Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={field.value === null ? "" : field.value}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Leave empty if not on sale
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                setSelectedCategory(value);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subcategoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subcategory</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                setSelectedSubcategory(value);
                                field.onChange(value);
                              }}
                              disabled={!selectedCategory}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getSubcategories().map((subcategory) => (
                                  <SelectItem key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subSubcategoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub-subcategory</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!selectedSubcategory}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select sub-subcategory" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getSubSubcategories().map((subSubcategory) => (
                                  <SelectItem key={subSubcategory.id} value={subSubcategory.id}>
                                    {subSubcategory.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input placeholder="product-slug" {...field} />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={generateSlug}
                              >
                                Generate
                              </Button>
                            </div>
                            <FormDescription>
                              Used in the URL, e.g., /product/product-slug
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Add images for your product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={handleAddImage}
                        disabled={!imageUrl}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {productImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden border"
                        >
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {productImages.length === 0 && (
                      <div className="text-center py-8 border rounded-md">
                        <p className="text-muted-foreground">
                          No images added yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attributes Tab */}
              <TabsContent value="attributes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Attributes</CardTitle>
                    <CardDescription>
                      Add sizes and colors for your product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sizes */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Sizes</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter size (e.g., S, M, L, XL)"
                          value={sizeInput}
                          onChange={(e) => setSizeInput(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={handleAddSize}
                          disabled={!sizeInput}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {productSizes.map((size) => (
                          <div
                            key={size}
                            className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full"
                          >
                            <span>{size}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => handleRemoveSize(size)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {productSizes.length === 0 && (
                        <div className="text-center py-4 border rounded-md mt-4">
                          <p className="text-muted-foreground">
                            No sizes added yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Colors */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Colors</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Color name (e.g., Red, Blue)"
                          value={colorName}
                          onChange={(e) => setColorName(e.target.value)}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={colorHex}
                            onChange={(e) => setColorHex(e.target.value)}
                            className="w-16 p-1 h-10"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleAddColor}
                          disabled={!colorName || !colorHex}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {productColors.map((color) => (
                          <div
                            key={color.name}
                            className="flex items-center gap-2 border p-3 rounded-md"
                          >
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="flex-1">{color.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveColor(color.name)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {productColors.length === 0 && (
                        <div className="text-center py-4 border rounded-md mt-4">
                          <p className="text-muted-foreground">
                            No colors added yet
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Settings</CardTitle>
                    <CardDescription>
                      Manage product inventory and visibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="inStock"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              In Stock
                            </FormLabel>
                            <FormDescription>
                              Mark this product as in stock
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Featured Product
                            </FormLabel>
                            <FormDescription>
                              Show this product in featured sections
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default ProductFormPage;
