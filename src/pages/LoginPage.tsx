import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useAuthStore } from "../store/useAuthStore";
import type { AxiosError } from "axios";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    mail: "",
    matkhau: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.login({
        mail: formData.mail,
        matkhau: formData.matkhau,
      });

      console.log("Login Success:", response.data);

      setAuth(response.data.user, response.data.accessToken);
      try {
        localStorage.removeItem("auth:loggedOut");
      } catch {
      }

      console.log("Đã lưu Token vào RAM (Zustand)");
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const mess =
        axiosError.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      setError(mess);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[380px] mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-white tracking-tight text-3xl font-bold leading-tight pb-2">
            Welcome Back!
          </h1>
          <p className="text-[#9dabb9] text-base font-normal">
            Please log in to your account.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {error}
            </div>
          )}

          <InputField
            label="Email Address"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            placeholder="admin@techstore.com"
            type="email"
            icon="person"
            required
          />

          <InputField
            label="Password"
            name="matkhau"
            value={formData.matkhau}
            onChange={handleChange}
            placeholder="••••••••"
            type="password"
            icon="lock"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
