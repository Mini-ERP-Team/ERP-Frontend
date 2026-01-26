interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  stockPercent: number;
  image?: string;
  icon?: string;
}
