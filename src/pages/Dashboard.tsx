
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { Package, History, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { products, productHistory } = useProducts();
  const { user } = useAuth();
  
  // Calculate total products value
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  
  // Recent history (last 5 entries)
  const recentHistory = [...productHistory]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
  
  // Get product name by id
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };
  
  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Format change type to readable text
  const formatChangeType = (type: string) => {
    switch (type) {
      case "created": return "Created";
      case "updated": return "Updated";
      case "price_changed": return "Price Changed";
      case "stock_changed": return "Stock Updated";
      case "image_updated": return "Image Updated";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "User"}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Manage all your products in the inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Total value of all products in stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Changes</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              All recorded product changes and updates
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              The latest product changes in your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHistory.length > 0 ? (
                recentHistory.map((history) => (
                  <div key={history.id} className="flex items-start">
                    <div className="mr-4 rounded-full p-2 bg-muted">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {formatChangeType(history.changeType)}: 
                        <Link 
                          to={`/products/${history.productId}`}
                          className="text-primary hover:underline ml-1"
                        >
                          {getProductName(history.productId)}
                        </Link>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        By {history.changedBy} on {formatDate(history.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No recent activity found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
