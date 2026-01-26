interface Supplier {
  id: string;
  name: string;
  supId: string;
  contactName: string;
  contactRole: string;
  category: string;
  phone: string;
  status: "Active" | "Pending" | "Inactive";
  initials: string;
  colorClass: string; // Màu cho avatar
}

interface SupplierStat {
  label: string;
  value: string;
  icon: string;
  colorClass: string; // Màu text & bg icon
}
