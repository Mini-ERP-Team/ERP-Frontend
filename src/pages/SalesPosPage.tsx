import { useEffect, useMemo, useRef, useState } from "react";
import productsApi from "../api/productsApi.ts";
import customersApi, { type CustomerDto } from "../api/customersApi.ts";
import ordersApi, { type PaymentMethod } from "../api/ordersApi.ts";
import ErrorAlert from "../components/ErrorAlert";
import { useAuthStore } from "../store/useAuthStore";

type CartItem = {
  idphanloai: number;
  sku: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  qty: number;
  maxStock: number;
};

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v);

const mapDanhMucToUi = (danhmuc?: string | null) => {
  const v = (danhmuc ?? "").toLowerCase();
  if (v === "smartphone") return "Smartphones";
  if (v === "component") return "Components";
  if (v === "accessory") return "Accessories";
  return danhmuc ?? "Products";
};

export default function SalesPosPage() {
  const user = useAuthStore((s) => s.user);

  const [productSearch, setProductSearch] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productList, setProductList] = useState<ProductListItemDto[]>([]);

  const [customerQuery, setCustomerQuery] = useState("");
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [customerSuggestions, setCustomerSuggestions] = useState<CustomerDto[]>(
    [],
  );
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(
    null,
  );
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const customerBoxRef = useRef<HTMLDivElement | null>(null);
  const customerInputRef = useRef<HTMLInputElement | null>(null);

  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [createCustomerError, setCreateCustomerError] = useState<string | null>(
    null,
  );

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartError, setCartError] = useState<string | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("TIEN_MAT");
  const [cashReceived, setCashReceived] = useState("");
  const [printInvoice, setPrintInvoice] = useState(true);

  const fetchProducts = async (search?: string) => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await productsApi.getAllProducts({
        page: 1,
        limit: 60,
        search: search?.trim() || undefined,
      });
      setProductList(res.data?.data ?? []);
    } catch (e) {
      setProductsError(
        e instanceof Error ? e.message : "Không thể tải danh sách sản phẩm.",
      );
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      fetchProducts(productSearch);
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  const extractCustomers = (payload: unknown): CustomerDto[] => {
    if (Array.isArray(payload)) return payload as CustomerDto[];
    if (!payload || typeof payload !== "object") return [];
    const anyPayload = payload as any;
    const list = anyPayload.data ?? anyPayload.customers ?? [];
    return Array.isArray(list) ? (list as CustomerDto[]) : [];
  };

  const fetchCustomers = async (q: string) => {
    setCustomerLoading(true);
    setCustomerError(null);
    try {
      const res = await customersApi.getCustomers({ search: q.trim() });
      setCustomerSuggestions(extractCustomers(res.data));
    } catch (e) {
      setCustomerError(
        e instanceof Error ? e.message : "Không thể tìm khách hàng.",
      );
      setCustomerSuggestions([]);
    } finally {
      setCustomerLoading(false);
    }
  };

  useEffect(() => {
    if (!isCustomerDropdownOpen) return;
    const q = customerQuery.trim();
    if (!q) {
      setCustomerSuggestions([]);
      setCustomerError(null);
      setCustomerLoading(false);
      return;
    }

    const t = window.setTimeout(() => {
      fetchCustomers(q);
    }, 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerQuery, isCustomerDropdownOpen]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = customerBoxRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setIsCustomerDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F4") {
        e.preventDefault();
        customerInputRef.current?.focus();
        setIsCustomerDropdownOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelectCustomer = (c: CustomerDto) => {
    setSelectedCustomer(c);
    setCustomerQuery(`${c.tenkhachhang}${c.sdt ? ` - ${c.sdt}` : ""}`);
    setIsCustomerDropdownOpen(false);
  };

  const openCreateCustomer = () => {
    setIsCreateCustomerOpen(true);
    setNewCustomerPhone(customerQuery.trim());
    setNewCustomerName("");
    setCreateCustomerError(null);
  };

  const extractCustomer = (payload: unknown): CustomerDto | null => {
    if (!payload || typeof payload !== "object") return null;
    const anyPayload = payload as any;
    return (anyPayload.data ?? anyPayload) as CustomerDto;
  };

  const handleCreateCustomer = async () => {
    setCreateCustomerError(null);
    if (!newCustomerName.trim()) {
      setCreateCustomerError("Vui lòng nhập Tên khách hàng.");
      return;
    }

    try {
      setCreatingCustomer(true);
      const res = await customersApi.createCustomer({
        tenkhachhang: newCustomerName.trim(),
        sdt: newCustomerPhone.trim() || null,
      });
      const created = extractCustomer(res.data);
      if (!created) {
        setCreateCustomerError("Tạo khách hàng thất bại. Vui lòng thử lại.");
        return;
      }
      setIsCreateCustomerOpen(false);
      setSelectedCustomer(created);
      setCustomerQuery(
        `${created.tenkhachhang}${created.sdt ? ` - ${created.sdt}` : ""}`,
      );
      setCustomerSuggestions([]);
      setIsCustomerDropdownOpen(false);
    } catch (e) {
      setCreateCustomerError(
        e instanceof Error ? e.message : "Tạo khách hàng thất bại.",
      );
    } finally {
      setCreatingCustomer(false);
    }
  };

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  }, [cartItems]);

  const cashReceivedNumber = useMemo(() => {
    const cleaned = cashReceived.replace(/[^\d]/g, "");
    return cleaned ? Number(cleaned) : 0;
  }, [cashReceived]);

  const changeAmount = useMemo(() => {
    return Math.max(0, cashReceivedNumber - cartSubtotal);
  }, [cashReceivedNumber, cartSubtotal]);

  const addToCart = (variant: ProductVariantDto, product: ProductListItemDto) => {
    if (!variant.idphanloai) return;
    const availableStock = variant.tonkho ?? 0;
    if (availableStock <= 0) {
      setCartError("Sản phẩm này đã hết hàng (stock = 0).");
      return;
    }
    setCartItems((prev) => {
      const idx = prev.findIndex((x) => x.idphanloai === variant.idphanloai);
      const variantName =
        [
          variant.dungluong ?? undefined,
          variant.mausac ?? undefined,
          variant.xuatxu ?? undefined,
        ]
          .filter(Boolean)
          .join(" - ") || variant.tenphanloai;
      if (idx >= 0) {
        const copy = [...prev];
        const nextQty = copy[idx].qty + 1;
        if (nextQty > copy[idx].maxStock) {
          setCartError(
            `Số lượng mua vượt tồn kho. Tồn kho hiện tại: ${copy[idx].maxStock}`,
          );
          return copy;
        }
        copy[idx] = { ...copy[idx], qty: nextQty };
        return copy;
      }
      return [
        {
          idphanloai: variant.idphanloai,
          sku: variant.sku ?? "-",
          productName: product.name,
          variantName,
          unitPrice: variant.giaban ?? 0,
          qty: 1,
          maxStock: availableStock,
        },
        ...prev,
      ];
    });
  };

  const updateQty = (idphanloai: number, qty: number) => {
    setCartItems((prev) => {
      if (qty <= 0) return prev.filter((x) => x.idphanloai !== idphanloai);
      return prev.map((x) => {
        if (x.idphanloai !== idphanloai) return x;
        if (qty > x.maxStock) {
          setCartError(
            `Số lượng mua vượt tồn kho. Tồn kho hiện tại: ${x.maxStock}`,
          );
          return { ...x, qty: x.maxStock };
        }
        return { ...x, qty };
      });
    });
  };

  const applyStockAfterSale = (soldItems: CartItem[]) => {
    if (soldItems.length === 0) return;

    setProductList((prev) => {
      return prev.map((p) => {
        const variants = p.variants ?? [];
        if (variants.length === 0) return p;

        let changed = false;
        const nextVariants = variants.map((v) => {
          const sold = soldItems.find((it) => it.idphanloai === v.idphanloai);
          if (!sold) return v;
          changed = true;
          const current = v.tonkho ?? 0;
          return { ...v, tonkho: Math.max(0, current - sold.qty) };
        });

        if (!changed) return p;

        const nextTotalStock = nextVariants.reduce(
          (sum, v) => sum + (v.tonkho ?? 0),
          0,
        );

        return { ...p, variants: nextVariants, stock: nextTotalStock };
      });
    });
  };

  const notFoundText = customerQuery.trim();
  const showNotFound =
    isCustomerDropdownOpen &&
    !!notFoundText &&
    !customerLoading &&
    !customerError &&
    customerSuggestions.length === 0;

  const openCheckout = () => {
    setCheckoutError(null);

    if (!user?.idnguoidung) {
      setCheckoutError("Bạn cần đăng nhập để tạo đơn bán.");
      return;
    }
    if (!selectedCustomer?.idkhachhang) {
      setCheckoutError("Vui lòng chọn khách hàng trước khi thanh toán (F4).");
      return;
    }
    if (cartItems.length === 0) {
      setCheckoutError("Giỏ hàng đang trống. Vui lòng chọn sản phẩm để bán.");
      return;
    }

    setPaymentMethod("TIEN_MAT");
    setCashReceived("");
    setPrintInvoice(true);
    setIsCheckoutOpen(true);
  };

  const extractOrder = (payload: unknown): any | null => {
    if (!payload || typeof payload !== "object") return null;
    const anyPayload = payload as any;
    return anyPayload.data ?? anyPayload;
  };

  const printReceipt = (order: any) => {
    const w = window.open("", "_blank", "width=420,height=720");
    if (!w) return;

    const code = order?.madonhang ?? `#${order?.iddonban ?? ""}`;
    const createdAt = order?.ngaytao ?? new Date().toISOString();

    const rows = cartItems
      .map(
        (it) => `
        <tr>
          <td style="padding:6px 0; border-bottom:1px dashed #ddd;">
            <div style="font-weight:600;">${it.productName}</div>
            <div style="color:#555; font-size:12px;">${it.variantName} • SKU: ${it.sku}</div>
          </td>
          <td style="text-align:right; padding:6px 0; border-bottom:1px dashed #ddd;">${it.qty}</td>
          <td style="text-align:right; padding:6px 0; border-bottom:1px dashed #ddd;">${fmtMoney(it.unitPrice)}</td>
          <td style="text-align:right; padding:6px 0; border-bottom:1px dashed #ddd;">${fmtMoney(it.unitPrice * it.qty)}</td>
        </tr>
      `,
      )
      .join("");

    w.document.open();
    w.document.write(`
      <html>
        <head>
          <title>Invoice ${code}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 16px; }
            h1 { font-size: 18px; margin: 0 0 8px; }
            .muted { color:#666; font-size:12px; }
            table { width:100%; border-collapse:collapse; margin-top:12px; }
            th { text-align:left; font-size:12px; color:#666; padding:6px 0; border-bottom:1px solid #eee; }
            .totals { margin-top:12px; }
            .line { display:flex; justify-content:space-between; margin:4px 0; }
            .bold { font-weight:700; }
          </style>
        </head>
        <body>
          <h1>HÓA ĐƠN BÁN HÀNG</h1>
          <div class="muted">Mã đơn: <b>${code}</b></div>
          <div class="muted">Ngày: ${createdAt}</div>
          <div class="muted">Nhân viên: ${user?.hoten ?? "-"}</div>
          <div class="muted">Khách hàng: ${selectedCustomer?.tenkhachhang ?? "-"}</div>
          <div class="muted">SĐT: ${selectedCustomer?.sdt ?? "-"}</div>

          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th style="text-align:right;">SL</th>
                <th style="text-align:right;">Giá</th>
                <th style="text-align:right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="totals">
            <div class="line"><span>Tạm tính</span><span class="bold">${fmtMoney(cartSubtotal)}</span></div>
            <div class="line"><span>Phương thức</span><span>${paymentMethod === "TIEN_MAT" ? "Tiền mặt" : "Chuyển khoản"}</span></div>
          </div>
          <div class="muted" style="margin-top:12px;">Cảm ơn quý khách!</div>
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const finalizeOrder = async () => {
    setCheckoutError(null);
    if (!selectedCustomer?.idkhachhang) {
      setCheckoutError("Vui lòng chọn khách hàng.");
      return;
    }
    if (cartItems.length === 0) {
      setCheckoutError("Giỏ hàng đang trống.");
      return;
    }
    if (paymentMethod === "TIEN_MAT" && cashReceivedNumber < cartSubtotal) {
      setCheckoutError("Tiền khách đưa chưa đủ.");
      return;
    }

    try {
      setSubmittingOrder(true);
      const res = await ordersApi.createOrder({
        idnguoidung: useAuthStore.getState().user?.idnguoidung ?? 0,
        idkhachhang: selectedCustomer.idkhachhang,
        phuongthucTT: paymentMethod,
        tongtien: cartSubtotal,
        chiTiet: cartItems.map((it) => ({
          idphanloai: it.idphanloai,
          soluong: it.qty,
          giaban: it.unitPrice,
        })),
      });

      const created = extractOrder(res.data);
      setIsCheckoutOpen(false);

      if (printInvoice) {
        printReceipt(created);
      }

      applyStockAfterSale(cartItems);
      setCartItems([]);
      setCartError(null);
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : "Tạo đơn bán thất bại.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
      <div className="xl:col-span-7">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full">
            <div className="absolute left-3 top-2.5 text-text-secondary">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              className="w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              placeholder="Tìm sản phẩm theo tên / SKU / danh mục..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>
        </div>

        {productsError && <ErrorAlert message={productsError} />}

        <div className="mt-4 bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden shadow-sm dark:shadow-none">
          <div className="p-4 border-b border-gray-200 dark:border-[#111418] flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white font-bold">
              Danh sách sản phẩm
            </h3>
            <span className="text-xs text-text-secondary">
              {productsLoading ? "Đang tải..." : `${productList.length} items`}
            </span>
          </div>

          <div className="p-4">
            {productsLoading ? (
              <div className="text-text-secondary text-sm p-6 text-center">
                Loading products...
              </div>
            ) : productList.length === 0 ? (
              <div className="text-text-secondary text-sm p-6 text-center">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {productList.map((p) => {
                  const category = mapDanhMucToUi(p.category);
                  const variants = p.variants ?? [];
                  const primaryVariant = variants[0];
                  const primaryInStock = (primaryVariant?.tonkho ?? 0) > 0;
                  return (
                    <div
                      key={p.id}
                      className="border border-gray-200 dark:border-[#111418] rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-[#3e4a56] transition-colors flex flex-col"
                    >
                      <div className="h-28 bg-gray-50 dark:bg-[#1c2229] border-b border-gray-200 dark:border-[#111418]">
                        {p.image ? (
                          <div
                            className="h-full w-full bg-center bg-cover"
                            style={{ backgroundImage: `url("${p.image}")` }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-text-secondary">
                            <span className="material-symbols-outlined text-4xl">
                              inventory_2
                            </span>
                          </div>
                        )}
                      </div>
                  
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-3 mb-auto">
                          <div className="min-w-0">
                            <p className="text-gray-900 dark:text-white text-sm font-semibold truncate" title={p.name}>
                              {p.name}
                            </p>
                            <p className="text-text-secondary text-xs mt-0.5">
                              {p.brand ?? "-"} • {category} • Stock: {p.stock}
                            </p>
                          </div>
                          <span className="text-xs text-text-secondary shrink-0 bg-gray-100 dark:bg-[#2c353f] px-1.5 py-0.5 rounded">
                            {p.variantCount} loại
                          </span>
                        </div>
                  
                        <div className="mt-3 flex flex-col gap-2">
                          <select
                            className="w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2 px-2 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:outline-none"
                            disabled={variants.length === 0}
                            defaultValue={primaryVariant?.idphanloai ?? ""}
                            onChange={(e) => {
                              const id = Number(e.target.value);
                              const v = variants.find((x) => x.idphanloai === id);
                              if (v) addToCart(v, p);
                              e.currentTarget.value = String(id);
                            }}
                          >
                            {variants.length === 0 ? (
                              <option value="">Hết hàng</option>
                            ) : (
                              variants.map((v) => (
                                <option
                                  key={v.idphanloai}
                                  value={v.idphanloai}
                                  disabled={(v.tonkho ?? 0) <= 0}
                                >
                                  {v.sku ?? v.tenphanloai} • {fmtMoney(v.giaban ?? 0)}
                                  {(v.tonkho ?? 0) <= 0 ? " • Hết hàng" : ""}
                                </option>
                              ))
                            )}
                          </select>
                  
                          <button
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-xs font-bold uppercase tracking-wide disabled:opacity-50"
                            disabled={!primaryVariant || !primaryInStock}
                            onClick={() => primaryVariant && addToCart(primaryVariant, p)}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              add_shopping_cart
                            </span>
                            Thêm vào đơn
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-3">
        <div className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden shadow-sm dark:shadow-none">
          <div className="p-4 border-b border-gray-200 dark:border-[#111418]">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 dark:text-white font-bold">
                Thanh toán
              </h3>
              <span className="text-xs text-text-secondary">
                {cartItems.length} items
              </span>
            </div>

            <div className="mt-3" ref={customerBoxRef}>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Tìm khách hàng (F4)
              </label>
              <div className="relative mt-2">
                <div className="absolute left-3 top-2.5 text-text-secondary">
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </div>
                <input
                  className="w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Nhập số điện thoại (VD: 0987...)"
                  value={customerQuery}
                  ref={customerInputRef}
                  onFocus={() => setIsCustomerDropdownOpen(true)}
                  onChange={(e) => {
                    setCustomerQuery(e.target.value);
                    setSelectedCustomer(null);
                    setIsCustomerDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const first = customerSuggestions[0];
                      if (first) handleSelectCustomer(first);
                    }
                    if (e.key === "Escape") setIsCustomerDropdownOpen(false);
                  }}
                />

                {isCustomerDropdownOpen && (customerQuery.trim() || customerLoading) && (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 dark:border-[#111418] bg-white dark:bg-input-bg shadow-lg overflow-hidden">
                    {customerLoading && (
                      <div className="p-3 text-sm text-text-secondary">
                        Đang tìm khách hàng...
                      </div>
                    )}

                    {customerError && (
                      <div className="p-3 text-sm text-red-500">
                        {customerError}
                      </div>
                    )}

                    {!customerLoading &&
                      !customerError &&
                      customerSuggestions.length > 0 && (
                        <div className="max-h-64 overflow-auto custom-scrollbar">
                          {customerSuggestions.map((c) => (
                            <button
                              key={c.idkhachhang}
                              className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors"
                              onClick={() => handleSelectCustomer(c)}
                            >
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {c.tenkhachhang}
                              </div>
                              <div className="text-xs text-text-secondary">
                                {c.sdt ?? "-"}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                    {showNotFound && (
                      <div className="p-3">
                        <div className="text-sm text-text-secondary">
                          Không tìm thấy{" "}
                          <span className="text-gray-900 dark:text-white font-semibold">
                            "{notFoundText}"
                          </span>
                        </div>
                        <button
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                          onClick={openCreateCustomer}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            add
                          </span>
                          <span className="text-sm font-medium">
                            Thêm mới khách hàng
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedCustomer && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedCustomer.tenkhachhang}
                  </div>
                  <div className="text-xs text-text-secondary">
                    SĐT: {selectedCustomer.sdt ?? "-"} • Điểm:{" "}
                    {selectedCustomer.diemtichluy ?? 0}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            {cartError && <ErrorAlert message={cartError} />}
            {productsError && <ErrorAlert message={productsError} />}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900 dark:text-white font-semibold">
                Giỏ hàng
              </h4>
              <button
                className="text-xs text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setCartItems([])}
                disabled={cartItems.length === 0}
              >
                Clear
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-6 text-center text-text-secondary text-sm border border-dashed border-gray-200 dark:border-[#111418] rounded-xl">
                Chưa có sản phẩm trong giỏ. Hãy chọn hàng ở cột bên trái.
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((it) => (
                  <div
                    key={it.idphanloai}
                    className="border border-gray-200 dark:border-[#111418] rounded-xl p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {it.productName}
                        </div>
                        <div className="text-xs text-text-secondary mt-0.5">
                          {it.variantName} • SKU:{" "}
                          <span className="font-mono">{it.sku}</span>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white shrink-0">
                        {fmtMoney(it.unitPrice * it.qty)}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-text-secondary">
                        {fmtMoney(it.unitPrice)} / item
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#1c2229] text-text-secondary hover:bg-primary hover:text-white transition-colors"
                          onClick={() => updateQty(it.idphanloai, it.qty - 1)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            remove
                          </span>
                        </button>
                        <input
                          className="w-12 text-center bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-1.5 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:outline-none"
                          value={it.qty}
                          onChange={(e) =>
                            updateQty(
                              it.idphanloai,
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                        <button
                          className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#1c2229] text-text-secondary hover:bg-primary hover:text-white transition-colors"
                          onClick={() => updateQty(it.idphanloai, it.qty + 1)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-text-secondary">
                      Stock: {it.maxStock}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-[#111418]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Tạm tính</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {fmtMoney(cartSubtotal)}
              </span>
            </div>

            <button
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
              disabled={cartItems.length === 0}
              onClick={openCheckout}
            >
              <span className="material-symbols-outlined text-[20px]">
                receipt_long
              </span>
              <span className="text-sm font-medium">Tạo đơn bán</span>
            </button>
          </div>
        </div>
      </div>

      {isCreateCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-[#111418] shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-[#111418] flex items-center justify-between">
              <h3 className="text-gray-900 dark:text-white font-bold">
                Thêm mới khách hàng
              </h3>
              <button
                className="text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsCreateCustomerOpen(false)}
                disabled={creatingCustomer}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4">
              {createCustomerError && <ErrorAlert message={createCustomerError} />}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Số điện thoại
                  </label>
                  <input
                    className="mt-2 w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="0987..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Tên khách hàng
                  </label>
                  <input
                    className="mt-2 w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder='VD: "Anh Nam"'
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateCustomer();
                      if (e.key === "Escape") setIsCreateCustomerOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-[#111418] flex items-center justify-end gap-2">
              <button
                className="px-4 py-2.5 rounded-lg bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg hover:border-gray-300 dark:hover:bg-[#323b46] text-text-secondary hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium disabled:opacity-50"
                onClick={() => setIsCreateCustomerOpen(false)}
                disabled={creatingCustomer}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm font-medium disabled:opacity-50"
                onClick={handleCreateCustomer}
                disabled={creatingCustomer}
              >
                {creatingCustomer ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-[#111418] shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-[#111418] flex items-center justify-between">
              <h3 className="text-gray-900 dark:text-white font-bold">
                Thanh Toán
              </h3>
              <button
                className="text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsCheckoutOpen(false)}
                disabled={submittingOrder}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4">
              {checkoutError && <ErrorAlert message={checkoutError} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-[#111418] rounded-xl p-4">
                  <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Thông tin đơn
                  </div>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Khách hàng</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedCustomer?.tenkhachhang ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">SĐT</span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {selectedCustomer?.sdt ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Tạm tính</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {fmtMoney(cartSubtotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-[#111418] rounded-xl p-4">
                  <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Phương thức thanh toán
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        paymentMethod === "TIEN_MAT"
                          ? "bg-primary text-white border-primary"
                          : "bg-white dark:bg-input-bg text-text-secondary border-gray-200 dark:border-input-bg hover:border-gray-300 dark:hover:bg-[#323b46]"
                      }`}
                      onClick={() => setPaymentMethod("TIEN_MAT")}
                      disabled={submittingOrder}
                    >
                      Tiền mặt
                    </button>
                    <button
                      className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        paymentMethod === "CHUYEN_KHOAN"
                          ? "bg-primary text-white border-primary"
                          : "bg-white dark:bg-input-bg text-text-secondary border-gray-200 dark:border-input-bg hover:border-gray-300 dark:hover:bg-[#323b46]"
                      }`}
                      onClick={() => setPaymentMethod("CHUYEN_KHOAN")}
                      disabled={submittingOrder}
                    >
                      Chuyển khoản
                    </button>
                  </div>

                  {paymentMethod === "TIEN_MAT" && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Tiền khách đưa
                        </label>
                        <input
                          className="mt-2 w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                          value={cashReceived}
                          onChange={(e) => setCashReceived(e.target.value)}
                          placeholder="VD: 500000"
                          disabled={submittingOrder}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">
                          Tiền thừa
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {fmtMoney(changeAmount)}
                        </span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "CHUYEN_KHOAN" && (
                    <div className="mt-4">
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src="/qr.png"
                          alt="QR demo"
                          className="w-56 h-56 rounded-xl border border-gray-200 dark:border-[#111418] bg-white"
                        />
                        <div className="text-xs text-text-secondary text-center">
                          Quét mã QR để thanh toán{" "}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {fmtMoney(cartSubtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  id="printInvoice"
                  type="checkbox"
                  checked={printInvoice}
                  onChange={(e) => setPrintInvoice(e.target.checked)}
                  disabled={submittingOrder}
                />
                <label
                  htmlFor="printInvoice"
                  className="text-sm text-gray-900 dark:text-white"
                >
                  In hóa đơn (mặc định)
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-[#111418]">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                onClick={finalizeOrder}
                disabled={submittingOrder}
              >
                <span className="material-symbols-outlined text-[20px]">
                  print
                </span>
                <span className="text-sm font-bold">
                  {submittingOrder ? "Đang xử lý..." : "HOÀN TẤT & IN"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

