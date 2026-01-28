import { useEffect, useRef, useState } from "react";
import productsApi from "../../../api/productsApi";

export const useProducts = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const didInit = useRef(false);

  const toStatus = (stock: number): StockStatus => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const toPercent = (stock: number) => {
    if (stock <= 0) return 0;
    if (stock >= 50) return 100;
    return Math.round((stock / 50) * 100);
  };

  const mapDanhMucToUi = (danhmuc?: string | null) => {
    const v = (danhmuc ?? "").toLowerCase();
    if (v === "smartphone") return "Smartphones";
    if (v === "component") return "Components";
    if (v === "accessory") return "Accessories";
    return danhmuc ?? "Products";
  };

  const formatMoney = (n: number) => `$${Number(n || 0).toLocaleString()}`;

  const mapApiProductToUi = (p: ProductListItemDto): Product => {
    const mappedCategory = mapDanhMucToUi(p.category);
    const variants = (p.variants ?? []).map((v) => {
      const stock = v.tonkho ?? 0;
      return {
        id: String(v.idphanloai),
        name: v.tenphanloai,
        sku: v.sku ?? "-",
        price: formatMoney(v.giaban ?? 0),
        stock,
        stockPercent: toPercent(stock),
        status: toStatus(stock),
      };
    });

    const min = p.price?.min ?? 0;
    const max = p.price?.max ?? 0;
    const priceText =
      min === max ? formatMoney(min) : `${formatMoney(min)} - ${formatMoney(max)}`;

    const firstSku = p.variants?.[0]?.sku ?? undefined;
    const isMultiVariant = (p.variantCount ?? 0) > 1;

    return {
      id: p.id,
      name: p.name,
      sku: !isMultiVariant ? firstSku ?? undefined : undefined,
      category: mappedCategory,
      brand: p.brand ?? undefined,
      model: p.model ?? undefined,
      price: priceText,
      stock: p.stock ?? 0,
      stockPercent: toPercent(p.stock ?? 0),
      status: toStatus(p.stock ?? 0),
      image: p.image ?? undefined,
      apiVariants: p.variants ?? [],
      variantCountText: isMultiVariant
        ? `${p.variantCount} Variants`
        : firstSku
          ? `SKU: ${firstSku}`
          : "Single Item",
      variants: isMultiVariant && variants.length > 0 ? variants : undefined,
    };
  };

  const fetchProducts = async (opts?: { resetPage?: boolean }) => {
    const nextPage = opts?.resetPage ? 1 : page;
    if (opts?.resetPage) setPage(1);

    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getAllProducts({
        page: nextPage,
        limit,
        search: search.trim() || undefined,
        category: category || undefined,
        sort,
      });

      const list = res.data?.data ?? [];
      setProductList(list.map(mapApiProductToUi));
      setTotalPages(res.data?.meta?.totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      fetchProducts();
      return;
    }

    const t = window.setTimeout(() => {
      fetchProducts();
    }, 350);

    return () => window.clearTimeout(t);
  }, [page, sort, category, search]);

  const handleAddProductSubmit = async (payload: AddProductPayload) => {
    try {
      console.log("payload", payload);
      const res = await productsApi.createProduct(payload);
      const created = res.data?.data;

      if (!created) return;

      console.log("created", created);

      const category = mapDanhMucToUi(created.danhmuc);
      const phanLoais = created.phanLoais ?? [];

      if (phanLoais.length > 1) {
        const variants: Variant[] = phanLoais.map((pl) => {
          const stock = pl.tonkho ?? 0;
          return {
            id: String(pl.idphanloai),
            name: pl.tenphanloai,
            sku: pl.sku ?? "-",
            price: `$${Number(pl.giaban || 0).toLocaleString()}`,
            stock,
            stockPercent: toPercent(stock),
            status: toStatus(stock),
          };
        });

        const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
        const bestPrice = Math.min(...phanLoais.map((p) => Number(p.giaban || 0)));

        const uiProduct: Product = {
          id: created.idsanpham,
          name: created.tensanpham,
          category,
          price: `$${Number(bestPrice || 0).toLocaleString()}+`,
          stock: totalStock,
          stockPercent: toPercent(totalStock),
          status: toStatus(totalStock),
          image: created.hinhanh ?? undefined,
          variantCountText: `${variants.length} Variants`,
          variants,
        };

        setProductList((prev) => [uiProduct, ...prev]);
        return;
      }
      const pl = phanLoais[0];
      const stock = pl?.tonkho ?? 0;
      const uiProduct: Product = {
        id: created.idsanpham,
        name: created.tensanpham,
        sku: pl?.sku ?? undefined,
        category,
        price: `$${Number(pl?.giaban || 0).toLocaleString()}`,
        stock,
        stockPercent: toPercent(stock),
        status: toStatus(stock),
        image: created.hinhanh ?? undefined,
        variantCountText: "Single Item",
      };

      setProductList((prev) => [uiProduct, ...prev]);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Tạo sản phẩm thất bại. Vui lòng thử lại.";
      throw new Error(message);
    }
  };

  return {
    productList,
    loading,
    error,

    page,
    totalPages,
    limit,

    search,
    category,
    sort,

    setPage,
    setSearch,
    setCategory,
    setSort,

    fetchProducts,
    handleAddProductSubmit,
  };
};

