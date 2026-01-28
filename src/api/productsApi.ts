import axiosClient from "./axiosClient";

const productsApi = {
  getAllProducts(params: GetAllProductsParams) {
    return axiosClient.get<ResponseProductsDto>("/products", { params });
  },
  createProduct(payload: CreateProductPayload) {
    return axiosClient.post<ResponseProductDto>("/products", payload);
  },
};

export default productsApi;