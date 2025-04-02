
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Archive, BarChart, Home, Package, Settings } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Products",
    icon: Package,
    path: "/products",
  },
  {
    title: "Product History",
    icon: Archive,
    path: "/product-history",
  },
  {
    title: "Reports",
    icon: BarChart,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-md bg-primary w-8 h-8">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Product Historian</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 text-sidebar-foreground",
                    location.pathname === item.path && "text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
