interface ChiTietPhieuNhapCreate {
  idphanloai: number;
  soluong: number;
  gianhap: number;
}

interface CreateImportPayload {
  idnguoidung: number;
  idnhacungcap: number;
  ghiChu?: string;
  maphieu?: string;
  chiTiet: ChiTietPhieuNhapCreate[];
}

interface ImportMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ImportDto {
  idphieunhap: number;
  maphieu?: string | null;
  trangthai: string;
  ngaytao: string;
  ngaycapnhat: string;
  ngayNhapKho?: string | null;
  ghiChu?: string | null;
  tongtien: number;
  idnguoidung: number;
  idnhacungcap: number;
  nhaCungCap?: {
    tennhacungcap: string;
    sdt?: string | null;
    diachi?: string | null;
  };
  chiTiet?: Array<{
    idphanloai: number;
    soluong: number;
    gianhap: number;
    thanhtien: number;
    phanLoai?: {
      sku?: string | null;
      tenphanloai: string;
      mausac?: string | null;
      dungluong?: string | null;
      xuatxu?: string | null;
      sanPham?: {
        tensanpham: string;
      };
    };
  }>;
}

interface ResponseImportDto {
  message: string;
  data: ImportDto;
}

interface ImportDetailItemDto {
  id: number;
  sku?: string | null;
  productName: string;
  variantName: string;
  category?: string | null;
  brand?: string | null;
  image?: string | null;
  quantity: number;
  importPrice: number;
  total: number;
}

interface ImportDetailDto {
  id: number;
  code?: string | null;
  status: string;
  note?: string | null;
  createdAt: string;
  importedAt?: string | null;
  totalAmount: number;
  supplier: {
    id: number;
    name: string;
    code?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  };
  createdBy?: {
    name: string;
    code?: string | null;
  };
  items: ImportDetailItemDto[];
}

interface ResponseImportDetailDto {
  message: string;
  data: ImportDetailDto;
}

interface ImportListItemDto {
  id: number;
  importId?: string | null;
  supplier: {
    name: string;
    address: string;
    code?: string | null;
  };
  dateReceived: string;
  totalItems: number;
  totalAmount: number;
  status: string;
  note?: string | null;
}

interface ResponseImportsDto {
  message: string;
  meta: ImportMeta;
  data: ImportListItemDto[];
}

interface ImportRecord {
  id: string;
  importId: string;
  supplierName: string;
  supplierLocation: string;
  supplierCode?: string;
  date: string;
  time: string;
  totalItems: number;
  totalAmount: number;
  note?: string;
  status: "Pending Admin Confirmation" | "Confirmed";
  typeIcon: "input" | "inventory";
};