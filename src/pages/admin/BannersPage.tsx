/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Image, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

// Mock data for banners
const initialBanners = [
  {
    id: 1,
    title: "Summer Collection",
    subtitle: "Up to 50% off on selected items",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    linkUrl: "/category/summer",
    position: "home_hero",
    isActive: true,
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Check out our latest products",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    linkUrl: "/products?sort=newest",
    position: "home_featured",
    isActive: true,
  },
  {
    id: 3,
    title: "Winter Sale",
    subtitle: "Prepare for winter with our collection",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    linkUrl: "/category/winter",
    position: "category_top",
    isActive: false,
  },
];

// Banner positions
const bannerPositions = [
  { value: "home_hero", label: "Home Page Hero" },
  { value: "home_featured", label: "Home Page Featured" },
  { value: "category_top", label: "Category Page Top" },
  { value: "product_sidebar", label: "Product Page Sidebar" },
];

const BannersPage = () => {
  const { toast } = useToast();
  const [banners, setBanners] = useState(initialBanners);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBanner, setCurrentBanner] = useState({
    id: 0,
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    position: "home_hero",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentBanner({
      ...currentBanner,
      [name]: value,
    });
  };

  // Handle switch change
  const handleSwitchChange = (checked: boolean) => {
    setCurrentBanner({
      ...currentBanner,
      isActive: checked,
    });
  };

  // Handle position select
  const handlePositionChange = (value: string) => {
    setCurrentBanner({
      ...currentBanner,
      position: value,
    });
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open add dialog
  const openAddDialog = () => {
    setCurrentBanner({
      id: 0,
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "",
      position: "home_hero",
      isActive: true,
    });
    setImageFile(null);
    setPreviewUrl(null);
    setIsEditMode(false);
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (banner: any) => {
    setCurrentBanner(banner);
    setImageFile(null);
    setPreviewUrl(banner.imageUrl);
    setIsEditMode(true);
    setIsAddDialogOpen(true);
  };

  // Save banner
  const saveBanner = () => {
    // In a real application, you would upload the image to a server here
    // and get back the URL to store in the banner object
    
    // For this demo, we'll simulate the image upload by using the preview URL
    // or keeping the existing URL for edits without a new image
    const imageUrl = previewUrl || currentBanner.imageUrl;
    
    if (isEditMode) {
      // Update existing banner
      const updatedBanners = banners.map(banner => 
        banner.id === currentBanner.id 
          ? { ...currentBanner, imageUrl } 
          : banner
      );
      setBanners(updatedBanners);
      toast({
        title: "Banner updated",
        description: `Banner "${currentBanner.title}" has been updated.`,
      });
    } else {
      // Add new banner
      const newId = Math.max(...banners.map(banner => banner.id), 0) + 1;
      const newBanner = {
        ...currentBanner,
        id: newId,
        imageUrl,
      };
      setBanners([...banners, newBanner]);
      toast({
        title: "Banner created",
        description: `Banner "${currentBanner.title}" has been created.`,
      });
    }
    
    setIsAddDialogOpen(false);
  };

  // Delete banner
  const deleteBanner = (id: number) => {
    const updatedBanners = banners.filter(banner => banner.id !== id);
    setBanners(updatedBanners);
    toast({
      title: "Banner deleted",
      description: "The banner has been deleted.",
    });
  };

  // Get position label
  const getPositionLabel = (value: string) => {
    const position = bannerPositions.find(pos => pos.value === value);
    return position ? position.label : value;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Banners</h1>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Banners</CardTitle>
            <CardDescription>
              Create and manage banners for your store. Banners can be displayed in various positions across your website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {banners.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Subtitle</TableHead>
                    <TableHead className="hidden md:table-cell">Position</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                          {banner.imageUrl ? (
                            <img 
                              src={banner.imageUrl} 
                              alt={banner.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{banner.subtitle}</TableCell>
                      <TableCell className="hidden md:table-cell">{getPositionLabel(banner.position)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          banner.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(banner)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteBanner(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No banners found. Click "Add Banner" to create your first banner.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Banner Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update the banner details below.' 
                : 'Fill in the details for the new banner.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentBanner.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Summer Collection"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select 
                  value={currentBanner.position} 
                  onValueChange={handlePositionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {bannerPositions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={currentBanner.subtitle}
                onChange={handleInputChange}
                placeholder="e.g. Up to 50% off on selected items"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="linkUrl"
                  name="linkUrl"
                  value={currentBanner.linkUrl}
                  onChange={handleInputChange}
                  placeholder="e.g. /category/summer"
                />
                {currentBanner.linkUrl && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    asChild
                  >
                    <a href={currentBanner.linkUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bannerImage">Banner Image</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended size: 1200 x 400 pixels
                  </p>
                </div>
                <div className="border rounded-md overflow-hidden h-32 bg-gray-50 flex items-center justify-center">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Image className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-muted-foreground mt-2">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={currentBanner.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBanner} disabled={!currentBanner.title || (!previewUrl && !currentBanner.imageUrl)}>
              {isEditMode ? 'Update' : 'Create'} Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BannersPage;
