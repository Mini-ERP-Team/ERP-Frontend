import { useEffect, useMemo, useRef, useState } from "react";
import productsApi from "../api/productsApi.ts";
import ErrorAlert from "../components/ErrorAlert";

interface Variant {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  stock: number;
  location: string;
}

interface Product {
  id: string;
  name: string;
  totalStock: number;
  brand: string;
  category: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image?: string;
  icon?: string;
  variants?: Variant[];
}

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-[#0bda5b]/10 text-[#0bda5b]";
  if (status === "Low Stock") styles = "bg-orange-500/10 text-orange-400";
  if (status === "Out of Stock") styles = "bg-red-500/10 text-red-400";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
  let colorClass =
    "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  if (category === "Smartphones") colorClass = "bg-blue-500/10 text-blue-400";
  if (category === "Accessories")
    colorClass = "bg-purple-500/10 text-purple-400";
  if (category === "Laptops") colorClass = "bg-green-500/10 text-green-400";
  if (category === "Audio") colorClass = "bg-pink-500/10 text-pink-400";

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colorClass}`}
    >
      {category}
    </span>
  );
};

const InventoryRow = ({ product }: { product: Product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <>
      <tr
        className={`hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors border-b border-gray-100 dark:border-[#111418] ${hasVariants ? "cursor-pointer" : ""}`}
        onClick={() => hasVariants && setIsExpanded(!isExpanded)}
      >
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`text-text-secondary transition-transform duration-200 ${hasVariants ? "" : "opacity-0"} ${isExpanded ? "rotate-90" : ""}`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </div>

            {product.image ? (
              <div
                className="size-10 rounded bg-gray-100 dark:bg-[#111418] bg-center bg-cover border border-gray-200 dark:border-[#283039]"
                style={{ backgroundImage: `url("${product.image}")` }}
              ></div>
            ) : (
              <div className="size-10 rounded bg-gray-100 dark:bg-[#111418] flex items-center justify-center border border-gray-200 dark:border-[#283039] text-text-secondary">
                <span className="material-symbols-outlined text-lg">
                  {product.icon}
                </span>
              </div>
            )}

            <div>
              <span className="text-gray-900 dark:text-white text-sm font-medium block">
                {product.name}
              </span>
              <span className="text-text-secondary text-xs">
                Total Stock: {product.totalStock} Units
              </span>
            </div>
          </div>
        </td>
        <td className="p-4 text-text-secondary text-sm font-mono">-</td>
        <td className="p-4 text-text-secondary text-sm">{product.brand}</td>
        <td className="p-4">
          <CategoryBadge category={product.category} />
        </td>
        <td
          className={`p-4 text-sm font-bold text-right ${product.totalStock === 0 ? "text-red-400" : "text-gray-900 dark:text-white"}`}
        >
          {product.totalStock}
        </td>
        <td className="p-4 text-text-secondary text-sm text-right">Multiple</td>
        <td className="p-4">
          <StatusBadge status={product.status} />
        </td>
        <td className="p-4 text-text-secondary text-sm text-right">
          <button
            className="hover:text-primary transition-colors p-1"
            title="Edit Product"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </td>
      </tr>

      {isExpanded && hasVariants && (
        <tr className="bg-gray-50 dark:bg-[#1c2229]/50">
          <td colSpan={8} className="p-0">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200 dark:divide-[#111418] border-t border-gray-200 dark:border-[#111418] border-dashed">
                {product.variants?.map((variant) => (
                  <tr
                    key={variant.id}
                    className="hover:bg-gray-100 dark:hover:bg-[#1c2229] transition-colors"
                  >
                    <td className="p-3 pl-16 w-[350px]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-[#3e4a56]"></span>
                        <span className="text-gray-700 dark:text-text-secondary text-sm">
                          {variant.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary text-xs font-mono">
                      {variant.sku}
                    </td>
                    <td className="p-3 text-text-secondary text-xs opacity-50">
                      {variant.brand}
                    </td>
                    <td className="p-3 text-text-secondary text-xs opacity-50">
                      {variant.category}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-white text-sm font-medium text-right">
                      {variant.stock}
                    </td>
                    <td className="p-3 text-text-secondary text-xs text-right">
                      {variant.location}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#0bda5b]/10 text-[#0bda5b]">
                        In Stock
                      </span>
                    </td>
                    <td className="p-3 text-text-secondary text-xs text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="hover:text-primary transition-colors p-1"
                          title="Edit Variant"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            edit
                          </span>
                        </button>
                        <button
                          className="hover:text-red-500 transition-colors p-1"
                          title="Delete Variant"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

const InventoryPage = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const didInit = useRef(false);

  const mapDanhMucToUi = (danhmuc?: string | null) => {
    const v = (danhmuc ?? "").toLowerCase();
    if (v === "smartphone") return "Smartphones";
    if (v === "component") return "Components";
    if (v === "accessory") return "Accessories";
    return danhmuc ?? "Products";
  };

  const toStatus = (stock: number): Product["status"] => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  const mapToInventoryProducts = (list: ProductListItemDto[]): Product[] => {
    return list.map((p) => {
      const category = mapDanhMucToUi(p.category);
      const totalStock = p.stock ?? 0;
      const status = toStatus(totalStock);

      const variants: Variant[] = (p.variants ?? []).map((v) => {
        const name =
          [
            v.dungluong ?? undefined,
            v.mausac ?? undefined,
            v.xuatxu ?? undefined,
          ]
            .filter(Boolean)
            .join(" - ") || v.tenphanloai;

        return {
          id: String(v.idphanloai),
          name,
          sku: v.sku ?? "-",
          brand: (p.brand ?? "-") as string,
          category,
          stock: v.tonkho ?? 0,
          location: "-",
        };
      });

      return {
        id: String(p.id),
        name: p.name,
        totalStock,
        brand: (p.brand ?? "-") as string,
        category,
        status,
        image: p.image ?? undefined,
        variants: variants.length > 0 ? variants : undefined,
      };
    });
  };

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getAllProducts({
        page,
        limit,
        search: search.trim() || undefined,
      });
      const list = res.data?.data ?? [];
      setProductList(mapToInventoryProducts(list));
      setTotal(res.data?.meta?.total ?? 0);
      setTotalPages(res.data?.meta?.totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải dữ liệu kho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      fetchInventory();
      return;
    }

    const t = window.setTimeout(() => {
      fetchInventory();
    }, 350);

    return () => window.clearTimeout(t);
  }, [page, search]);

  const lowStockCount = useMemo(() => {
    return productList.filter((p) => p.status === "Low Stock").length;
  }, [productList]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-input-bg rounded-xl p-6 border border-gray-200 dark:border-input-bg shadow-sm hover:border-gray-300 dark:hover:border-[#3e4a56] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">
                Total Inventory Value
              </p>
              <h3 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
                $845,290.00
              </h3>
              <p className="text-[#0bda5b] text-xs font-medium mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  trending_up
                </span>{" "}
                +3.2% from last month
              </p>
            </div>
            <div className="bg-primary/20 p-4 rounded-xl text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">
                currency_exchange
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-input-bg rounded-xl p-6 border border-gray-200 dark:border-input-bg shadow-sm hover:border-gray-300 dark:hover:border-[#3e4a56] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">
                Items Low in Stock
              </p>
              <h3 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
                {lowStockCount}
              </h3>
              <p className="text-[#fa6238] text-xs font-medium mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  priority_high
                </span>{" "}
                2 items critical
              </p>
            </div>
            <div className="bg-orange-500/20 p-4 rounded-xl text-orange-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">
                inventory_2
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="border-b border-gray-200 dark:border-[#283039]">
        <nav aria-label="Tabs" className="flex gap-8">
          <button className="border-b-2 border-primary py-3 text-sm font-medium text-gray-900 dark:text-white px-1">
            Inventory List
          </button>
          <button className="border-b-2 border-transparent py-3 text-sm font-medium text-text-secondary hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#3e4a56] transition-colors px-1">
            Movement History
          </button>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="relative w-full lg:w-[480px]">
          <div className="absolute left-3 top-2.5 text-text-secondary">
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
          </div>
          <input
            className="w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            placeholder="Search by Product Name, SKU, or Category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 w-full lg:w-auto">
          <span className="material-symbols-outlined text-[20px]">tune</span>
          <span className="text-sm font-medium whitespace-nowrap">
            Stock Adjustment
          </span>
        </button>
      </div>

      <div className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229] border-b border-gray-200 dark:border-[#111418]">
                <th className="p-4 w-[350px] text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Product Name / Variant
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  SKU
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Brand
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  In-Stock Qty
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Location
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-left">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
              {loading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-secondary">
                    Loading inventory...
                  </td>
                </tr>
              )}

              {!loading && productList.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-secondary">
                    No items found.
                  </td>
                </tr>
              )}

              {!loading &&
                productList.map((product) => (
                  <InventoryRow key={product.id} product={product} />
                ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#111418] bg-white dark:bg-input-bg flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            Showing{" "}
            <span className="text-gray-900 dark:text-white font-medium">
              {productList.length === 0 ? 0 : (page - 1) * limit + 1}-
              {(page - 1) * limit + productList.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-900 dark:text-white font-medium">
              {total}
            </span>{" "}
            items (Page {page}/{totalPages})
          </span>
          <div className="flex gap-2">
            <button
              className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#1c2229] text-text-secondary hover:bg-primary hover:text-white disabled:opacity-50 transition-colors"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="size-8 flex items-center justify-center rounded bg-primary text-white">
              {page}
            </button>
            <button
              className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#1c2229] text-text-secondary hover:bg-primary hover:text-white disabled:opacity-50 transition-colors"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
