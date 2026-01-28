import { useEffect, useMemo, useState } from "react";

export type UserRole = "ADMIN" | "STAFF";

export type EditUserForm = {
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
};

type Props = {
  isOpen: boolean;
  title?: string;
  initialValue?: EditUserForm;
  onClose: () => void;
  onSave: (value: EditUserForm) => void;
};

const EMPTY: EditUserForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "STAFF",
  isActive: true,
};

export default function EditUserModal({
  isOpen,
  title = "Edit User Information",
  initialValue,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<EditUserForm>(EMPTY);

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialValue ?? EMPTY);
  }, [isOpen, initialValue]);

  const canSave = useMemo(() => {
    return form.fullName.trim().length > 0 && form.email.trim().length > 0;
  }, [form.fullName, form.email]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#283039] rounded-xl shadow-2xl border border-[#3e4a56] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#3e4a56] bg-[#1c2229]">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#9dabb9] hover:text-white transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#9dabb9] uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#9dabb9] text-[20px]">
                  person
                </span>
              </div>
              <input
                className="w-full bg-[#1c2229] border border-[#3e4a56] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-[#5f748d] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                type="text"
                value={form.fullName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fullName: e.target.value }))
                }
                placeholder="e.g. John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#9dabb9] uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#9dabb9] text-[20px]">
                  mail
                </span>
              </div>
              <input
                className="w-full bg-[#1c2229] border border-[#3e4a56] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-[#5f748d] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="e.g. john@company.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#9dabb9] uppercase tracking-wide">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#9dabb9] text-[20px]">
                  call
                </span>
              </div>
              <input
                className="w-full bg-[#1c2229] border border-[#3e4a56] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-[#5f748d] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                type="tel"
                value={form.phone ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="e.g. 0901234567"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#9dabb9] uppercase tracking-wide">
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#9dabb9] text-[20px]">
                  badge
                </span>
              </div>
              <select
                className="w-full bg-[#1c2229] border border-[#3e4a56] rounded-lg py-2.5 pl-10 pr-10 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none appearance-none transition-colors cursor-pointer"
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value as UserRole }))
                }
              >
                <option value="ADMIN">Administrator</option>
                <option value="STAFF">Staff Member</option>

              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#9dabb9]">
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                Account Status
              </span>
              <span className="text-xs text-[#9dabb9]">
                Enable or disable user access
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isActive: e.target.checked }))
                }
              />
              <div className="w-11 h-6 bg-[#3e4a56] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0bda5b]" />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#3e4a56] bg-[#1c2229] flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#9dabb9] hover:text-white bg-transparent hover:bg-[#3e4a56] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() => onSave(form)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
