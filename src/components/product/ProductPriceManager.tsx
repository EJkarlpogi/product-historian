
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/contexts/ProductContext";
import UpdatePriceForm from "./UpdatePriceForm";
import PriceHistoryTable from "./PriceHistoryTable";

interface ProductPriceManagerProps {
  product: Product;
}

const ProductPriceManager: React.FC<ProductPriceManagerProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<string>("current");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Management</CardTitle>
        <CardDescription>View and update product pricing</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="current">Current Price</TabsTrigger>
            <TabsTrigger value="update">Update Price</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  ${product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-muted-foreground text-sm">Current price</span>
              </div>
              <p className="text-muted-foreground">
                Last updated on {new Date(product.updatedAt).toLocaleDateString()}
              </p>
              <button 
                className="text-primary hover:underline text-sm"
                onClick={() => setActiveTab("history")}
              >
                View price history
              </button>
            </div>
          </TabsContent>
          <TabsContent value="update">
            <UpdatePriceForm 
              product={product} 
              onSuccess={() => setActiveTab("history")}
            />
          </TabsContent>
          <TabsContent value="history">
            <PriceHistoryTable productId={product.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductPriceManager;
