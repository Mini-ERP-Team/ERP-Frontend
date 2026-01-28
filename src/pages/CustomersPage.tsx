import { useEffect, useMemo, useState } from "react";
import customersApi, { type CustomerDto } from "../api/customersApi.ts";
import ErrorAlert from "../components/ErrorAlert";

type CustomerRow = {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  points: number;
  avatar?: string;
  initials?: string;
  avatarColor?: string;
};

const avatarColors = [
  "bg-blue-500/20 text-blue-400",
  "bg-purple-500/20 text-purple-400",
  "bg-orange-500/20 text-orange-400",
  "bg-green-500/20 text-green-400",
  "bg-pink-500/20 text-pink-400",
];

const toInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") ?? "";
  return (first + last).toUpperCase();
};

const mapDtoToRow = (dto: CustomerDto): CustomerRow => {
  const id = String(dto.idkhachhang);
  const name = dto.tenkhachhang ?? "-";
  const initials = toInitials(name);
  const color = avatarColors[dto.idkhachhang % avatarColors.length];
  return {
    id,
    customerId: `#CUS-${String(dto.idkhachhang).padStart(4, "0")}`,
    name,
    phone: dto.sdt ?? "-",
    points: dto.diemtichluy ?? 0,
    initials,
    avatarColor: color,
  };
};

const CustomerAvatar = ({ customer }: { customer: CustomerRow }) => {
  if (customer.avatar) {
    return (
      <div
        className="size-9 rounded-full bg-cover bg-center border border-gray-200 dark:border-[#3e4a56]"
        style={{ backgroundImage: `url("${customer.avatar}")` }}
      ></div>
    );
  }
  return (
    <div
      className={`size-9 rounded-full flex items-center justify-center font-bold text-sm ${customer.avatarColor || "bg-gray-500/20 text-gray-400"}`}
    >
      {customer.initials}
    </div>
  );
};

const CustomersPage = () => {
  const [customerList, setCustomerList] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const extractCustomers = (payload: unknown): CustomerDto[] => {
    if (Array.isArray(payload)) return payload as CustomerDto[];
    if (!payload || typeof payload !== "object") return [];
    const anyPayload = payload as any;
    const list = anyPayload.data ?? anyPayload.customers ?? [];
    return Array.isArray(list) ? (list as CustomerDto[]) : [];
  };

  const fetchCustomers = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await customersApi.getCustomers({
        page,
        limit,
        search: q?.trim() || undefined,
      });
      const dtos = extractCustomers(res.data);
      setCustomerList(dtos.map(mapDtoToRow));

      const anyPayload = res.data as any;
      setTotal(anyPayload?.meta?.total ?? dtos.length);
      setTotalPages(anyPayload?.meta?.totalPages ?? 1);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Không thể tải danh sách khách hàng.",
      );
      setCustomerList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      fetchCustomers(search);
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const showingFrom = useMemo(() => {
    if (customerList.length === 0) return 0;
    return (page - 1) * limit + 1;
  }, [customerList.length, page, limit]);

  const showingTo = useMemo(() => {
    return (page - 1) * limit + customerList.length;
  }, [customerList.length, page, limit]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              type="text"
              className="w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              placeholder="Search customers by name, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg hover:border-gray-300 dark:hover:bg-[#323b46] rounded-lg text-text-secondary hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
            Filter
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg hover:border-gray-300 dark:hover:bg-[#323b46] rounded-lg text-text-secondary hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">
              download
            </span>
            Export
          </button>
        </div>

        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20 w-full sm:w-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-medium text-sm">Add Customer</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229] border-b border-gray-100 dark:border-[#111418]">
                <th className="p-4 pl-6 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[25%]">
                  Customer Name
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[15%]">
                  Phone Number
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[15%] text-center">
                  Points
                </th>
                <th className="p-4 pr-6 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[10%] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111418]">
              {loading && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary">
                    Loading customers...
                  </td>
                </tr>
              )}

              {!loading && customerList.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary">
                    No customers found.
                  </td>
                </tr>
              )}

              {!loading && customerList.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar customer={customer} />
                      <div>
                        <p className="text-gray-900 dark:text-white text-sm font-medium">
                          {customer.name}
                        </p>
                        <p className="text-text-secondary text-xs">
                          ID: {customer.customerId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    {customer.phone}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#111418] text-gray-700 dark:text-white border border-gray-200 dark:border-[#3e4a56]">
                      {customer.points}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="text-text-secondary hover:text-primary p-1.5 hover:bg-gray-100 dark:hover:bg-[#111418] rounded transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 dark:border-[#111418] p-4 flex items-center justify-between bg-white dark:bg-input-bg">
          <p className="text-sm text-text-secondary">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {showingFrom}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {showingTo}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {total}
            </span>{" "}
            customers
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm text-text-secondary border border-gray-200 dark:border-[#3e4a56] rounded hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button className="px-3 py-1 text-sm text-white border border-gray-600 dark:border-[#3e4a56] bg-gray-600 dark:bg-[#3e4a56] rounded transition-colors">
              {page}
            </button>
            <button
              className="px-3 py-1 text-sm text-text-secondary border border-gray-200 dark:border-[#3e4a56] rounded hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersPage;
