import axiosClient from "./axiosClient";

const suppliersApi = {
  createSupplier(payload: CreateSupplierPayload) {
    return axiosClient.post<ResponseSupplierDto>("/suppliers", payload);
  },

  getSuppliers(params: GetSuppliersParams) {
    return axiosClient.get<ResponseSuppliersDto>("/suppliers", { params });
  },
};

export default suppliersApi;

