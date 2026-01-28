import { useState } from "react";

export const StockBar = ({
  value,
  percent,
  status,
}: {
  value: number;
  percent: number;
  status: StockStatus;
}) => {
  let color = "bg-blue-500";
  if (status === "Low Stock") color = "bg-orange-500";
  if (status === "Out of Stock") color = "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <span>{value}</span>
      <div className="h-1.5 w-16 bg-[#111418] rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export const StatusBadge = ({
  status,
  small,
}: {
  status: StockStatus;
  small?: boolean;
}) => {
  let styles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (status === "Low Stock")
    styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (status === "Out of Stock")
    styles = "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-medium border",
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        styles,
      ].join(" ")}
    >
      {status}
    </span>
  );
};

export const ProductRow = ({
  product,
  onOpenDetail,
}: {
  product: Product;
  onOpenDetail: (p: Product) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasVariants = (product.variants?.length ?? 0) > 0;

  return (
    <>
      <tr
        className="hover:bg-[#323b46] transition-colors group cursor-pointer"
        onClick={() => onOpenDetail(product)}
      >
        <td className="p-4 pl-6">
          <button
            type="button"
            className={[
              "material-symbols-outlined text-[#9dabb9] group-hover:text-white transition-transform",
              hasVariants ? "" : "opacity-0 pointer-events-none",
              isExpanded ? "rotate-90" : "",
            ].join(" ")}
            onClick={(e) => {
              e.stopPropagation();
              if (hasVariants) setIsExpanded((v) => !v);
            }}
            aria-label={isExpanded ? "Collapse variants" : "Expand variants"}
          >
            chevron_right
          </button>
        </td>

        <td className="p-4 pl-0">
          {product.image ? (
            <div
              className="size-10 rounded bg-[#111418] bg-center bg-cover border border-[#3e4a56]"
              style={{ backgroundImage: `url("${product.image}")` }}
            />
          ) : (
            <div className="size-10 rounded bg-[#111418] flex items-center justify-center border border-[#3e4a56] text-[#9dabb9]">
              <span className="material-symbols-outlined text-sm">
                {product.icon ?? "inventory_2"}
              </span>
            </div>
          )}
        </td>

        <td className="p-4">
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{product.name}</span>
            <span className="text-[#9dabb9] text-xs">
              {product.variantCountText ?? "Single Item"}
            </span>
          </div>
        </td>

        <td className="p-4 text-[#9dabb9] text-sm font-mono">
          {product.sku ?? "-"}
        </td>

        <td className="p-4 text-[#9dabb9] text-sm">{product.category}</td>

        <td className="p-4 text-white text-sm font-medium">{product.price}</td>

        <td className="p-4 text-white text-sm font-medium">
          <StockBar
            value={product.stock}
            percent={product.stockPercent}
            status={product.status}
          />
        </td>

        <td className="p-4">
          <StatusBadge status={product.status} />
        </td>

        <td className="p-4 pr-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded transition-colors"
              title="Edit"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
        </td>
      </tr>

      {isExpanded &&
        hasVariants &&
        product.variants!.map((v) => (
          <tr key={v.id} className="bg-[#20272e] ">
            <td className="p-4 pl-6"></td>

            <td className="p-4 pl-0">
              <div className="size-8 rounded bg-[#111418] border border-[#3e4a56] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#9dabb9] text-sm">
                  smartphone
                </span>
              </div>
            </td>

            <td className="p-4">
              <span className="text-[#ced4da] text-sm pl-2">{v.name}</span>
            </td>

            <td className="p-4 text-[#9dabb9] text-xs font-mono">{v.sku}</td>

            <td className="p-4 text-[#9dabb9] text-xs"></td>

            <td className="p-4 text-[#ced4da] text-sm font-medium">{v.price}</td>

            <td className="p-4 text-[#ced4da] text-sm font-medium">
              <StockBar value={v.stock} percent={v.stockPercent} status={v.status} />
            </td>

            <td className="p-4">
              <StatusBadge status={v.status} small />
            </td>

            <td className="p-4 pr-6 text-right">
              <div className="flex items-center justify-end gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded transition-colors"
                  title="Edit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit
                  </span>
                </button>

                <button
                  className="p-1.5 hover:bg-red-500/20 text-[#9dabb9] hover:text-red-500 rounded transition-colors"
                  title="Delete"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete
                  </span>
                </button>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
};

