import axiosClient from "./axiosClient";

const productsApi = {
  getAllProducts(params: GetAllProductsParams) {
    return axiosClient.get<ResponseProductsDto>("/products", { params });
  },
  createProduct(payload: CreateProductPayload) {
    return axiosClient.post<ResponseProductDto>("/products", payload);
  },
  updateProduct(
    id: number,
    payload: Partial<{
      tensanpham: string;
      danhmuc: string;
      thuonghieu: string;
      model: string;
      mota: string;
      hinhanh: string;
    }>,
  ) {
    return axiosClient.patch<ResponseProductDto>(`/products/${id}`, payload);
  },
};

export default productsApi;