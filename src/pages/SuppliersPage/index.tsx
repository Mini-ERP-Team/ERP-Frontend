import { useState } from "react";
import AddSupplierModal from "./components/AddSupplierModal";
import type { AddSupplierPayload } from "./components/AddSupplierModal";
import SupplierDetailModal from "./components/SupplierDetailModal";
import type { SupplierDetail } from "./components/SupplierDetailModal";

type SupplierStat = {
  label: string;
  value: string;
  icon: string;
  colorClass: string;
};

type Supplier = {
  id: string;
  name: string;
  supId: string;
  contactName: string;
  contactRole: string;
  category: string;
  phone: string;
  status: string;
  initials: string;
  colorClass: string;

  email?: string;
  address?: string;
  taxId?: string;
  joinedDate?: string;
};

const initialSuppliers: Supplier[] = [
  {
    id: "1",
    name: "TechGlobal Components",
    supId: "SUP-001",
    contactName: "Sarah Connor",
    contactRole: "Sales Manager",
    category: "Components",
    phone: "+1 (555) 012-3456",
    email: "sarah@techglobal.com",
    address: "123 Silicon Blvd, CA",
    taxId: "0312345678",
    status: "Active",
    initials: "TG",
    colorClass: "text-blue-400 bg-blue-500/20 border-blue-500/30",
    joinedDate: "2023",
  },
];

const stats: SupplierStat[] = [
  { label: "Total Suppliers", value: "142", icon: "domain", colorClass: "text-primary bg-primary/10" },
  { label: "Active Partners", value: "128", icon: "check_circle", colorClass: "text-green-500 bg-green-500/10" },
  { label: "Pending Review", value: "8", icon: "pending", colorClass: "text-orange-500 bg-orange-500/10" },
  { label: "Inactive", value: "6", icon: "block", colorClass: "text-red-500 bg-red-500/10" },
];

const getRandomColorClass = () => {
  const colors = [
    "text-blue-400 bg-blue-500/20 border-blue-500/30",
    "text-purple-400 bg-purple-500/20 border-purple-500/30",
    "text-orange-400 bg-orange-500/20 border-orange-500/30",
    "text-teal-400 bg-teal-500/20 border-teal-500/30",
    "text-pink-400 bg-pink-500/20 border-pink-500/30",
    "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-[#0bda5b]/10 text-[#0bda5b] border-[#0bda5b]/20"; // Active (Green)
  if (status === "Pending") styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (status === "Inactive") styles = "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      {status}
    </span>
  );
};

const SupplierAvatar = ({ initials, colorClass }: { initials: string; colorClass: string }) => (
  <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm border ${colorClass}`}>
    {initials}
  </div>
);

const SuppliersPage = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDetail | null>(null);

  const [suppliersList, setSuppliersList] = useState<Supplier[]>(initialSuppliers);

  const handleAddSupplier = (data: AddSupplierPayload) => {
    const newSupplier: Supplier = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.tennhacungcap,
      supId: data.manhacungcap || `SUP-${Math.floor(Math.random() * 1000)}`,
      contactName: data.nguoiLienHe || "N/A",
      contactRole: data.chucVu || "Staff",
      category: data.loaiHang || "General",
      phone: data.sdt || "-",

      email: data.email,
      address: data.diachi,
      taxId: data.masothue,
      
      status: "Active",
      initials: getInitials(data.tennhacungcap),
      colorClass: getRandomColorClass(),
      joinedDate: new Date().getFullYear().toString(),
    };

    setSuppliersList([newSupplier, ...suppliersList]);
    setIsAddOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Suppliers List</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your component and device vendor relationships.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 w-full sm:w-auto justify-center"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-medium text-sm">Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none">
            <div className={`p-2 rounded-lg ${stat.colorClass}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-medium uppercase">{stat.label}</p>
              <p className="text-gray-900 dark:text-white text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        
        <div className="p-4 border-b border-gray-100 dark:border-[#111418] flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["All", "Components", "Devices", "Accessories"].map((tab, idx) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  idx === 0
                    ? "bg-gray-100 dark:bg-[#1c2229] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e4a56]"
                    : "text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#323b46]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229]">
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[300px]">Company Name</th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Contact Person</th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Phone</th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
              {suppliersList.map((supplier) => (
                <tr 
                    key={supplier.id} 
                    className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group cursor-pointer"
                    onClick={() => setSelectedSupplier(supplier as SupplierDetail)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <SupplierAvatar initials={supplier.initials} colorClass={supplier.colorClass} />
                      <div>
                        <span className="text-gray-900 dark:text-white text-sm font-medium block">{supplier.name}</span>
                        <span className="text-text-secondary text-xs">ID: {supplier.supId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white text-sm">{supplier.contactName}</span>
                    </div>
                    <span className="text-text-secondary text-xs">{supplier.contactRole}</span>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-[#111418] border border-gray-200 dark:border-[#3e4a56] text-xs">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary text-sm font-mono">{supplier.phone}</td>
                  <td className="p-4 text-center">
                    <StatusBadge status={supplier.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button 
                        className="text-text-secondary hover:text-primary p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#3e4a56] transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 dark:border-[#111418] bg-white dark:bg-input-bg flex justify-between items-center text-sm">
        </div>
      </section>

      <AddSupplierModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={handleAddSupplier} 
      />

      <SupplierDetailModal
        open={!!selectedSupplier}
        supplier={selectedSupplier}
        onClose={() => setSelectedSupplier(null)}
        onEdit={(s) => {
            console.log("Edit requested for:", s);
        }}
        onDelete={(s) => {
            console.log("Delete requested for:", s);
        }}
      />
    </>
  );
};

export default SuppliersPage;
