import { useEffect, useMemo, useState } from "react";
import importsApi from "../../../api/importsApi";
import ErrorAlert from "../../../components/ErrorAlert";

type Props = {
  open: boolean;
  id: string | null;
  onClose: () => void;
};

export default function ImportDetailModal({ open, id, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ImportDetailDto | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !id) return;
    setLoading(true);
    setError(null);
    setDetail(null);

    (async () => {
      try {
        const res = await importsApi.getImportDetail(id);
        console.log("Import detail:", res.data);
        setDetail(res.data?.data ?? null);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Không thể tải chi tiết phiếu nhập.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [open, id]);

  const amountText = useMemo(() => {
    const n = detail?.totalAmount ?? 0;
    return Number(n).toLocaleString();
  }, [detail?.totalAmount]);

  if (!open) return null;

  const headerId = detail?.code ? `#${detail.code}` : id ? `#PN-${id}` : "#PN";
  const createdAt = detail?.createdAt ? new Date(detail.createdAt) : null;
  const receivedAt = detail?.importedAt ? new Date(detail.importedAt) : null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1c252e] w-full max-w-4xl rounded-xl shadow-2xl border border-[#283039] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#283039] bg-[#1c252e]">
          <h3 className="text-xl font-bold text-white">Import Details</h3>
          <button
            className="text-[#9dabb9] hover:text-white transition-colors rounded-lg p-1 hover:bg-[#283039]"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && <ErrorAlert message={error} className="mb-4 mt-0" />}
          {loading && (
            <div className="p-6 text-center text-[#9dabb9]">Loading...</div>
          )}

          {!loading && detail && (
            <>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-white text-2xl font-bold">{headerId}</div>
                  <div className="text-[#9dabb9] text-sm mt-1">
                    Created: {createdAt ? createdAt.toLocaleString() : "-"}
                  </div>
                  <div className="text-[#9dabb9] text-sm mt-1">
                    Stock-in date: {receivedAt ? receivedAt.toLocaleString() : "-"}
                  </div>
                  <div className="text-[#9dabb9] text-sm mt-1">
                    Created by: {detail.createdBy?.name ?? "-"}
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-[#283039] text-white border-[#3e4a56]">
                  {detail.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111418] border border-[#283039] rounded-xl p-4">
                  <div className="text-white text-sm font-semibold mb-3">
                    Supplier
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <InfoItem
                      label="Name"
                      value={detail.supplier?.name ?? "-"}
                    />
                    <InfoItem label="Phone" value={detail.supplier?.phone ?? "-"} mono />
                    <InfoItem label="Email" value={detail.supplier?.email ?? "-"} />
                    <InfoItem
                      label="Address"
                      value={detail.supplier?.address ?? "Domestic"}
                    />
                  </div>
                </div>

                <div className="bg-[#111418] border border-[#283039] rounded-xl p-4">
                  <div className="text-white text-sm font-semibold mb-3">
                    Header
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <InfoItem label="Total amount" value={amountText} mono />
                    <InfoItem
                      label="Total items"
                      value={String(
                        detail.items?.reduce((sum, it) => sum + (it.quantity ?? 0), 0) ??
                          0,
                      )}
                      mono
                    />
                    <InfoItem label="Note" value={detail.note ?? "-"} />
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#283039] my-6" />

              <div>
                <div className="text-white text-sm font-semibold mb-3">Items</div>
                <div className="border border-[#283039] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs text-[#9dabb9]">
                    <thead className="bg-[#20272e] uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Variant</th>
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Brand</th>
                        <th className="px-4 py-2 text-right">Qty</th>
                        <th className="px-4 py-2 text-right">Import price</th>
                        <th className="px-4 py-2 text-right">Line total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#283039]">
                      {(detail.items ?? []).map((it) => (
                        <tr key={it.id}>
                          <td className="px-4 py-2 text-white">
                            {it.productName ?? "-"}
                          </td>
                          <td className="px-4 py-2">
                            {it.variantName ?? "-"}
                          </td>
                          <td className="px-4 py-2 font-mono">
                            {it.sku ?? "-"}
                          </td>
                          <td className="px-4 py-2">{it.category ?? "-"}</td>
                          <td className="px-4 py-2">{it.brand ?? "-"}</td>
                          <td className="px-4 py-2 text-right">
                            {it.quantity ?? 0}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {it.importPrice ?? 0}
                          </td>
                          <td className="px-4 py-2 text-right text-white">
                            {it.total ?? 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#1c252e]">
                      <tr>
                        <td colSpan={8} className="px-4 py-3 text-right text-[#9dabb9] font-medium">
                          Total
                        </td>
                        <td className="px-4 py-3 text-right text-white font-bold">
                          {amountText}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
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
      <span className={["text-white", mono ? "font-mono" : ""].join(" ")}>
        {value}
      </span>
    </div>
  );
}

