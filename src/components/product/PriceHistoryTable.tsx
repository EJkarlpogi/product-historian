
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts, PriceHistory } from "@/contexts/ProductContext";

interface PriceHistoryTableProps {
  productId: string;
}

const PriceHistoryTable: React.FC<PriceHistoryTableProps> = ({ productId }) => {
  const { getProductPriceHistory } = useProducts();
  const priceHistory = getProductPriceHistory(productId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  if (priceHistory.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No price history available for this product.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A history of price changes for this product</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Effective Date</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {priceHistory.map((entry, index) => (
          <TableRow key={`${entry.prodcode}-${entry.effdate}`} className={index === 0 ? "bg-muted/50" : ""}>
            <TableCell>{formatDate(entry.effdate)}</TableCell>
            <TableCell className="text-right font-medium">{formatPrice(entry.unitprice)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PriceHistoryTable;
