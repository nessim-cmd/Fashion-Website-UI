import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const AttributesPage = () => {
  const { toast } = useToast();
  const [attributes, setAttributes] = useState([
    { id: 1, name: "Color", values: ["Red", "Blue", "Green", "Black", "White"], isActive: true },
    { id: 2, name: "Size", values: ["S", "M", "L", "XL", "XXL"], isActive: true },
    { id: 3, name: "Material", values: ["Cotton", "Polyester", "Wool", "Silk", "Leather"], isActive: true },
    { id: 4, name: "Weight", values: ["Light", "Medium", "Heavy"], isActive: false },
  ]);
  
  const [attributeValues, setAttributeValues] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false);
  const [newAttribute, setNewAttribute] = useState({ name: "", isActive: true });
  const [newValue, setNewValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Handle attribute selection
  const handleSelectAttribute = (attribute) => {
    setSelectedAttribute(attribute);
    setAttributeValues(attribute.values);
  };

  // Handle adding new attribute
  const handleAddAttribute = () => {
    if (editMode) {
      // Update existing attribute
      setAttributes(attributes.map(attr => 
        attr.id === editId ? { ...attr, name: newAttribute.name, isActive: newAttribute.isActive } : attr
      ));
      toast({
        title: "Attribute updated",
        description: `Attribute "${newAttribute.name}" has been updated.`,
      });
    } else {
      // Add new attribute
      const newId = Math.max(...attributes.map(attr => attr.id), 0) + 1;
      setAttributes([...attributes, { id: newId, name: newAttribute.name, values: [], isActive: newAttribute.isActive }]);
      toast({
        title: "Attribute created",
        description: `Attribute "${newAttribute.name}" has been created.`,
      });
    }
    
    setNewAttribute({ name: "", isActive: true });
    setIsAddDialogOpen(false);
    setEditMode(false);
    setEditId(null);
  };

  // Handle editing attribute
  const handleEditAttribute = (attribute) => {
    setNewAttribute({ name: attribute.name, isActive: attribute.isActive });
    setEditMode(true);
    setEditId(attribute.id);
    setIsAddDialogOpen(true);
  };

  // Handle deleting attribute
  const handleDeleteAttribute = (id) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
    if (selectedAttribute && selectedAttribute.id === id) {
      setSelectedAttribute(null);
      setAttributeValues([]);
    }
    toast({
      title: "Attribute deleted",
      description: "The attribute has been deleted.",
    });
  };

  // Handle adding new attribute value
  const handleAddValue = () => {
    if (!newValue.trim()) return;
    
    const updatedValues = [...attributeValues, newValue];
    setAttributeValues(updatedValues);
    
    // Update the attribute with new values
    setAttributes(attributes.map(attr => 
      attr.id === selectedAttribute.id ? { ...attr, values: updatedValues } : attr
    ));
    
    setSelectedAttribute({
      ...selectedAttribute,
      values: updatedValues
    });
    
    setNewValue("");
    setIsValueDialogOpen(false);
    
    toast({
      title: "Value added",
      description: `Value "${newValue}" has been added to ${selectedAttribute.name}.`,
    });
  };

  // Handle deleting attribute value
  const handleDeleteValue = (value) => {
    const updatedValues = attributeValues.filter(v => v !== value);
    setAttributeValues(updatedValues);
    
    // Update the attribute with new values
    setAttributes(attributes.map(attr => 
      attr.id === selectedAttribute.id ? { ...attr, values: updatedValues } : attr
    ));
    
    setSelectedAttribute({
      ...selectedAttribute,
      values: updatedValues
    });
    
    toast({
      title: "Value deleted",
      description: `Value "${value}" has been removed from ${selectedAttribute.name}.`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Attributes</h1>
        <Button onClick={() => {
          setNewAttribute({ name: "", isActive: true });
          setEditMode(false);
          setIsAddDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Attribute
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attributes List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
            <CardDescription>
              Manage product attributes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attributes.length > 0 ? (
                attributes.map((attribute) => (
                  <div 
                    key={attribute.id} 
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      selectedAttribute && selectedAttribute.id === attribute.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleSelectAttribute(attribute)}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{attribute.name}</span>
                      {!attribute.isActive && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAttribute(attribute);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAttribute(attribute.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No attributes found. Create one to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attribute Values */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedAttribute ? `${selectedAttribute.name} Values` : 'Attribute Values'}
            </CardTitle>
            <CardDescription>
              {selectedAttribute 
                ? `Manage values for the ${selectedAttribute.name} attribute` 
                : 'Select an attribute to manage its values'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAttribute ? (
              <>
                <div className="flex justify-between mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {attributeValues.length} values
                    </span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setIsValueDialogOpen(true)}
                    disabled={!selectedAttribute}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Value
                  </Button>
                </div>

                {attributeValues.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {attributeValues.map((value, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <span>{value}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteValue(value)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No values found for this attribute. Add some values to get started.
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                Select an attribute from the list to manage its values.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Attribute Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Attribute' : 'Add New Attribute'}</DialogTitle>
            <DialogDescription>
              {editMode 
                ? 'Update the attribute details below.' 
                : 'Enter the details for the new attribute.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attributeName">Attribute Name</Label>
              <Input
                id="attributeName"
                placeholder="e.g. Color, Size, Material"
                value={newAttribute.name}
                onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={newAttribute.isActive}
                onCheckedChange={(checked) => setNewAttribute({...newAttribute, isActive: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAttribute} disabled={!newAttribute.name.trim()}>
              {editMode ? 'Update' : 'Add'} Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Value Dialog */}
      <Dialog open={isValueDialogOpen} onOpenChange={setIsValueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Value</DialogTitle>
            <DialogDescription>
              Enter a new value for the {selectedAttribute?.name} attribute.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attributeValue">Value</Label>
              <Input
                id="attributeValue"
                placeholder={`e.g. ${selectedAttribute?.name === 'Color' ? 'Red, Blue' : selectedAttribute?.name === 'Size' ? 'S, M, L' : 'Value'}`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsValueDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddValue} disabled={!newValue.trim()}>
              Add Value
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttributesPage;
