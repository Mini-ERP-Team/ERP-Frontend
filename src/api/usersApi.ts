import axiosClient from "./axiosClient";

export type UserRole = "ADMIN" | "STAFF";

export type CreateUserPayload = {
  hoten: string;
  mail: string;
  matkhau: string;
  vaitro: UserRole;
  sdt?: string;
  manhanvien?: string;
  anhdaidien?: string;
  trangthai?: boolean;
};

export type UserDto = {
    idnguoidung: number;
    manhanvien?: string | null;
    hoten: string;
    anhdaidien?: string | null;
    matkhau?: string;
    vaitro: string;
    mail: string;
    sdt?: string | null;
    trangthai: boolean;
    ngaytaotk?: string;
    ngaycapnhat?: string;
    lancuoidangnhap?: string | null;
};

export type ResponseUserDto = {
  message: string;
  data: UserDto;
};

export type ResponseUsersDto = {
  message: string;
  data: UserDto[];
};

const usersApi = {
  createUser(payload: CreateUserPayload) {
    return axiosClient.post<ResponseUserDto>("/users", payload);
  },
  getAllUsers() {
    return axiosClient.get<ResponseUsersDto>("/users");
  },
};

export default usersApi;

