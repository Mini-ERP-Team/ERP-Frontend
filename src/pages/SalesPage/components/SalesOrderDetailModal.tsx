import { useEffect, useMemo, useState } from "react";
import ordersApi, { type OrderDetailDto } from "../../../api/ordersApi.ts";
import ErrorAlert from "../../../components/ErrorAlert";

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
  return d.toLocaleString("vi-VN");
};

const mapPayment = (v?: string | null) => {
  const up = (v ?? "").toUpperCase();
  if (up === "TIEN_MAT") return "Tiền mặt";
  if (up === "CHUYEN_KHOAN") return "Chuyển khoản";
  return v ?? "-";
};

type Props = {
  isOpen: boolean;
  id: number | null;
  onClose: () => void;
};

export default function SalesOrderDetailModal({ isOpen, id, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDetailDto | null>(null);

  const title = useMemo(() => {
    if (!detail) return "Chi tiết đơn bán";
    return detail.madonhang ? `Đơn bán ${detail.madonhang}` : `Đơn bán #${detail.iddonban}`;
  }, [detail]);

  useEffect(() => {
    if (!isOpen || !id) return;

    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ordersApi.getOrderDetail(id);
        const payload: any = res.data as any;
        const dto = (payload?.data ?? payload) as OrderDetailDto;
        if (mounted) setDetail(dto);
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : "Không thể tải chi tiết đơn bán.");
          setDetail(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [isOpen, id]);

  if (!isOpen) return null;

  const items = detail?.chiTiet ?? [];
  const customer = detail?.khachHang;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-[#111418] shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#111418] flex items-center justify-between">
          <h3 className="text-gray-900 dark:text-white font-bold">{title}</h3>
          <button
            className="text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4">
          {error && <ErrorAlert message={error} />}

          {loading ? (
            <div className="p-8 text-center text-text-secondary">Loading...</div>
          ) : !detail ? (
            <div className="p-8 text-center text-text-secondary">No data.</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-[#111418] rounded-xl p-4">
                  <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Thông tin đơn
                  </div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Mã đơn</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {detail.madonhang ?? `#${detail.iddonban}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Trạng thái</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {detail.trangthai ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Thanh toán</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {mapPayment(detail.phuongthucTT)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Ngày tạo</span>
                      <span className="text-gray-900 dark:text-white">
                        {fmtDate(detail.ngaytao)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Tổng tiền</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {fmtMoney(detail.tongtien)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-[#111418] rounded-xl p-4">
                  <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Khách hàng
                  </div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Tên</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {customer?.tenkhachhang ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">SĐT</span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {customer?.sdt ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Điểm</span>
                      <span className="text-gray-900 dark:text-white">
                        {customer?.diemtichluy ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-[#111418] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-[#111418] flex items-center justify-between">
                  <div className="text-gray-900 dark:text-white font-bold">
                    Danh sách sản phẩm
                  </div>
                  <div className="text-xs text-text-secondary">
                    {items.length} items
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#1c2229]/80 border-b border-gray-100 dark:border-[#111418]">
                        <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          SKU / Variant
                        </th>
                        <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Product
                        </th>
                        <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                          Qty
                        </th>
                        <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                          Price
                        </th>
                        <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                          Line total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
                      {items.map((it) => (
                        <tr key={it.idphanloai}>
                          <td className="p-4 text-sm">
                            <div className="font-mono text-gray-900 dark:text-white">
                              {it.phanLoai?.sku ?? "-"}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {it.phanLoai?.tenphanloai ?? "-"}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-900 dark:text-white">
                            <div className="font-medium">
                              {it.phanLoai?.sanPham?.tensanpham ?? "-"}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {it.phanLoai?.sanPham?.thuonghieu ?? "-"}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-right text-gray-900 dark:text-white font-semibold">
                            {it.soluong}
                          </td>
                          <td className="p-4 text-sm text-right text-gray-900 dark:text-white">
                            {fmtMoney(it.giaban)}
                          </td>
                          <td className="p-4 text-sm text-right text-gray-900 dark:text-white font-bold">
                            {fmtMoney(it.thanhtien)}
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-text-secondary"
                          >
                            No items.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

