import { useEffect, useMemo, useState } from "react";
import ErrorAlert from "../../../components/ErrorAlert";
import { useAuthStore } from "../../../store/useAuthStore";

const CLOUD_NAME =
  (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME ?? "1234567890";
const UPLOAD_PRESET =
  (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET ??
  "1234567890";
const CLOUDINARY_FOLDER = (import.meta as any).env?.VITE_CLOUDINARY_FOLDER;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductPayload) => Promise<void>;
};

export default function AddProductModal({ isOpen, onClose, onSubmit }: Props) {
  const [category, setCategory] = useState<Category>("smartphone");

  const [tensanpham, setTensanpham] = useState("");
  const [danhmuc, setDanhmuc] = useState<ProductCategoryLabel>("Smartphone");
  const [thuonghieu, setThuonghieu] = useState("");
  const [model, setModel] = useState("");
  const [mota, setMota] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [tempSku, setTempSku] = useState("");
  const [tempMauSac, setTempMauSac] = useState("");
  const [tempDungLuong, setTempDungLuong] = useState("256GB");
  const [tempXuatXu, setTempXuatXu] = useState("VN/A");
  const [tempGiaNhap, setTempGiaNhap] = useState<number>(0);
  const [tempGiaBan, setTempGiaBan] = useState<number>(0);
  const [tempTonKho, setTempTonKho] = useState<number>(0);

  const [singleSku, setSingleSku] = useState("");
  const [loaiChiTiet, setLoaiChiTiet] = useState("");
  const [nhaSanXuat, setNhaSanXuat] = useState("");
  const [tuongThich, setTuongThich] = useState("");
  const [thongSoKyThuat, setThongSoKyThuat] = useState("");
  const [singleGiaNhap, setSingleGiaNhap] = useState<number>(0);
  const [singleGiaBan, setSingleGiaBan] = useState<number>(0);

  useEffect(() => {
    if (category === "smartphone") setDanhmuc("Smartphone");
    if (category === "component") setDanhmuc("Component");
    if (category === "accessory") setDanhmuc("Accessory");
  }, [category]);

  const title = useMemo(() => {
    if (category === "smartphone") return "Biến thể (Smartphone)";
    if (category === "component") return "Chi tiết (Linh kiện)";
    return "Chi tiết (Phụ kiện)";
  }, [category]);

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

  const generateRandomPlaceholderPng = async (label: string) => {
    const size = 640;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Không thể tạo ảnh placeholder.");

    const seed = `${label}-${Date.now()}-${Math.random()}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    const hue = Math.abs(hash) % 360;

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, `hsl(${hue}, 70%, 45%)`);
    grad.addColorStop(1, `hsl(${(hue + 40) % 360}, 70%, 35%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#000";
    for (let y = 0; y < 10; y++) {
      ctx.fillRect(0, y * 64, size, 2);
    }
    ctx.globalAlpha = 1;

    const initials = label
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "bold 120px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials || "P", size / 2, size / 2);

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Không thể tạo blob ảnh."))),
        "image/png",
        0.92,
      );
    });

    return blob;
  };

  const slugify = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toUpperCase();

  const generateSku = (input: {
    tensanpham: string;
    mausac?: string;
    dungluong?: string;
    xuatxu?: string;
  }) => {
    const base = slugify(input.tensanpham).slice(0, 18) || "SP";
    const color = input.mausac ? slugify(input.mausac).slice(0, 6) : "";
    const cap = input.dungluong ? slugify(input.dungluong).replace("GB", "") : "";
    const origin = input.xuatxu ? slugify(input.xuatxu).replace("-", "") : "";
    return [base, cap, color, origin].filter(Boolean).join("-").slice(0, 32);
  };

  const handleAddVariant = () => {
    if (!tempMauSac.trim() || !tempDungLuong.trim() || !tempXuatXu.trim()) {
      return;
    }
    
    const sku =
      tempSku.trim() ||
      generateSku({
        tensanpham: tensanpham || "san-pham",
        mausac: tempMauSac,
        dungluong: tempDungLuong,
        xuatxu: tempXuatXu,
      });

    const newVariant: VariantRow = {
      id: Math.random().toString(36).substr(2, 9),
      sku,
      mausac: tempMauSac,
      dungluong: tempDungLuong,
      xuatxu: tempXuatXu,
      gianhap: tempGiaNhap,
      giaban: tempGiaBan,
      tonkho: tempTonKho,
    };

    setVariants([...variants, newVariant]);
    
    setTempSku("");
    setTempMauSac("");
    setTempGiaNhap(0);
    setTempGiaBan(0);
    setTempTonKho(0);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!tensanpham.trim()) {
      setError("Vui lòng nhập Tên sản phẩm.");
      return;
    }

    try {
      setIsSubmitting(true);

      const imageUrl = imageFile
        ? await uploadToCloudinary(imageFile)
        : await uploadToCloudinary(await generateRandomPlaceholderPng(tensanpham));

      const creatorId = useAuthStore.getState().user?.idnguoidung;
      if (creatorId === undefined || creatorId === null) {
        setError("Bạn cần đăng nhập...");
        return;
      }

      const sanPham: SanPhamCreate = {
        tensanpham,
        danhmuc,
        thuonghieu: thuonghieu.trim() || undefined,
        model: model.trim() || undefined,
        mota: mota.trim() || undefined,
        hinhanh: imageUrl,
      };

      if (category === "smartphone") {
        if (variants.length === 0) {
          setError("Vui lòng thêm ít nhất 1 biến thể cho Smartphone.");
          return;
        }

        const phanLoais: PhanLoaiSanPhamCreate[] = variants.map((v) => ({
          tenphanloai: `${v.dungluong} / ${v.mausac} / ${v.xuatxu}`,
          sku: v.sku || undefined,
          mausac: v.mausac,
          dungluong: v.dungluong,
          xuatxu: v.xuatxu,
          gianhap: v.gianhap,
          giaban: v.giaban,
          tonkho: v.tonkho,
        }));

        await onSubmit({ sanPham, phanLoais, userId: creatorId });
        onClose();
        return;
      }

      if (!singleSku.trim()) {
        setError("Vui lòng nhập SKU.");
        return;
      }
      if (!loaiChiTiet.trim()) {
        setError("Vui lòng nhập Loại chi tiết.");
        return;
      }
      if (!nhaSanXuat.trim()) {
        setError("Vui lòng nhập Nhà sản xuất.");
        return;
      }
      if (category === "accessory" && !tuongThich.trim()) {
        setError("Vui lòng nhập Tương thích (chỉ áp dụng cho Phụ kiện).");
        return;
      }

      const phanLoais: PhanLoaiSanPhamCreate[] = [
        {
          tenphanloai: loaiChiTiet,
          sku: singleSku,
          loaiChiTiet,
          nhaCungCap: nhaSanXuat,
          tuongThich: category === "accessory" ? tuongThich.trim() : undefined,
          thongSoKyThuat: thongSoKyThuat.trim() || undefined,
          gianhap: singleGiaNhap,
          giaban: singleGiaBan,
        },
      ];

      await onSubmit({ sanPham, phanLoais, userId: creatorId });
      onClose();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Có lỗi khi thêm sản phẩm. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c252e] w-full max-w-3xl rounded-xl border border-[#283039] shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#283039]">
          <h2 className="text-white text-lg font-bold">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-[#9dabb9] hover:text-white transition-colors rounded-lg p-1 hover:bg-[#283039]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && <ErrorAlert message={error} className="mb-4 mt-0" />}
          <div className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Ảnh đại diện (hinhanh)
                </label>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-full md:w-44">
                    <div className="aspect-square w-full rounded-lg border border-[#283039] bg-[#111418] overflow-hidden flex items-center justify-center">
                      {imagePreviewUrl ? (
                        <img
                          src={imagePreviewUrl}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#9dabb9]">
                          <span className="material-symbols-outlined text-[28px]">
                            image
                          </span>
                          <span className="text-[11px] text-center px-2">
                            No image selected
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-[#9dabb9] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#283039] file:text-white hover:file:bg-[#323b46]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setImageFile(null)}
                          disabled={!imageFile}
                          className="px-3 py-2 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                        >
                          Remove
                        </button>
                        <p className="text-[11px] text-[#9dabb9]">
                          Nếu không chọn ảnh, hệ thống sẽ tạo ảnh ngẫu nhiên và upload lên Cloudinary.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Tên sản phẩm (tensanpham)
                </label>
                <input
                  value={tensanpham}
                  onChange={(e) => setTensanpham(e.target.value)}
                  className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="e.g. iPhone 15 Pro Max"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Danh mục (danhmuc)
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="smartphone">Smartphone (Multi-Variant)</option>
                    <option value="component">Component (Single Item)</option>
                    <option value="accessory">Accessory (Single Item)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Thương hiệu (thuonghieu)
                </label>
                <input
                  value={thuonghieu}
                  onChange={(e) => setThuonghieu(e.target.value)}
                  className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="VD: Apple, Asus, Logitech"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Model (model)
                </label>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="VD: A2894, ROG-STRIX"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Mô tả (mota)
                </label>
                <textarea
                  value={mota}
                  onChange={(e) => setMota(e.target.value)}
                  rows={4}
                  className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="Bài viết giới thiệu sản phẩm..."
                />
              </div>
            </div>

            <div className="h-px bg-[#283039]" />

            <div>
              <h3 className="text-white text-sm font-medium mb-4">{title}</h3>

              {category === "smartphone" && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#20272e] p-4 rounded-lg border border-[#283039]">
                     <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                       Thêm biến thể
                     </label>
                     <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                            Màu sắc (mausac)
                          </label>
                          <input
                            value={tempMauSac}
                            onChange={(e) => setTempMauSac(e.target.value)}
                            className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                            placeholder="VD: Titan Xanh"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                            Dung lượng (dungluong)
                          </label>
                          <select
                            value={tempDungLuong}
                            onChange={(e) => setTempDungLuong(e.target.value)}
                            className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                          >
                            <option value="128GB">128GB</option>
                            <option value="256GB">256GB</option>
                            <option value="512GB">512GB</option>
                            <option value="1TB">1TB</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                            Xuất xứ (xuatxu)
                          </label>
                          <input
                            value={tempXuatXu}
                            onChange={(e) => setTempXuatXu(e.target.value)}
                            className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                            placeholder="VD: VN/A"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                            SKU (sku)
                          </label>
                          <input
                            value={tempSku}
                            onChange={(e) => setTempSku(e.target.value)}
                            className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white font-mono"
                            placeholder="Để trống = tự sinh"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                            Giá nhập (gianhap)
                          </label>
                          <input
                            type="number"
                            value={tempGiaNhap}
                            onChange={(e) => setTempGiaNhap(Number(e.target.value))}
                            className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                            Giá bán (giaban)
                          </label>
                          <input
                            type="number"
                            value={tempGiaBan}
                            onChange={(e) => setTempGiaBan(Number(e.target.value))}
                            className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#9dabb9] uppercase tracking-wider mb-1">
                            Tồn đầu (tonkho)
                          </label>
                          <input
                            type="number"
                            value={tempTonKho}
                            onChange={(e) => setTempTonKho(Number(e.target.value))}
                            className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                            placeholder="0"
                          />
                        </div>
                     </div>
                     <button 
                        onClick={handleAddVariant}
                        className="mt-3 w-full py-2 bg-[#283039] hover:bg-[#323b46] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2"
                     >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Thêm biến thể
                     </button>
                  </div>

                  {variants.length > 0 && (
                    <div className="border border-[#283039] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm text-[#9dabb9]">
                            <thead className="bg-[#20272e] text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-2">Màu sắc</th>
                                    <th className="px-4 py-2">Dung lượng</th>
                                    <th className="px-4 py-2">Xuất xứ</th>
                                    <th className="px-4 py-2">SKU</th>
                                    <th className="px-4 py-2">Giá nhập</th>
                                    <th className="px-4 py-2">Giá bán</th>
                                    <th className="px-4 py-2">Tồn đầu</th>
                                    <th className="px-4 py-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#283039]">
                                {variants.map((v) => (
                                    <tr key={v.id}>
                                        <td className="px-4 py-2 text-white">{v.mausac}</td>
                                        <td className="px-4 py-2 text-white">{v.dungluong}</td>
                                        <td className="px-4 py-2 text-white">{v.xuatxu}</td>
                                        <td className="px-4 py-2 font-mono text-xs">{v.sku}</td>
                                        <td className="px-4 py-2">{v.gianhap}</td>
                                        <td className="px-4 py-2">{v.giaban}</td>
                                        <td className="px-4 py-2">{v.tonkho}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button 
                                                onClick={() => handleRemoveVariant(v.id)}
                                                className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  )}
                </div>
              )}

              {category === "component" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Loại chi tiết (loaiChiTiet)</label>
                    <input value={loaiChiTiet} onChange={(e) => setLoaiChiTiet(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="VD: GPU, RAM" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Nhà sản xuất (nhaCungCap)</label>
                    <input value={nhaSanXuat} onChange={(e) => setNhaSanXuat(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="VD: TSMC, Foxconn" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">SKU (sku)</label>
                    <input value={singleSku} onChange={(e) => setSingleSku(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none font-mono" placeholder="VD: CMP-GPU-4080" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Giá nhập (gianhap)</label>
                    <input type="number" value={singleGiaNhap} onChange={(e) => setSingleGiaNhap(Number(e.target.value))} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Giá bán (giaban)</label>
                    <input type="number" value={singleGiaBan} onChange={(e) => setSingleGiaBan(Number(e.target.value))} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Thông số kỹ thuật (thongSoKyThuat)</label>
                    <textarea value={thongSoKyThuat} onChange={(e) => setThongSoKyThuat(e.target.value)} rows={4} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="Ghi thông số kỹ thuật chi tiết..." />
                  </div>
                </div>
              )}

              {category === "accessory" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Loại chi tiết (loaiChiTiet)</label>
                    <input value={loaiChiTiet} onChange={(e) => setLoaiChiTiet(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="VD: Tai nghe, Sạc" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Nhà sản xuất (nhaCungCap)</label>
                    <input value={nhaSanXuat} onChange={(e) => setNhaSanXuat(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="VD: Foxconn" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">SKU (sku)</label>
                    <input value={singleSku} onChange={(e) => setSingleSku(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none font-mono" placeholder="Mã quản lý kho" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Giá nhập (gianhap)</label>
                    <input type="number" value={singleGiaNhap} onChange={(e) => setSingleGiaNhap(Number(e.target.value))} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Giá bán (giaban)</label>
                    <input type="number" value={singleGiaBan} onChange={(e) => setSingleGiaBan(Number(e.target.value))} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Tương thích (tuongThich)</label>
                    <input value={tuongThich} onChange={(e) => setTuongThich(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="VD: For iPhone 15" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Thông số kỹ thuật (thongSoKyThuat)</label>
                    <textarea value={thongSoKyThuat} onChange={(e) => setThongSoKyThuat(e.target.value)} rows={4} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="Ghi thông số kỹ thuật chi tiết..." />
                  </div>
                </div>
              )}
            </div>
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
            {isSubmitting ? "Uploading..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
