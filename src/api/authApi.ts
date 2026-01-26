import axiosClient from "./axiosClient";
import type { AxiosResponse } from "axios";

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
    if (import.meta.env.DEV) {
      return new Promise<AxiosResponse<LoginResponse>>((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              accessToken: "mock-access-token-123",
              user: {
                idnguoidung: 1,
                hoten: "Mock User",
                mail: data.mail,
                vaitro: "admin",
              },
            },
          } as AxiosResponse<LoginResponse>);
        }, 500);
      });
    }

    return axiosClient.post<LoginResponse>("/auth/login", data);
  },

  refreshToken() {
    return axiosClient.post("/auth/refresh-token");
  },
};

export default authApi;
