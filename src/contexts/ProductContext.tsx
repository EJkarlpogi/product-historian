import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface ProductHistory {
  id: string;
  productId: string;
  timestamp: string;
  changeType: "created" | "updated" | "price_changed" | "stock_changed" | "image_updated";
  changes: Record<string, { before: any; after: any }>;
  changedBy: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductContextType {
  products: Product[];
  productHistory: ProductHistory[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  getProduct: (id: string) => Product | undefined;
  getProductHistory: (productId: string) => ProductHistory[];
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

// Sample initial data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone X",
    description: "Latest flagship smartphone with advanced features",
    price: 999.99,
    category: "Electronics",
    stock: 50,
    sku: "PHONE-X-001",
    imageUrl: "https://placehold.co/300x300/e4e4e7/6366f1?text=Smartphone+X&font=open-sans",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1499.99,
    category: "Electronics",
    stock: 30,
    sku: "LAPTOP-PRO-002",
    imageUrl: "https://placehold.co/300x300/e4e4e7/6366f1?text=Laptop+Pro&font=open-sans",
    createdAt: "2023-06-10T14:45:00Z",
    updatedAt: "2023-06-20T09:15:00Z",
  },
  {
    id: "3",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 249.99,
    category: "Audio",
    stock: 100,
    sku: "AUDIO-HP-003",
    imageUrl: "https://placehold.co/300x300/e4e4e7/6366f1?text=Headphones&font=open-sans",
    createdAt: "2023-07-05T11:20:00Z",
    updatedAt: "2023-07-05T11:20:00Z",
  },
];

const initialProductHistory: ProductHistory[] = [
  {
    id: "hist-1",
    productId: "1",
    timestamp: "2023-05-15T10:30:00Z",
    changeType: "created",
    changes: {
      all: {
        before: null,
        after: {
          name: "Smartphone X",
          price: 999.99,
          stock: 50,
        },
      },
    },
    changedBy: "Admin User",
  },
  {
    id: "hist-2",
    productId: "2",
    timestamp: "2023-06-10T14:45:00Z",
    changeType: "created",
    changes: {
      all: {
        before: null,
        after: {
          name: "Laptop Pro",
          price: 1499.99,
          stock: 30,
        },
      },
    },
    changedBy: "Admin User",
  },
  {
    id: "hist-3",
    productId: "2",
    timestamp: "2023-06-20T09:15:00Z",
    changeType: "price_changed",
    changes: {
      price: {
        before: 1399.99,
        after: 1499.99,
      },
    },
    changedBy: "Admin User",
  },
  {
    id: "hist-4",
    productId: "3",
    timestamp: "2023-07-05T11:20:00Z",
    changeType: "created",
    changes: {
      all: {
        before: null,
        after: {
          name: "Wireless Headphones",
          price: 249.99,
          stock: 100,
        },
      },
    },
    changedBy: "Admin User",
  },
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productHistory, setProductHistory] = useState<ProductHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, getUserName } = useAuth();

  useEffect(() => {
    // Simulate fetching data from an API
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Load from localStorage or use initial data
        const savedProducts = localStorage.getItem("products");
        const savedHistory = localStorage.getItem("productHistory");
        
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          setProducts(initialProducts);
        }
        
        if (savedHistory) {
          setProductHistory(JSON.parse(savedHistory));
        } else {
          setProductHistory(initialProductHistory);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (productHistory.length > 0) {
      localStorage.setItem("productHistory", JSON.stringify(productHistory));
    }
  }, [productHistory]);

  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      
      const timestamp = new Date().toISOString();
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      // Add product to list
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      
      // Record in history
      const historyEntry: ProductHistory = {
        id: `hist-${Date.now()}`,
        productId: newProduct.id,
        timestamp,
        changeType: "created",
        changes: {
          all: {
            before: null,
            after: {
              name: newProduct.name,
              price: newProduct.price,
              stock: newProduct.stock,
            },
          },
        },
        changedBy: getUserName(),
      };
      
      setProductHistory((prevHistory) => [...prevHistory, historyEntry]);
      
      toast.success("Product added successfully");
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      
      const timestamp = new Date().toISOString();
      const productIndex = products.findIndex((p) => p.id === id);
      
      if (productIndex === -1) {
        throw new Error("Product not found");
      }
      
      const oldProduct = products[productIndex];
      const updatedProduct = {
        ...oldProduct,
        ...updates,
        updatedAt: timestamp,
      };
      
      // Update product
      const newProducts = [...products];
      newProducts[productIndex] = updatedProduct;
      setProducts(newProducts);
      
      // Record changes in history
      const changes: Record<string, { before: any; after: any }> = {};
      let changeType: ProductHistory["changeType"] = "updated";
      
      // Determine what changed and set the change type
      Object.keys(updates).forEach((key) => {
        const typedKey = key as keyof Product;
        if (oldProduct[typedKey] !== updates[typedKey]) {
          changes[key] = {
            before: oldProduct[typedKey],
            after: updates[typedKey],
          };
          
          if (key === "price") changeType = "price_changed";
          if (key === "stock") changeType = "stock_changed";
          if (key === "imageUrl") changeType = "image_updated";
        }
      });
      
      const historyEntry: ProductHistory = {
        id: `hist-${Date.now()}`,
        productId: id,
        timestamp,
        changeType,
        changes,
        changedBy: getUserName(),
      };
      
      setProductHistory((prevHistory) => [...prevHistory, historyEntry]);
      
      toast.success("Product updated successfully");
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getProductHistory = (productId: string) => {
    return productHistory
      .filter((h) => h.productId === productId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      
      // Remove product
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
      
      // We don't remove history entries, but we could add a "deleted" entry
      const timestamp = new Date().toISOString();
      const deletedProduct = products.find((p) => p.id === id);
      
      if (deletedProduct) {
        const historyEntry: ProductHistory = {
          id: `hist-${Date.now()}`,
          productId: id,
          timestamp,
          changeType: "updated", // Using "updated" as we don't have a "deleted" type
          changes: {
            status: {
              before: "active",
              after: "deleted",
            },
          },
          changedBy: getUserName(),
        };
        
        setProductHistory((prevHistory) => [...prevHistory, historyEntry]);
      }
      
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productHistory,
        isLoading,
        addProduct,
        updateProduct,
        getProduct,
        getProductHistory,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Import inside the file to avoid circular dependencies
import { useAuth } from "@/contexts/AuthContext";
