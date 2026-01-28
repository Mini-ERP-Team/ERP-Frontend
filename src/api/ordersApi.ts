import axiosClient from "./axiosClient";

export type PaymentMethod = "TIEN_MAT" | "CHUYEN_KHOAN";

export type OrderLineCreate = {
  idphanloai: number;
  soluong: number;
  giaban: number;
};

export type CreateOrderPayload = {
  idnguoidung: number;
  idkhachhang: number;
  phuongthucTT: PaymentMethod;
  tongtien: number;
  chiTiet: OrderLineCreate[];
};

export type OrderDto = {
  iddonban: number;
  madonhang?: string | null;
  tongtien: number;
  idkhachhang: number;
  idnguoidung: number;
  phuongthucTT?: string | null;
  trangthai?: string;
  ngaytao?: string;
};

export type OrderListItemDto = {
  iddonban: number;
  madonhang?: string | null;
  trangthai?: string | null;
  phuongthucTT?: string | null;
  ngaytao?: string | null;
  tongtien: number;
  khachHang?: {
    idkhachhang: number;
    tenkhachhang: string;
    sdt?: string | null;
  } | null;
};

export type OrderDetailItemDto = {
  idphanloai: number;
  soluong: number;
  giaban: number;
  thanhtien: number;
  phanLoai?: {
    idphanloai: number;
    sku?: string | null;
    tenphanloai: string;
    sanPham?: {
      idsanpham: number;
      tensanpham: string;
      danhmuc?: string | null;
      thuonghieu?: string | null;
    } | null;
  } | null;
};

export type OrderDetailDto = {
  iddonban: number;
  madonhang?: string | null;
  trangthai?: string | null;
  phuongthucTT?: string | null;
  trangthaiTT?: string | null;
  ngaytao?: string | null;
  ngayxacnhan?: string | null;
  tongtien: number;
  idkhachhang: number;
  idnguoidung: number;
  khachHang?: {
    idkhachhang: number;
    tenkhachhang: string;
    sdt?: string | null;
    diemtichluy?: number;
  } | null;
  chiTiet?: OrderDetailItemDto[];
};

export type GetOrdersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

type ResponseOrderDto = { message?: string; data: OrderDto } | OrderDto;
type ResponseOrdersDto =
  | {
      message?: string;
      data: OrderListItemDto[];
      meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    }
  | OrderListItemDto[];

type ResponseOrderDetailDto =
  | { message?: string; data: OrderDetailDto }
  | OrderDetailDto;

const ordersApi = {
  createOrder(payload: CreateOrderPayload) {
    return axiosClient.post<ResponseOrderDto>("/orders", payload);
  },

  getOrders(params: GetOrdersParams) {
    return axiosClient.get<ResponseOrdersDto>("/orders", { params });
  },

  getOrderDetail(id: number) {
    return axiosClient.get<ResponseOrderDetailDto>(`/orders/${id}`);
  },
};

export default ordersApi;

