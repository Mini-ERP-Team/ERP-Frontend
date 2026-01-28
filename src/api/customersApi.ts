import axiosClient from "./axiosClient";

export type CustomerDto = {
  idkhachhang: number;
  tenkhachhang: string;
  sdt?: string | null;
  ngaytao?: string;
  diemtichluy?: number;
};

export type GetCustomersParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateCustomerPayload = {
  tenkhachhang: string;
  sdt?: string | null;
};

type ResponseCustomersDto =
  | {
      message?: string;
      data: CustomerDto[];
      meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    }
  | CustomerDto[];

type ResponseCustomerDto =
  | { message?: string; data: CustomerDto }
  | CustomerDto;

const customersApi = {
  getCustomers(params: GetCustomersParams) {
    return axiosClient.get<ResponseCustomersDto>("/customers", { params });
  },

  createCustomer(payload: CreateCustomerPayload) {
    return axiosClient.post<ResponseCustomerDto>("/customers", payload);
  },
};

export default customersApi;

