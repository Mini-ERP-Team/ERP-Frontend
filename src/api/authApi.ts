import axiosClient from "./axiosClient";

export interface LoginPayload {
  mail: string;
  matkhau: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    idnguoidung: number;
    hoten: string;
    mail: string;
    vaitro: string;
  };
}

const authApi = {
  login(data: LoginPayload) {
    return axiosClient.post<LoginResponse>("/auth/login", data);
  },

  refreshToken() {
    const url = "/auth/refresh-token";
    return axiosClient.post(url);
  },

  logout() {
    return axiosClient.post("/auth/logout");
  },
};

export default authApi;
