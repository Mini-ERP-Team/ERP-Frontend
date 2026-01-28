import axiosClient from "./axiosClient";

const importsApi = {
  createImport(payload: CreateImportPayload) {
    return axiosClient.post<ResponseImportDto>("/imports", payload);
  },

  getImports(params: { page?: number; limit?: number; search?: string; status?: string }) {
    return axiosClient.get<ResponseImportsDto>("/imports", { params });
  },

  confirmImport(id: string | number) {
    return axiosClient.patch<ResponseImportDto>(`/imports/${id}/confirm`);
  },

  getImportDetail(id: string | number) {
    return axiosClient.get<ResponseImportDetailDto>(`/imports/${id}`);
  },
};

export default importsApi;

