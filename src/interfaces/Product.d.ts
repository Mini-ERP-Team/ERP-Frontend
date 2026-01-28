interface SanPhamCreate {
  idnguoidung?: number;
  tensanpham: string;
  danhmuc: string;
  thuonghieu?: string;
  model?: string;
  mota?: string;
  hinhanh?: string;
}

type ProductCategory = "Smartphone" | "Component" | "Accessory";

interface PhanLoaiSanPhamCreate {
  tenphanloai: string;
  sku?: string;
  mausac?: string;
  dungluong?: string;
  xuatxu?: string;

  loaiChiTiet?: string;
  nhaCungCap?: string;
  tuongThich?: string;
  thongSoKyThuat?: string;

  gianhap?: number;
  giaban?: number;
  tonkho?: number;
}

interface CreateProductPayload {
  sanPham: SanPhamCreate;
  phanLoais: PhanLoaiSanPhamCreate[];
  userId?: number;
}

interface ProductsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ResponseProductsDto {
  message: string;
  meta: ProductsMeta;
  data: ProductListItemDto[];
}

interface ProductDto {
  danhmuc: string;
  hinhanh: string;
  idnguoidung: number;
  idsanpham: number;
  model: string;
  mota?: string;
  tensanpham: string;
  thuonghieu?: string;
  phanLoais: Array<{
    dungluong: string;
    giaban: number;
    gianhap: number;
    hinhanh: string;
    idphanloai: number;
    idsanpham: number;
    loaiChiTiet: string;
    mausac: string;
    ngaycapnhat: string;
    sku: string;
    tenphanloai: string;
    thongSoKyThuat?: string;
    tonkho: number;
    tuongThich?: string;
    xuatxu: string;
  }>;
};

interface ProductVariantDto {
  idphanloai: number;
  tenphanloai: string;
  giaban: number;
  gianhap?: number;
  tonkho: number;
  hinhanh?: string | null;
  sku?: string | null;
  mausac?: string | null;
  dungluong?: string | null;
  xuatxu?: string | null;
}

interface ProductListItemDto {
  id: number;
  name: string;
  category: string | null;
  brand?: string | null;
  model?: string | null;
  image?: string | null;
  price: {
    min: number;
    max: number;
    display: string;
  };
  stock: number;
  variantCount: number;
  variants: ProductVariantDto[];
}

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  stockPercent: number;
  status: StockStatus;
};

interface Product {
  id: number;
  name: string;
  sku?: string;
  category: string;
  brand?: string;
  model?: string;
  price: string;
  stock: number;
  stockPercent: number;
  status: StockStatus;
  image?: string;
  icon?: string;
  variants?: Variant[];
  apiVariants?: ProductListItemDto["variants"];
  variantCountText?: string;
};

interface ResponseProductDto {
  message: string;
  data: ProductDto;
}

interface GetAllProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
}

type Category = "smartphone" | "component" | "accessory";

type ProductCategoryLabel = "Smartphone" | "Component" | "Accessory";

type VariantRow = {
  id: string;
  sku: string;
  mausac: string;
  dungluong: string;
  xuatxu: string;
  gianhap: number;
  giaban: number;
  tonkho: number;
};


type AddProductPayload =
  | {
      sanPham: SanPhamCreate;
      phanLoais: PhanLoaiSanPhamCreate[];
      userId: number;
    };

interface ProductDetail {
  id: number;
  name: string;
  sku?: string;
  category: string;
  brand?: string;
  model?: string;
  price: string;
  stock: number;
  stockPercent: number;
  status: StockStatus;
  image?: string;
  icon?: string;
  apiVariants?: Array<{
    idphanloai: number;
    tenphanloai: string;
    giaban: number;
    gianhap?: number;
    tonkho: number;
    sku?: string | null;
    mausac?: string | null;
    dungluong?: string | null;
    xuatxu?: string | null;
  }>;
};