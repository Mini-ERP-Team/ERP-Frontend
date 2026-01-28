import { useEffect } from "react";

export default function ProductDetailModal({
  open,
  product,
  onClose,
  onEdit,
  onDelete,
}: {
  open: boolean;
  product: ProductDetail | null;
  onClose: () => void;
  onEdit?: (p: ProductDetail) => void;
  onDelete?: (p: ProductDetail) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !product) return null;

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
          <h3 className="text-xl font-bold text-white">Product Details</h3>

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
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="aspect-square rounded-lg bg-[#111418] border border-[#283039] flex items-center justify-center overflow-hidden relative">
                {product.image ? (
                  <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url("${product.image}")` }}
                  />
                ) : (
                  <span className="material-symbols-outlined text-[#9dabb9] text-4xl">
                    {product.icon ?? "inventory_2"}
                  </span>
                )}
              </div>

            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {product.name}
                  </h2>

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap
                    bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {product.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-white">{product.price}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <InfoItem label="SKU" value={product.sku ?? product.apiVariants?.[0]?.sku ?? "-"} mono />
                <InfoItem label="Category" value={product.category} />
                <InfoItem label="Brand" value={product.brand ?? "-"} />
                <InfoItem label="Model" value={product.model ?? "-"} />
                <InfoItem label="Stock Level" value={`${product.stock} units`} />
                <InfoItem label="Variants" value={String(product.apiVariants?.length ?? 0)} />
              </div>

              {product.apiVariants && product.apiVariants.length > 0 && (
                <div className="border-t border-[#283039] pt-4 mt-2">
                  <span className="text-[#9dabb9] text-xs uppercase tracking-wider font-semibold block mb-3">
                    Variants
                  </span>
                  <div className="border border-[#283039] rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs text-[#9dabb9]">
                      <thead className="bg-[#20272e] uppercase font-semibold">
                        <tr>
                          <th className="px-3 py-2">Tên</th>
                          <th className="px-3 py-2">SKU</th>
                          <th className="px-3 py-2">Màu</th>
                          <th className="px-3 py-2">Dung lượng</th>
                          <th className="px-3 py-2">Xuất xứ</th>
                          <th className="px-3 py-2">Giá bán</th>
                          <th className="px-3 py-2">Tồn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#283039]">
                        {product.apiVariants.map((v) => (
                          <tr key={v.idphanloai}>
                            <td className="px-3 py-2 text-white">{v.tenphanloai}</td>
                            <td className="px-3 py-2 font-mono">{v.sku ?? "-"}</td>
                            <td className="px-3 py-2">{v.mausac ?? "-"}</td>
                            <td className="px-3 py-2">{v.dungluong ?? "-"}</td>
                            <td className="px-3 py-2">{v.xuatxu ?? "-"}</td>
                            <td className="px-3 py-2 text-white">{v.giaban}</td>
                            <td className="px-3 py-2">{v.tonkho}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#283039] bg-[#1c252e] flex flex-col sm:flex-row gap-3 justify-end">
          <button
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors font-medium flex items-center justify-center gap-2"
            onClick={() => onDelete?.(product)}
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Delete Product
          </button>

          <button
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            onClick={() => onEdit?.(product)}
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Product
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
      <span className={["text-white", mono ? "font-mono" : ""].join(" ")}>
        {value}
      </span>
    </div>
  );
}
