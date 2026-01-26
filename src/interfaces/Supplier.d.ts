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
  colorClass: string;
}

interface SupplierStat {
  label: string;
  value: string;
  icon: string;
  colorClass: string;
}
