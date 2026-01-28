import { useEffect, useRef, useState } from "react";
import AddSupplierModal from "./components/AddSupplierModal";
import SupplierDetailModal from "./components/SupplierDetailModal";
import type { SupplierDetail } from "./components/SupplierDetailModal";
import suppliersApi from "../../api/suppliersApi.ts";
import ErrorAlert from "../../components/ErrorAlert";

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
  let styles = "bg-[#0bda5b]/10 text-[#0bda5b] border-[#0bda5b]/20";
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

  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const didInit = useRef(false);

  const mapDtoToRow = (dto: SupplierDto): Supplier => {
    const status = dto.trangthai ? "Active" : "Inactive";
    return {
      id: String(dto.idnhacungcap),
      name: dto.tennhacungcap,
      supId: dto.manhacungcap || `SUP-${dto.idnhacungcap}`,
      contactName: dto.nguoiLienHe || "N/A",
      contactRole: dto.chucVu || "N/A",
      category: dto.loaiHang || "General",
      phone: dto.sdt || "-",
      email: dto.email || undefined,
      address: dto.diachi || undefined,
      taxId: dto.masothue || undefined,
      status,
      initials: getInitials(dto.tennhacungcap),
      colorClass: getRandomColorClass(),
      joinedDate: new Date().getFullYear().toString(),
    };
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await suppliersApi.getSuppliers({
        page,
        limit,
        search: search.trim() || undefined,
        status: statusFilter,
      });
      const list = res.data?.data ?? [];
      setSuppliersList(list.map(mapDtoToRow));
      setTotalPages(res.data?.meta?.totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      fetchSuppliers();
      return;
    }

    const t = window.setTimeout(() => {
      fetchSuppliers();
    }, 350);

    return () => window.clearTimeout(t);
  }, [page, statusFilter, search]);

  const handleAddSupplier = async (data: AddSupplierPayload) => {
    try {
      const res = await suppliersApi.createSupplier({
        tennhacungcap: data.tennhacungcap,
        manhacungcap: data.manhacungcap || undefined,
        nguoiLienHe: data.nguoiLienHe || undefined,
        chucVu: data.chucVu || undefined,
        loaiHang: data.loaiHang || undefined,
        email: data.email || undefined,
        sdt: data.sdt || undefined,
        diachi: data.diachi || undefined,
        masothue: data.masothue || undefined,
        trangthai: true,
      });

      console.log("Created supplier:", res.data);

      const created = res.data?.data;
      if (created) {
        const row = mapDtoToRow(created);
        setSuppliersList((prev) => [row, ...prev]);
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Create supplier failed. Please try again.";
      throw new Error(message);
    }
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

      {error && <ErrorAlert message={error} />}

      <section className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        
        <div className="p-4 border-b border-gray-100 dark:border-[#111418] flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <div className="relative w-full sm:w-80">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-gray-50 dark:bg-[#1c2229] border border-gray-200 dark:border-[#3e4a56] rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                placeholder="Search suppliers (name, code, phone, email)..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "active" | "inactive");
                setPage(1);
              }}
              className="appearance-none bg-gray-50 dark:bg-[#1c2229] border border-gray-200 dark:border-[#3e4a56] text-gray-900 dark:text-white text-sm rounded-lg block w-full sm:w-48 py-2.5 pl-4 pr-10 focus:ring-primary focus:border-primary cursor-pointer outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              {loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    Loading suppliers...
                  </td>
                </tr>
              )}

              {!loading && suppliersList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No suppliers found.
                  </td>
                </tr>
              )}

              {!loading && suppliersList.map((supplier) => (
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
          <span className="text-text-secondary text-xs">
            Page {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs rounded border border-gray-200 dark:border-[#3e4a56] text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#3e4a56] disabled:opacity-50 transition-colors"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 text-xs rounded border border-gray-200 dark:border-[#3e4a56] text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#3e4a56] disabled:opacity-50 transition-colors"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
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
