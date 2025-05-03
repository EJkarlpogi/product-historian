
import React from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductPriceManager from "@/components/product/ProductPriceManager";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, isLoading } = useProducts();
  
  const product = id ? getProduct(id) : undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="text-muted-foreground">The product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-muted-foreground">Product Details</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="absolute inset-0 object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p className="text-muted-foreground">{product.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold">SKU</h3>
                  <p className="text-muted-foreground">{product.sku}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Stock</h3>
                  <p className="text-muted-foreground">{product.stock} units</p>
                </div>
                <div>
                  <h3 className="font-semibold">Created</h3>
                  <p className="text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Management Section */}
        <ProductPriceManager product={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
