import { useEffect, useMemo, useRef, useState } from "react";
import ErrorAlert from "../../../components/ErrorAlert";
import suppliersApi from "../../../api/suppliersApi";
import productsApi from "../../../api/productsApi";
import importsApi from "../../../api/importsApi";
import { useAuthStore } from "../../../store/useAuthStore";

type VariantOption = {
  idphanloai: number;
  sku?: string | null;
  tenphanloai: string;
  gianhap?: number;
  productName?: string;
};

type LineItem = {
  idphanloai: number;
  sku?: string | null;
  tenphanloai: string;
  soluong: number;
  gianhap: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (created: ImportDto | null) => void;
};

export default function AddImportModal({ isOpen, onClose, onCreated }: Props) {
  const [maphieu, setMaphieu] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [idnhacungcap, setIdnhacungcap] = useState<number | "">("");

  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(false);

  const [selectedSku, setSelectedSku] = useState("");
  const [soluong, setSoluong] = useState<number>(1);
  const [gianhap, setGianhap] = useState<number>(0);

  const [items, setItems] = useState<LineItem[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const didLoadSuppliers = useRef(false);

  const tongtien = useMemo(() => {
    return items.reduce((sum, it) => sum + it.soluong * it.gianhap, 0);
  }, [items]);

  useEffect(() => {
    if (!isOpen) return;
    if (didLoadSuppliers.current) return;
    didLoadSuppliers.current = true;

    const loadSuppliers = async () => {
      setSuppliersLoading(true);
      try {
        const res = await suppliersApi.getSuppliers({
          page: 1,
          limit: 100,
          status: "active",
        });
        setSuppliers(res.data?.data ?? []);
      } catch (e) {
        console.error("Failed to load suppliers:", e);
      } finally {
        setSuppliersLoading(false);
      }
    };

    loadSuppliers();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    // Preload a small list of variants by calling the existing products search endpoint.
    // (We keep the UI minimal: only "SKU" field, but it still needs options.)
    const t = window.setTimeout(async () => {
      setVariantsLoading(true);
      try {
        const res = await productsApi.getAllProducts({
          page: 1,
          limit: 20,
          search: "", // initial load
        });
        const products = res.data?.data ?? [];
        const flattened: VariantOption[] = products.flatMap((p) =>
          (p.variants ?? []).map((v) => ({
            idphanloai: v.idphanloai,
            sku: v.sku ?? null,
            tenphanloai: v.tenphanloai,
            gianhap: v.gianhap,
            productName: p.name,
          })),
        );
        // Keep only rows that actually have SKU
        setVariantOptions(flattened.filter((x) => x.sku).slice(0, 200));
      } catch (e) {
        console.error("Failed to search variants:", e);
        setVariantOptions([]);
      } finally {
        setVariantsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!selectedSku.trim()) return;
    const found = variantOptions.find((v) => (v.sku ?? "").toLowerCase() === selectedSku.trim().toLowerCase());
    if (found && typeof found.gianhap === "number" && found.gianhap > 0) {
      setGianhap(found.gianhap);
    }
  }, [selectedSku, variantOptions]);

  const addItem = () => {
    setError(null);
    const skuValue = selectedSku.trim();
    if (!skuValue) {
      setError("Vui lòng chọn SKU.");
      return;
    }
    if (!Number.isFinite(soluong) || soluong <= 0) {
      setError("Số lượng phải > 0.");
      return;
    }
    if (!Number.isFinite(gianhap) || gianhap <= 0) {
      setError("Giá nhập phải > 0.");
      return;
    }

    const opt = variantOptions.find(
      (v) => (v.sku ?? "").toLowerCase() === skuValue.toLowerCase(),
    );
    if (!opt) {
      setError("SKU không hợp lệ hoặc chưa có trong danh sách.");
      return;
    }

    const tenphanloai = opt.tenphanloai;
    const sku = opt.sku ?? null;
    const idphanloai = opt.idphanloai;

    setItems((prev) => {
      const existing = prev.find((x) => x.idphanloai === idphanloai);
      if (existing) {
        return prev.map((x) =>
          x.idphanloai === idphanloai
            ? { ...x, soluong: x.soluong + soluong, gianhap }
            : x,
        );
      }
      return [
        ...prev,
        { idphanloai, tenphanloai, sku, soluong, gianhap },
      ];
    });

    setSelectedSku("");
    setSoluong(1);
    setGianhap(0);
  };

  const removeItem = (idphanloai: number) => {
    setItems((prev) => prev.filter((x) => x.idphanloai !== idphanloai));
  };

  const handleSubmit = async () => {
    setError(null);
    if (idnhacungcap === "") {
      setError("Vui lòng chọn nhà cung cấp.");
      return;
    }
    if (items.length === 0) {
      setError("Vui lòng thêm ít nhất 1 dòng hàng hóa (chiTiet).");
      return;
    }

    try {
      setIsSubmitting(true);

      const creatorId = useAuthStore.getState().user?.idnguoidung;
      if (creatorId === undefined || creatorId === null) {
        setError("Bạn cần đăng nhập...");
        return;
      }

      const payload: CreateImportPayload = {
        idnguoidung: creatorId,
        idnhacungcap: Number(idnhacungcap),
        ghiChu: ghiChu.trim() || undefined,
        maphieu: maphieu.trim() || undefined,
        chiTiet: items.map((it) => ({
          idphanloai: it.idphanloai,
          soluong: it.soluong,
          gianhap: it.gianhap,
        })),
      };

      const res = await importsApi.createImport(payload);

      onCreated?.(res.data?.data ?? null);
      onClose();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Tạo phiếu nhập thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c252e] w-full max-w-4xl rounded-xl border border-[#283039] shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#283039]">
          <h2 className="text-white text-lg font-bold">Create Import Receipt (Phiếu nhập)</h2>
          <button
            onClick={onClose}
            className="text-[#9dabb9] hover:text-white transition-colors rounded-lg p-1 hover:bg-[#283039]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && <ErrorAlert message={error} className="mb-4 mt-0" />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                Supplier (idnhacungcap) <span className="text-red-500">*</span>
              </label>
              <select
                value={idnhacungcap}
                onChange={(e) => setIdnhacungcap(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
                disabled={suppliersLoading}
              >
                <option value="">{suppliersLoading ? "Loading..." : "Select supplier"}</option>
                {suppliers.map((s) => (
                  <option key={s.idnhacungcap} value={s.idnhacungcap}>
                    {s.tennhacungcap} (#{s.idnhacungcap})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                Mã phiếu (maphieu)
              </label>
              <input
                value={maphieu}
                onChange={(e) => setMaphieu(e.target.value)}
                className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                placeholder="VD: PN-FPT-001 (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                Ghi chú (ghiChu)
              </label>
              <textarea
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                rows={2}
                className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none resize-none"
                placeholder='VD: "Hàng nhập đợt 1 tháng 10"...'
              />
            </div>
          </div>

          <div className="h-px bg-[#283039] my-6" />

          <div>
            <h3 className="text-white text-sm font-medium mb-4">Chi tiết (chiTiet)</h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-[#20272e] p-4 rounded-lg border border-[#283039]">
              <div className="md:col-span-6">
                <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                  SKU
                </label>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white font-mono"
                  disabled={variantsLoading}
                >
                  <option value="">
                    {variantsLoading ? "Loading SKUs..." : "Select SKU"}
                  </option>
                  {variantOptions.map((v) => (
                    <option key={v.idphanloai} value={v.sku ?? ""}>
                      {v.sku} - {v.tenphanloai}
                      {v.productName ? ` (${v.productName})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                  Số lượng (soluong)
                </label>
                <input
                  type="number"
                  value={soluong}
                  onChange={(e) => setSoluong(Number(e.target.value))}
                  className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                  min={1}
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                  Giá nhập (gianhap)
                </label>
                <input
                  type="number"
                  value={gianhap}
                  onChange={(e) => setGianhap(Number(e.target.value))}
                  className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                  min={0}
                />
              </div>

              <div className="md:col-span-12">
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-2 w-full py-2 bg-[#283039] hover:bg-[#323b46] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add line item
                </button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="mt-4 border border-[#283039] rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm text-[#9dabb9]">
                  <thead className="bg-[#20272e] text-xs uppercase font-medium">
                    <tr>
                      <th className="px-4 py-2">IDPL</th>
                      <th className="px-4 py-2">SKU</th>
                      <th className="px-4 py-2">Tên</th>
                      <th className="px-4 py-2 text-right">Số lượng</th>
                      <th className="px-4 py-2 text-right">Giá nhập</th>
                      <th className="px-4 py-2 text-right">Thành tiền</th>
                      <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#283039]">
                    {items.map((it) => (
                      <tr key={it.idphanloai}>
                        <td className="px-4 py-2 font-mono text-xs">{it.idphanloai}</td>
                        <td className="px-4 py-2 font-mono text-xs">{it.sku ?? "-"}</td>
                        <td className="px-4 py-2 text-white">{it.tenphanloai}</td>
                        <td className="px-4 py-2 text-right">{it.soluong}</td>
                        <td className="px-4 py-2 text-right">{it.gianhap}</td>
                        <td className="px-4 py-2 text-right text-white">
                          {it.soluong * it.gianhap}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(it.idphanloai)}
                            className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#1c252e]">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-right text-[#9dabb9] font-medium">
                        Tổng tiền (client)
                      </td>
                      <td className="px-4 py-3 text-right text-white font-bold">
                        {tongtien}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-[#283039] flex justify-end gap-3 bg-[#1c252e] rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 disabled:hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-medium"
          >
            {isSubmitting ? "Creating..." : "Create Import"}
          </button>
        </div>
      </div>
    </div>
  );
}

