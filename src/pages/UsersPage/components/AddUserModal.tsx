import { useState } from "react";
import ErrorAlert from "../../../components/ErrorAlert";

export type UserRole = "ADMIN" | "STAFF";

export type AddUserPayload = {
  hoten: string;
  email: string;
  sdt: string;
  vaitro: UserRole;
  manhanvien?: string;
  matkhau: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddUserPayload) => Promise<void>;
};

export default function AddUserModal({ isOpen, onClose, onSubmit }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("STAFF");
  const [password, setPassword] = useState("Staff@123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        hoten: fullName,
        email: email,
        sdt: phone,
        vaitro: role,
        matkhau: password,
      });

      setFullName("");
      setEmail("");
      setPhone("");
      setRole("STAFF");
      setPassword("Staff@123");
      onClose();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Tạo user thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c252e] w-full max-w-2xl rounded-xl border border-[#283039] shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-[#283039]">
          <h2 className="text-white text-lg font-bold">Add New User</h2>
          <button onClick={onClose} className="text-[#9dabb9] hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && <ErrorAlert message={error} className="mb-4 mt-0" />}
          <div className="flex flex-col gap-6">
            
            <div>
              <h3 className="text-white text-sm font-medium mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">badge</span>
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                    placeholder="e.g. Nguyen Van A"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Role (Vai trò)
                  </label>
                  <div className="relative">
                  <select
                        value="STAFF"
                        disabled={true}
                        className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-[#9dabb9] cursor-not-allowed focus:outline-none appearance-none font-medium"
                    >
                        <option value="STAFF">Staff</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#283039]" />

            <div>
              <h3 className="text-white text-sm font-medium mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">lock</span>
                Login Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                    placeholder="staff@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Initial Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                    placeholder="Set initial password"
                  />
                  <p className="text-[10px] text-[#9dabb9] mt-1">Default: Staff@123</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                    placeholder="+84..."
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="p-6 border-t border-[#283039] flex justify-end gap-3 bg-[#1c252e] rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 disabled:hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-medium"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
