const stats: SupplierStat[] = [
  {
    label: "Total Suppliers",
    value: "142",
    icon: "domain",
    colorClass: "text-primary bg-primary/10",
  },
  {
    label: "Active Partners",
    value: "128",
    icon: "check_circle",
    colorClass: "text-green-500 bg-green-500/10",
  },
  {
    label: "Pending Review",
    value: "8",
    icon: "pending",
    colorClass: "text-orange-500 bg-orange-500/10",
  },
  {
    label: "Inactive",
    value: "6",
    icon: "block",
    colorClass: "text-red-500 bg-red-500/10",
  },
];

const suppliers: Supplier[] = [
  {
    id: "1",
    name: "TechGlobal Components",
    supId: "SUP-001",
    contactName: "Sarah Connor",
    contactRole: "Sales Manager",
    category: "Components",
    phone: "+1 (555) 012-3456",
    status: "Active",
    initials: "TG",
    colorClass: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  },
  {
    id: "2",
    name: "Qualcomm Inc.",
    supId: "SUP-042",
    contactName: "Mike Ross",
    contactRole: "Account Executive",
    category: "Processors",
    phone: "+1 (858) 587-1121",
    status: "Active",
    initials: "Q",
    colorClass: "text-purple-400 bg-purple-500/20 border-purple-500/30",
  },
  {
    id: "3",
    name: "ScreenMasters Ltd",
    supId: "SUP-088",
    contactName: "Jessica Pearson",
    contactRole: "Director of Supply",
    category: "Displays",
    phone: "+44 20 7946 0958",
    status: "Pending",
    initials: "SM",
    colorClass: "text-orange-400 bg-orange-500/20 border-orange-500/30",
  },
  {
    id: "4",
    name: "DeviceDistro",
    supId: "SUP-102",
    contactName: "Harvey Specter",
    contactRole: "Senior Partner",
    category: "Finished Devices",
    phone: "+1 (555) 456-8901",
    status: "Active",
    initials: "DD",
    colorClass: "text-teal-400 bg-teal-500/20 border-teal-500/30",
  },
  {
    id: "5",
    name: "BatteryWorld",
    supId: "SUP-015",
    contactName: "Louis Litt",
    contactRole: "Logistics Lead",
    category: "Batteries",
    phone: "+1 (555) 321-0678",
    status: "Inactive",
    initials: "BW",
    colorClass: "text-red-400 bg-red-500/20 border-red-500/30",
  },
  {
    id: "6",
    name: "Murata Mfg",
    supId: "SUP-213",
    contactName: "Kenji Tanaka",
    contactRole: "Regional Manager",
    category: "Passives",
    phone: "+81 75-951-9111",
    status: "Active",
    initials: "MM",
    colorClass: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
  },
  {
    id: "7",
    name: "Corning Inc.",
    supId: "SUP-119",
    contactName: "Emily Blunt",
    contactRole: "Sales Rep",
    category: "Glass",
    phone: "+1 607-974-9000",
    status: "Active",
    initials: "CI",
    colorClass: "text-pink-400 bg-pink-500/20 border-pink-500/30",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-[#0bda5b]/10 text-[#0bda5b] border-[#0bda5b]/20";
  if (status === "Pending")
    styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (status === "Inactive")
    styles = "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      {status}
    </span>
  );
};

const SupplierAvatar = ({
  initials,
  colorClass,
}: {
  initials: string;
  colorClass: string;
}) => (
  <div
    className={`size-10 rounded-full flex items-center justify-center font-bold text-sm border ${colorClass}`}
  >
    {initials}
  </div>
);

const SuppliersPage = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Suppliers List
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage your component and device vendor relationships.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 w-full sm:w-auto justify-center">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-medium text-sm">Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none"
          >
            <div className={`p-2 rounded-lg ${stat.colorClass}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-medium uppercase">
                {stat.label}
              </p>
              <p className="text-gray-900 dark:text-white text-xl font-bold">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        <div className="p-4 border-b border-gray-100 dark:border-[#111418] flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["All", "Components", "Devices", "Accessories"].map((tab, idx) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  idx === 0
                    ? "bg-gray-100 dark:bg-[#1c2229] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e4a56]"
                    : "text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#323b46]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="text-text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="text-text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229]">
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[300px]">
                  Company Name
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Phone
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <SupplierAvatar
                        initials={supplier.initials}
                        colorClass={supplier.colorClass}
                      />
                      <div>
                        <span className="text-gray-900 dark:text-white text-sm font-medium block">
                          {supplier.name}
                        </span>
                        <span className="text-text-secondary text-xs">
                          ID: {supplier.supId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white text-sm">
                        {supplier.contactName}
                      </span>
                    </div>
                    <span className="text-text-secondary text-xs">
                      {supplier.contactRole}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-[#111418] border border-gray-200 dark:border-[#3e4a56] text-xs">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary text-sm font-mono">
                    {supplier.phone}
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge status={supplier.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-text-secondary hover:text-primary p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#3e4a56] transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-[#111418] bg-white dark:bg-input-bg flex justify-between items-center text-sm">
          <div className="text-text-secondary">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">1</span>{" "}
            to{" "}
            <span className="font-medium text-gray-900 dark:text-white">7</span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              142
            </span>{" "}
            suppliers
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#3e4a56] bg-white dark:bg-[#1c2229] text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#323b46] disabled:opacity-50 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>{" "}
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#3e4a56] bg-white dark:bg-[#1c2229] text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors flex items-center gap-1">
              Next{" "}
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuppliersPage;
