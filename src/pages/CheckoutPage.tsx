
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Address } from "@/lib/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { countries } from "@/lib/data";

// Define a schema for form validation
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(4, "Postal/ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  paymentMethod: z.enum(["credit-card", "paypal", "bank-transfer"]),
  saveInfo: z.boolean().optional(),
  // Fixed the error: the terms field now correctly accepts boolean but is validated to be true
  terms: z.boolean({
    required_error: "You must accept the terms and conditions",
  }).refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // Shipping calculation
  const shippingCost = subtotal >= 75 ? 0 : 15;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;

  const defaultValues: Partial<CheckoutFormValues> = {
    fullName: user?.name || "",
    email: user?.email || "",
    country: "US",
    paymentMethod: "credit-card",
    saveInfo: true,
    terms: false,
  };

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });

  const onSubmit = (values: CheckoutFormValues) => {
    setProcessing(true);

    // Create the shipping address
    const shippingAddress: Address = {
      fullName: values.fullName,
      streetAddress: values.streetAddress,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      phone: values.phone,
    };

    // Simulate API call with a timeout
    setTimeout(() => {
      // Clear cart and redirect to success page
      const orderId = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      
      // Store order in localStorage (in a real app, this would be sent to a backend)
      const order = {
        id: orderId,
        items,
        subtotal,
        shipping: shippingCost,
        tax,
        total,
        shippingAddress,
        paymentMethod: values.paymentMethod,
        date: new Date().toISOString(),
      };
      
      // Append to orders array in localStorage
      let orders = [];
      try {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
          orders = JSON.parse(storedOrders);
        }
      } catch (error) {
        console.error("Error reading orders from localStorage", error);
      }
      
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      
      // Clear cart
      clearCart();
      
      setProcessing(false);
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${orderId}`);
    }, 2000);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="w-full lg:w-2/3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, Apt 4B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Save Information */}
                  <FormField
                    control={form.control}
                    name="saveInfo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Save this information for future orders
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2 border rounded-lg p-4">
                            <RadioGroupItem value="credit-card" id="credit-card" />
                            <Label htmlFor="credit-card" className="flex-1">Credit / Debit Card</Label>
                            <div className="flex gap-2">
                              <div className="bg-gray-100 rounded p-1">Visa</div>
                              <div className="bg-gray-100 rounded p-1">MC</div>
                              <div className="bg-gray-100 rounded p-1">Amex</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal" className="flex-1">PayPal</Label>
                            <div className="bg-blue-500 text-white rounded p-1 text-sm">PayPal</div>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4">
                            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                            <Label htmlFor="bank-transfer" className="flex-1">Bank Transfer</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the{" "}
                        <a href="/terms" className="text-primary hover:underline">
                          terms and conditions
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="pt-4 lg:hidden">
                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="border rounded-lg p-6 bg-gray-50 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="max-h-80 overflow-y-auto mb-6">
              {items.map((item) => {
                const price = item.product.salePrice || item.product.price;
                return (
                  <div key={item.productId} className="flex py-2">
                    <div className="w-16 h-16 mr-4 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-medium">${(price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 hidden lg:block">
              <Button 
                type="submit"
                className="w-full" 
                onClick={form.handleSubmit(onSubmit)}
                disabled={processing}
              >
                {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Your personal data will be used to process your order, support your
              experience, and for other purposes described in our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
