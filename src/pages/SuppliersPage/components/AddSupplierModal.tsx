import { useState } from "react";
import ErrorAlert from "../../../components/ErrorAlert";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddSupplierPayload) => Promise<void>;
};

export default function AddSupplierModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [taxId, setTaxId] = useState("");
  const [category, setCategory] = useState("");

  const [contactName, setContactName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Company Name is required!");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        tennhacungcap: name,
        manhacungcap: code || undefined,
        masothue: taxId || undefined,
        loaiHang: category || undefined,
        nguoiLienHe: contactName || undefined,
        chucVu: jobTitle || undefined,
        sdt: phone || undefined,
        email: email || undefined,
        diachi: address || undefined,
      });

      setName("");
      setCode("");
      setTaxId("");
      setCategory("");
      setContactName("");
      setJobTitle("");
      setPhone("");
      setEmail("");
      setAddress("");

      onClose();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Create supplier failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c252e] w-full max-w-2xl rounded-xl border border-[#283039] shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-[#283039]">
          <h2 className="text-white text-lg font-bold">Add New Supplier</h2>
          <button
            onClick={onClose}
            className="text-[#9dabb9] hover:text-white transition-colors rounded-lg p-1 hover:bg-[#283039]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && <ErrorAlert message={error} className="mb-4 mt-0" />}
          <div className="flex flex-col gap-6">
            
            <div>
              <h3 className="text-white text-sm font-medium mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">domain</span>
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="e.g. TechGlobal Components"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Supplier ID (Optional)
                  </label>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="e.g. SUP-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Tax ID
                  </label>
                  <input
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="e.g. 0312345678"
                  />
                </div>

                <div className="md:col-span-2">
                   <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="e.g. Components, Processors, Cables..."
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-[#283039]" />

            <div>
              <h3 className="text-white text-sm font-medium mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">person</span>
                Contact Person
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="e.g. Sarah Connor"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Job Title
                  </label>
                  <input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="e.g. Sales Manager"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-[#283039]" />

            <div>
              <h3 className="text-white text-sm font-medium mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">call</span>
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="+84..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50"
                    placeholder="contact@company.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none placeholder:text-[#9dabb9]/50 resize-none"
                    placeholder="e.g. 123 Tech Street, Silicon Valley"
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
            className="px-5 py-2.5 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 disabled:hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-medium"
          >
            {isSubmitting ? "Creating..." : "Create Supplier"}
          </button>
        </div>

      </div>
    </div>
  );
}
