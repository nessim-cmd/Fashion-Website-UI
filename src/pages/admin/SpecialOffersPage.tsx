/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { specialOffers } from "@/lib/data";
import { SpecialOffer } from "@/lib/types";

const SpecialOffersPage = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<SpecialOffer[]>(specialOffers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<SpecialOffer>({
    id: '',
    value: '',
    title: '',
    description: '',
    buttonText: 'Shop Now',
    linkUrl: '/products',
    isActive: true,
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentOffer({
      ...currentOffer,
      [name]: value,
    });
  };

  // Handle switch change
  const handleSwitchChange = (checked: boolean) => {
    setCurrentOffer({
      ...currentOffer,
      isActive: checked,
    });
  };

  // Open add dialog
  const openAddDialog = () => {
    setCurrentOffer({
      id: '',
      value: '',
      title: '',
      description: '',
      buttonText: 'Shop Now',
      linkUrl: '/products',
      isActive: true,
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (offer: SpecialOffer) => {
    setCurrentOffer({ ...offer });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Save offer
  const saveOffer = () => {
    if (isEditMode) {
      // Update existing offer
      const updatedOffers = offers.map(offer => 
        offer.id === currentOffer.id ? currentOffer : offer
      );
      setOffers(updatedOffers);
      toast({
        title: "Special offer updated",
        description: `Special offer "${currentOffer.title}" has been updated.`,
      });
    } else {
      // Add new offer
      const newId = Math.max(...offers.map(offer => parseInt(offer.id)), 0) + 1;
      const newOffer = {
        ...currentOffer,
        id: newId.toString(),
      };
      setOffers([...offers, newOffer]);
      toast({
        title: "Special offer created",
        description: `Special offer "${currentOffer.title}" has been created.`,
      });
    }
    
    setIsDialogOpen(false);
  };

  // Delete offer
  const deleteOffer = (id: string) => {
    const updatedOffers = offers.filter(offer => offer.id !== id);
    setOffers(updatedOffers);
    toast({
      title: "Special offer deleted",
      description: "The special offer has been deleted.",
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Special Offers</h1>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Special Offer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Special Offers</CardTitle>
            <CardDescription>
              Create and manage special offers displayed on your homepage. These offers can highlight discounts, promotions, or special deals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {offers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Value</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-bold text-xl">{offer.value}</TableCell>
                      <TableCell className="font-medium">{offer.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{offer.description}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          offer.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(offer)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteOffer(offer.id)}
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
                No special offers found. Click "Add Special Offer" to create your first offer.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Special Offer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Special Offer' : 'Add New Special Offer'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update the special offer details below.' 
                : 'Fill in the details for the new special offer.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  name="value"
                  value={currentOffer.value}
                  onChange={handleInputChange}
                  placeholder="e.g. 10% or $15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentOffer.title}
                  onChange={handleInputChange}
                  placeholder="e.g. First Order Discount"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={currentOffer.description}
                onChange={handleInputChange}
                placeholder="e.g. Use code WELCOME10 at checkout"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  name="buttonText"
                  value={currentOffer.buttonText}
                  onChange={handleInputChange}
                  placeholder="e.g. Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="linkUrl"
                    name="linkUrl"
                    value={currentOffer.linkUrl}
                    onChange={handleInputChange}
                    placeholder="e.g. /products"
                  />
                  {currentOffer.linkUrl && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      asChild
                    >
                      <a href={currentOffer.linkUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={currentOffer.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveOffer} disabled={!currentOffer.value || !currentOffer.title || !currentOffer.description}>
              {isEditMode ? 'Update' : 'Create'} Special Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SpecialOffersPage;
