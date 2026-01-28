import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ordersApi, { type OrderListItemDto } from "../../api/ordersApi.ts";
import ErrorAlert from "../../components/ErrorAlert";
import SalesOrderDetailModal from "./components/SalesOrderDetailModal";

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);

const fmtDate = (s?: string | null) => {
  if (!s) return "-";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("vi-VN");
};

const mapStatusUi = (backend?: string | null) => {
  const v = (backend ?? "").toUpperCase();
  if (v === "COMPLETED") return "Completed";
  if (v === "PENDING") return "Awaiting Payment";
  if (v === "CONFIRMED" || v === "PROCESSING") return "Processing";
  if (v === "CANCELLED") return "Cancelled";
  return backend ?? "Processing";
};

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-[#0bda5b]/10 text-[#0bda5b] border-[#0bda5b]/20";
  if (status === "Processing")
    styles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (status === "Awaiting Payment")
    styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (status === "Cancelled")
    styles = "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}
    >
      {status}
    </span>
  );
};

const SalesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderList, setOrderList] = useState<OrderListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [detailId, setDetailId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const extractOrders = (payload: unknown): OrderListItemDto[] => {
    if (Array.isArray(payload)) return payload as OrderListItemDto[];
    if (!payload || typeof payload !== "object") return [];
    const anyPayload = payload as any;
    const list = anyPayload.data ?? anyPayload.orders ?? [];
    return Array.isArray(list) ? (list as OrderListItemDto[]) : [];
  };

  const fetchOrders = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getOrders({
        page,
        limit,
        search: q?.trim() || undefined,
      });
      setOrderList(extractOrders(res.data));
      const anyPayload = res.data as any;
      setTotal(anyPayload?.meta?.total ?? 0);
      setTotalPages(anyPayload?.meta?.totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải danh sách đơn bán.");
      setOrderList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      fetchOrders(search);
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const urlQ = searchParams.get("q") ?? "";
  useEffect(() => {
    if ((urlQ ?? "") !== (search ?? "")) {
      setSearch(urlQ);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ]);

  const openDetail = (id: number) => {
    setDetailId(id);
    setIsDetailOpen(true);
  };

  const showingFrom = useMemo(() => {
    if (orderList.length === 0) return 0;
    return (page - 1) * limit + 1;
  }, [orderList.length, page, limit]);

  const showingTo = useMemo(() => {
    return (page - 1) * limit + orderList.length;
  }, [orderList.length, page, limit]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-secondary">
              search
            </span>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-input-bg rounded-lg bg-white dark:bg-input-bg text-gray-900 dark:text-white placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            placeholder="Search orders by ID or Customer Name..."
            value={search}
            onChange={(e) => {
              const v = e.target.value;
              setSearch(v);
              setPage(1);
              const next = new URLSearchParams(searchParams);
              if (v.trim()) next.set("q", v);
              else next.delete("q");
              setSearchParams(next, { replace: true });
            }}
          />
        </div>

        <button
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all font-medium whitespace-nowrap group"
          onClick={() => navigate("/sales/new")}
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
            add
          </span>
          Create Sales Order
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="w-full bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg flex flex-col overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229]/80 border-b border-gray-100 dark:border-[#111418]">
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Order ID
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Total Amount
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
              {loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    Loading orders...
                  </td>
                </tr>
              )}

              {!loading && orderList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No orders found.
                  </td>
                </tr>
              )}

              {!loading && orderList.map((order) => {
                const statusUi = mapStatusUi(order.trangthai);
                const code = order.madonhang ? order.madonhang : `#${order.iddonban}`;
                const customerName = order.khachHang?.tenkhachhang ?? "-";
                const customerPhone = order.khachHang?.sdt ?? "-";
                return (
                <tr
                  key={order.iddonban}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group"
                >
                  <td className="p-5 text-primary text-sm font-medium">
                    {code}
                  </td>
                  <td className="p-5 text-gray-900 dark:text-white text-sm">
                    <div className="font-medium">{customerName}</div>
                    <div className="text-text-secondary text-xs">
                      {customerPhone}
                    </div>
                  </td>
                  <td className="p-5 text-text-secondary text-sm">
                    {fmtDate(order.ngaytao)}
                  </td>
                  <td className="p-5 text-gray-900 dark:text-white text-sm font-bold text-right">
                    {fmtMoney(order.tongtien)}
                  </td>
                  <td className="p-5 text-center">
                    <StatusBadge status={statusUi} />
                  </td>
                  <td className="p-5 text-right">
                    <button
                      className="text-text-secondary hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#3e4a56] hover:bg-gray-100 dark:hover:bg-[#3e4a56] px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                      onClick={() => openDetail(order.iddonban)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#111418] bg-white dark:bg-[#1c2229] flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {showingFrom}-{showingTo}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {total}
            </span>{" "}
            orders
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs font-medium text-text-secondary bg-white dark:bg-input-bg hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white rounded border border-gray-200 dark:border-[#3e4a56] transition-colors disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 text-xs font-medium text-text-secondary bg-white dark:bg-input-bg hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white rounded border border-gray-200 dark:border-[#3e4a56] transition-colors disabled:opacity-50"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <SalesOrderDetailModal
        isOpen={isDetailOpen}
        id={detailId}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};

export default SalesPage;
