import { useState } from "react";

export type UserRole = "ADMIN" | "STAFF";

export type AddUserPayload = {
  hoten: string;
  email: string;
  sdt: string;
  vaitro: UserRole;
  manhanvien: string;
  matkhau: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddUserPayload) => void;
};

export default function AddUserModal({ isOpen, onClose, onSubmit }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("STAFF");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("Staff@123");

  const handleSubmit = () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    onSubmit({
      hoten: fullName,
      email: email,
      sdt: phone,
      vaitro: role,
      manhanvien: userId,
      matkhau: password,
    });
    
    setFullName("");
    setEmail("");
    setPhone("");   
    setRole("STAFF");
    onClose();
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

                <div>
                   <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    User ID
                  </label>
                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="Auto-generated if empty"
                  />
                </div>

                <div>
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
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white transition-colors text-sm font-medium">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-medium">Create Account</button>
        </div>
      </div>
    </div>
  );
}
