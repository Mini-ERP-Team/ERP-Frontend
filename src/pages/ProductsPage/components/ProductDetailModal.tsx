import { useEffect, useMemo, useState } from "react";
import productsApi from "../../../api/productsApi.ts";
import ErrorAlert from "../../../components/ErrorAlert";

const CLOUD_NAME =
  (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME ?? "1234567890";
const UPLOAD_PRESET =
  (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET ?? "1234567890";
const CLOUDINARY_FOLDER = (import.meta as any).env?.VITE_CLOUDINARY_FOLDER;

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
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const displaySku = useMemo(() => {
    if (!product) return "-";
    return product.sku ?? product.apiVariants?.[0]?.sku ?? "-";
  }, [product]);

  const toApiCategory = (ui: string) => {
    const v = (ui ?? "").toLowerCase();
    if (v === "smartphones" || v === "smartphone") return "Smartphone";
    if (v === "components" || v === "component") return "Component";
    if (v === "accessories" || v === "accessory") return "Accessory";
    return ui;
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !product) return;
    setIsEditing(false);
    setIsSubmitting(false);
    setError(null);
    setName(product.name ?? "");
    setCategory(product.category ?? "");
    setBrand(product.brand ?? "");
    setModel(product.model ?? "");
    setImageUrl(product.image ?? "");
    setImageFile(null);
    setImagePreviewUrl(null);
  }, [open, product]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const uploadToCloudinary = async (file: Blob) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    if (CLOUDINARY_FOLDER) form.append("folder", String(CLOUDINARY_FOLDER));

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: form },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Upload ảnh thất bại (${res.status}). ${text || "Vui lòng thử lại."}`,
      );
    }

    const data = (await res.json()) as { secure_url?: string; url?: string };
    const url = data.secure_url ?? data.url;
    if (!url) throw new Error("Upload ảnh thất bại: missing secure_url.");
    return url;
  };

  const handleSave = async () => {
    if (!product) return;
    setError(null);
    if (!name.trim()) {
      setError("Vui lòng nhập Tên sản phẩm.");
      return;
    }
    try {
      setIsSubmitting(true);

      const finalImageUrl = imageFile
        ? await uploadToCloudinary(imageFile)
        : imageUrl.trim() || undefined;

      const res = await productsApi.updateProduct(product.id, {
        tensanpham: name.trim(),
        danhmuc: toApiCategory(category),
        thuonghieu: brand.trim() || undefined,
        model: model.trim() || undefined,
        hinhanh: finalImageUrl,
      });

      const updatedFromApi = (res.data as any)?.data ?? (res.data as any);
      const updated: ProductDetail = {
        ...product,
        name: updatedFromApi?.tensanpham ?? name.trim(),
        category: category,
        brand: updatedFromApi?.thuonghieu ?? (brand.trim() || undefined),
        model: updatedFromApi?.model ?? (model.trim() || undefined),
        image: updatedFromApi?.hinhanh ?? finalImageUrl,
      };

      onEdit?.(updated);
      setIsEditing(false);
      setImageFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cập nhật sản phẩm thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {error && <ErrorAlert message={error} className="mb-4" />}
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
                  {isEditing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg py-2 px-3 text-white placeholder:text-[#9dabb9] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                      placeholder="Tên sản phẩm"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white leading-tight">
                      {product.name}
                    </h2>
                  )}

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
                <InfoItem label="SKU" value={displaySku} mono />
                {isEditing ? (
                  <SelectItem
                    label="Category"
                    value={category}
                    onChange={setCategory}
                    options={[
                      { value: "Smartphone", label: "Smartphone" },
                      { value: "Component", label: "Component" },
                      { value: "Accessory", label: "Accessory" },
                      { value: "Smartphones", label: "Smartphones" },
                      { value: "Components", label: "Components" },
                      { value: "Accessories", label: "Accessories" },
                    ]}
                  />
                ) : (
                  <InfoItem label="Category" value={product.category} />
                )}
                {isEditing ? (
                  <InputItem label="Brand" value={brand} onChange={setBrand} />
                ) : (
                  <InfoItem label="Brand" value={product.brand ?? "-"} />
                )}
                {isEditing ? (
                  <InputItem label="Model" value={model} onChange={setModel} />
                ) : (
                  <InfoItem label="Model" value={product.model ?? "-"} />
                )}
                <InfoItem label="Stock Level" value={`${product.stock} units`} />
                <InfoItem label="Variants" value={String(product.apiVariants?.length ?? 0)} />
              </div>

              {isEditing && (
                <div className="border border-[#283039] rounded-lg p-4">
                  <div className="text-[#9dabb9] text-xs uppercase tracking-wider font-semibold mb-2">
                    Ảnh đại diện (hinhanh)
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-44">
                      <div className="aspect-square w-full rounded-lg border border-[#283039] bg-[#111418] overflow-hidden flex items-center justify-center">
                        {imagePreviewUrl ? (
                          <img
                            src={imagePreviewUrl}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        ) : product.image ? (
                          <div
                            className="w-full h-full bg-center bg-cover"
                            style={{ backgroundImage: `url("${product.image}")` }}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-[#9dabb9] text-4xl">
                            image
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setImageFile(e.target.files?.[0] ?? null)
                          }
                          disabled={isSubmitting}
                          className="block w-full text-sm text-[#9dabb9] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#283039] file:text-white hover:file:bg-[#323b46]"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setImageFile(null)}
                            disabled={!imageFile || isSubmitting}
                            className="px-3 py-2 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                          >
                            Remove
                          </button>
                          <span className="text-[11px] text-[#9dabb9]">
                            Chọn ảnh để upload lên Cloudinary khi Save.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* keep imageUrl state for backward compatibility / existing image */}
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-3 w-full bg-[#283039] border border-[#283039] rounded-lg py-2 px-3 text-white placeholder:text-[#9dabb9] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                    placeholder="(Optional) image URL"
                    disabled={isSubmitting}
                  />
                </div>
              )}

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
          {!isEditing ? (
            <>
              <button
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors font-medium flex items-center justify-center gap-2"
                onClick={() => onDelete?.(product)}
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                Delete Product
              </button>

              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                onClick={() => setIsEditing(true)}
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
                Edit Product
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#283039] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                <span className="material-symbols-outlined text-[20px]">
                  save
                </span>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
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

function InputItem({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[#9dabb9] text-xs uppercase tracking-wider font-semibold">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#283039] border border-[#283039] rounded-lg py-2 px-3 text-white placeholder:text-[#9dabb9] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
      />
    </div>
  );
}

function SelectItem({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[#9dabb9] text-xs uppercase tracking-wider font-semibold">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#283039] border border-[#283039] rounded-lg py-2 px-3 text-white focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
