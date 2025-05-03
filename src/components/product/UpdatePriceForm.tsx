
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useProducts, Product } from "@/contexts/ProductContext";

// Define the form schema
const priceFormSchema = z.object({
  price: z.coerce.number()
    .positive({ message: "Price must be a positive number" })
    .refine((val) => !isNaN(val), { message: "Price must be a valid number" }),
  effectiveDate: z.date({
    required_error: "Effective date is required",
  }),
});

type PriceFormValues = z.infer<typeof priceFormSchema>;

interface UpdatePriceFormProps {
  product: Product;
  onSuccess?: () => void;
}

const UpdatePriceForm: React.FC<UpdatePriceFormProps> = ({ product, onSuccess }) => {
  const { updateProductPrice } = useProducts();
  
  // Set default values for the form
  const defaultValues: Partial<PriceFormValues> = {
    price: product.price,
    effectiveDate: new Date(),
  };

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues,
  });

  async function onSubmit(data: PriceFormValues) {
    try {
      const formattedDate = format(data.effectiveDate, "yyyy-MM-dd");
      await updateProductPrice(product.id, data.price, formattedDate);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form to default values
      form.reset(defaultValues);
    } catch (error) {
      console.error("Error submitting price update:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      placeholder="0.00"
                      className="pl-6"
                      {...field}
                      step="0.01"
                      type="number"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the new price for the product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Effective Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal flex justify-start",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date when the new price becomes effective
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Update Price</Button>
      </form>
    </Form>
  );
};

export default UpdatePriceForm;
