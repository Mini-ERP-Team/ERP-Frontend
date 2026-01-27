import { useEffect } from "react";

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userId?: string;
  role: string;
  status: string;
  lastLogin: string;
  avatar?: string;
  initials?: string;
  colorClass?: string;
};

type Props = {
  isOpen: boolean;
  user: UserDetail | null;
  onClose: () => void;
  onEdit?: (user: UserDetail) => void;
  onDelete?: (user: UserDetail) => void;
};

export default function UserDetailModal({
  isOpen,
  user,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1c252e] w-full max-w-2xl rounded-xl shadow-2xl border border-[#283039] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#283039] bg-[#1c252e]">
          <h3 className="text-xl font-bold text-white">User Profile</h3>
          <button
            className="text-[#9dabb9] hover:text-white transition-colors rounded-lg p-1 hover:bg-[#283039]"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-8">
            
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="aspect-square rounded-xl bg-[#111418] border border-[#283039] flex items-center justify-center overflow-hidden relative shadow-inner">
                {user.avatar ? (
                  <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url("${user.avatar}")` }}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-5xl font-bold ${user.colorClass || 'bg-gray-700 text-gray-300'}`}>
                    {user.initials}
                  </div>
                )}
              </div>
              
              <div className="p-3 rounded-lg bg-[#111418] border border-[#283039] text-center">
                 <span className="text-[#9dabb9] text-xs uppercase tracking-wider font-semibold block mb-1">
                    User ID
                 </span>
                 <span className="text-white font-mono text-sm">
                    {user.userId || "N/A"}
                 </span>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-6">
              
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {user.name}
                  </h2>
                  <StatusBadge status={user.status} />
                </div>
                
                <div className="text-xl text-primary font-medium mb-1">
                    {user.role}
                </div>
                <p className="text-[#9dabb9] text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Last login: {user.lastLogin}
                </p>
              </div>

              <div className="h-px bg-[#283039]" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 text-sm">
                <InfoItem label="Email Address" value={user.email} />
                <InfoItem label="Phone Number" value={user.phone || "Not provided"} />
                <InfoItem label="Role Permission" value={user.role === "Admin" ? "Full Access" : "Limited Access"} />
                <InfoItem label="Account Created" value="Oct 24, 2025" /> {/* Mock data */}
              </div>

              <div className="mt-2">
                <span className="text-[#9dabb9] text-xs uppercase tracking-wider font-semibold block mb-2">
                  Notes
                </span>
                <p className="text-[#9dabb9] text-sm leading-relaxed bg-[#111418] p-3 rounded-lg border border-[#283039]">
                  User account created via administrative portal. No violations or warnings recorded.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#283039] bg-[#1c252e] flex flex-col sm:flex-row gap-3 justify-end">
          <button
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors font-medium flex items-center justify-center gap-2"
            onClick={() => onDelete?.(user)}
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Delete User
          </button>

          <button
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            onClick={() => onEdit?.(user)}
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[#9dabb9] text-xs uppercase tracking-wider font-semibold">
        {label}
      </span>
      <span className="text-white font-medium break-all">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
    const isActive = status === "Active";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          isActive
            ? "bg-[#0bda5b]/10 text-[#0bda5b] border-[#0bda5b]/20"
            : "bg-[#fa6238]/10 text-[#fa6238] border-[#fa6238]/20"
        }`}
      >
        {status}
      </span>
    );
}
