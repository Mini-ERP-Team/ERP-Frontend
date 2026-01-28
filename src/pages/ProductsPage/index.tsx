
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AddProductModal from "./components/AddProductModal";
import ProductDetailModal from "./components/ProductDetailModal";
import ErrorAlert from "../../components/ErrorAlert";
import { ProductRow } from "./components/ProductRow";
import { useProducts } from "./hooks/useProducts";

const ProductPage = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    productList,
    loading,
    error,
    page,
    totalPages,
    search,
    category,
    sort,
    setPage,
    setSearch,
    setCategory,
    setSort,
    fetchProducts,
    handleAddProductSubmit,
  } = useProducts();

  const urlQ = searchParams.get("q") ?? "";
  useEffect(() => {
    if ((urlQ ?? "") !== (search ?? "")) {
      setSearch(urlQ);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9dabb9]">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              className="w-full bg-[#283039] border border-[#283039] rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-[#9dabb9] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              placeholder="Search by product name..."
              type="text"
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

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#283039] text-[#9dabb9] border border-[#283039] hover:border-[#3e4a56] hover:text-white transition-colors text-sm"
            title="Category"
          >
            <option value="">All Categories</option>
            <option value="Smartphone">Smartphone</option>
            <option value="Component">Component</option>
            <option value="Accessory">Accessory</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="px-4 py-2 rounded-lg bg-[#283039] text-[#9dabb9] border border-[#283039] hover:border-[#3e4a56] hover:text-white transition-colors text-sm"
            title="Sort"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap self-end md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm font-medium">Add Product</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      <section className="bg-[#283039] rounded-xl border border-[#283039] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c2229] border-b border-[#111418]">
                <th className="p-4 pl-6 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-16"></th>
                <th className="p-4 pl-0 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-16">
                  Image
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Product Name / Variant
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  SKU
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Price
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 pr-6 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#111418]">
              {loading && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#9dabb9]">
                    Loading products...
                  </td>
                </tr>
              )}

              {!loading && productList.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#9dabb9]">
                    No products found.
                  </td>
                </tr>
              )}

              {!loading &&
                productList.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    onOpenDetail={(prod) => {
                      setSelectedProduct(prod);
                    }}
                  />
                ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#111418] p-4 flex items-center justify-between">
          <span className="text-xs text-[#9dabb9]">
            Page {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs rounded border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] disabled:opacity-50 transition-colors"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 text-xs rounded border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] disabled:opacity-50 transition-colors"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {isAddOpen && (
        <AddProductModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddProductSubmit}
        />
      )}

      <ProductDetailModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={(updated) => {
          setSelectedProduct(updated);
          fetchProducts();
        }}
      />

    </>
  );
};

export default ProductPage;
