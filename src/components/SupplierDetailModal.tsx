import { useEffect } from "react";

export type SupplierDetail = {
  id: string;
  name: string;
  supId: string;
  contactName: string;
  contactRole: string;
  category: string;
  phone: string;
  email?: string;
  address?: string;
  taxId?: string;
  status: string;
  initials: string;
  colorClass: string;
  
  notes?: string;
  joinedDate?: string;
};

type Props = {
  open: boolean;
  supplier: SupplierDetail | null;
  onClose: () => void;
  onEdit?: (s: SupplierDetail) => void;
  onDelete?: (s: SupplierDetail) => void;
};

export default function SupplierDetailModal({
  open,
  supplier,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !supplier) return null;

  const getStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (status === "Pending") return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (status === "Inactive") return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1c252e] w-full max-w-2xl rounded-xl shadow-2xl border border-[#283039] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#283039] bg-[#1c252e]">
          <h3 className="text-xl font-bold text-white">Supplier Details</h3>
          <button
            className="text-[#9dabb9] hover:text-white transition-colors rounded-lg p-1 hover:bg-[#283039]"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-8">
            
            <div className="w-full md:w-1/3 flex flex-col gap-4 items-center text-center md:items-start md:text-left">
              <div 
                className={`aspect-square w-full max-w-[180px] rounded-2xl flex items-center justify-center text-5xl font-bold border ${supplier.colorClass}`}
              >
                {supplier.initials}
              </div>

              <div className="w-full p-4 rounded-xl bg-[#111418] border border-[#283039]">
                 <InfoItem label="Supplier ID" value={supplier.supId} mono />
                 <div className="h-4" />
                 <InfoItem label="Tax ID" value={supplier.taxId ?? "N/A"} mono />
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-6">
              
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {supplier.name}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(supplier.status)}`}>
                    {supplier.status}
                  </span>
                </div>
                <p className="text-[#9dabb9] text-sm">
                   Partner since {supplier.joinedDate ?? "2024"}
                </p>
              </div>

              <div className="h-px bg-[#283039]" />

              <div>
                 <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">person</span>
                    Contact Person
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Full Name" value={supplier.contactName} />
                    <InfoItem label="Job Title" value={supplier.contactRole} />
                 </div>
              </div>

              <div>
                 <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">call</span>
                    Contact Information
                 </h4>
                 <div className="grid grid-cols-1 gap-4">
                    <InfoItem label="Phone Number" value={supplier.phone} />
                    <InfoItem label="Email Address" value={supplier.email ?? "N/A"} />
                    <InfoItem label="Office Address" value={supplier.address ?? "N/A"} />
                 </div>
              </div>

              <div>
                 <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">category</span>
                    Business Category
                 </h4>
                 <span className="inline-block px-3 py-1 rounded-lg bg-[#283039] border border-[#3e4a56] text-[#ced4da] text-sm">
                    {supplier.category}
                 </span>
              </div>

            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#283039] bg-[#1c252e] flex flex-col sm:flex-row gap-3 justify-end">
          <button
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors font-medium flex items-center justify-center gap-2"
            onClick={() => onDelete?.(supplier)}
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Delete
          </button>

          <button
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            onClick={() => onEdit?.(supplier)}
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[#9dabb9] text-xs uppercase tracking-wider font-semibold">
        {label}
      </span>
      <span className={["text-white text-sm", mono ? "font-mono" : ""].join(" ")}>
        {value}
      </span>
    </div>
  );
}
