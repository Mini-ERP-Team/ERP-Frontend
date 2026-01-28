interface CreateSupplierPayload {
  manhacungcap?: string;
  tennhacungcap: string;

  nguoiLienHe?: string;
  chucVu?: string;
  loaiHang?: string;

  email?: string;
  sdt?: string;
  diachi?: string;

  masothue?: string;
  trangthai?: boolean;
}

interface SupplierDto {
  idnhacungcap: number;
  manhacungcap?: string | null;
  tennhacungcap: string;

  nguoiLienHe?: string | null;
  chucVu?: string | null;
  loaiHang?: string | null;

  email?: string | null;
  sdt?: string | null;
  diachi?: string | null;

  masothue?: string | null;
  trangthai: boolean;
}

interface ResponseSupplierDto {
  message: string;
  data: SupplierDto;
}

interface ResponseSuppliersDto {
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: SupplierDto[];
}

interface GetSuppliersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "all";
}


interface AddSupplierPayload {
  manhacungcap?: string;
  tennhacungcap: string;
  masothue?: string;
  loaiHang?: string;
  nguoiLienHe?: string;
  chucVu?: string;
  sdt?: string;
  email?: string;
  diachi?: string;
}

interface SupplierStat {
  label: string;
  value: string;
  icon: string;
  colorClass: string;
};

interface Supplier {
  id: string;
  name: string;
  supId: string;
  contactName: string;
  contactRole: string;
  category: string;
  phone: string;
  status: string;
  initials: string;
  colorClass: string;

  email?: string;
  address?: string;
  taxId?: string;
  joinedDate?: string;
}