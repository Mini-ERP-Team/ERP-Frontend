interface ImportRecord {
  id: string;
  importId: string;
  supplierName: string;
  supplierLocation: string;
  date: string;
  time: string;
  totalItems: number;
  status: "Pending Admin Confirmation" | "Confirmed";
  typeIcon: "input" | "inventory";
}

const imports: ImportRecord[] = [
  {
    id: "1",
    importId: "#IMP-2023-089",
    supplierName: "TechGlobal Components",
    supplierLocation: "Shenzhen, CN",
    date: "Oct 24, 2023",
    time: "10:30 AM",
    totalItems: 450,
    status: "Pending Admin Confirmation",
    typeIcon: "input",
  },
  {
    id: "2",
    importId: "#IMP-2023-088",
    supplierName: "ScreenMasters Ltd.",
    supplierLocation: "Seoul, KR",
    date: "Oct 23, 2023",
    time: "04:15 PM",
    totalItems: 1200,
    status: "Pending Admin Confirmation",
    typeIcon: "input",
  },
  {
    id: "3",
    importId: "#IMP-2023-087",
    supplierName: "BatteryWorld Inc.",
    supplierLocation: "Domestic",
    date: "Oct 22, 2023",
    time: "09:00 AM",
    totalItems: 300,
    status: "Confirmed",
    typeIcon: "inventory",
  },
  {
    id: "4",
    importId: "#IMP-2023-086",
    supplierName: "Connectify Cables",
    supplierLocation: "Domestic",
    date: "Oct 20, 2023",
    time: "02:30 PM",
    totalItems: 2000,
    status: "Confirmed",
    typeIcon: "inventory",
  },
  {
    id: "5",
    importId: "#IMP-2023-085",
    supplierName: "AudioQuest",
    supplierLocation: "Munich, DE",
    date: "Oct 19, 2023",
    time: "11:00 AM",
    totalItems: 85,
    status: "Pending Admin Confirmation",
    typeIcon: "input",
  },
];

const ImportStatusBadge = ({ status }: { status: string }) => {
  const isPending = status === "Pending Admin Confirmation";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        isPending
          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
          : "bg-[#0bda5b]/10 text-[#0bda5b] border-[#0bda5b]/20"
      }`}
    >
      {isPending ? (
        <span className="size-1.5 rounded-full bg-orange-400 animate-pulse"></span>
      ) : (
        <span className="material-symbols-outlined text-[14px]">check</span>
      )}
      {status}
    </span>
  );
};

const ActionButton = ({ status }: { status: string }) => {
  const isPending = status === "Pending Admin Confirmation";

  if (isPending) {
    return (
      <button className="bg-primary hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm">
        Confirm Stock
      </button>
    );
  }

  return (
    <button className="text-text-secondary hover:text-gray-900 dark:hover:text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors flex items-center justify-end gap-1 ml-auto">
      View Details
      <span className="material-symbols-outlined text-[16px]">
        arrow_forward
      </span>
    </button>
  );
};

const ImportsPage = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <div className="bg-white dark:bg-input-bg px-4 py-2 rounded-lg border border-gray-200 dark:border-input-bg flex items-center gap-2 shadow-sm dark:shadow-none">
            <span className="text-text-secondary text-xs font-medium uppercase">
              Pending
            </span>
            <span className="text-orange-400 font-bold">3</span>
          </div>
          <div className="bg-white dark:bg-input-bg px-4 py-2 rounded-lg border border-gray-200 dark:border-input-bg flex items-center gap-2 shadow-sm dark:shadow-none">
            <span className="text-text-secondary text-xs font-medium uppercase">
              Total This Month
            </span>
            <span className="text-gray-900 dark:text-white font-bold">124</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-input-bg text-gray-700 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-input-bg hover:bg-gray-50 dark:hover:bg-[#3e4a56] transition-colors text-sm font-medium shadow-sm dark:shadow-none">
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            Filter
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Log New Stock In
          </button>
        </div>
      </div>

      <section className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-gray-100 dark:border-[#111418] flex justify-between items-center bg-gray-50/50 dark:bg-[#1c2229]/50">
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-bold">
              Import Log
            </h3>
            <p className="text-text-secondary text-sm mt-1">
              Manage incoming shipments and stock updates.
            </p>
          </div>
          <div className="flex gap-2">
            <select className="bg-white dark:bg-[#111418] text-gray-700 dark:text-text-secondary text-sm border border-gray-200 dark:border-[#283039] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary focus:outline-none">
              <option>All Statuses</option>
              <option>Pending Confirmation</option>
              <option>Confirmed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229] border-b border-gray-100 dark:border-[#111418]">
                <th className="p-4 pl-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Import ID
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Supplier
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Date Received
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Total Items
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 pr-6 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
              {imports.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md ${
                          record.typeIcon === "input"
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 dark:bg-[#283039] text-text-secondary group-hover:bg-gray-200 dark:group-hover:bg-[#3e4a56] transition-colors"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {record.typeIcon}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${record.typeIcon === "input" ? "text-gray-900 dark:text-white" : "text-text-secondary"}`}
                      >
                        {record.importId}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900 dark:text-white text-sm font-medium">
                      {record.supplierName}
                    </div>
                    <div className="text-text-secondary text-xs">
                      {record.supplierLocation}
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    {record.date}{" "}
                    <span className="text-xs opacity-60 ml-1">
                      {record.time}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900 dark:text-white text-sm font-bold text-right">
                    {record.totalItems.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <ImportStatusBadge status={record.status} />
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <ActionButton status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-[#111418] flex items-center justify-between bg-gray-50/30 dark:bg-[#1c2229]/30">
          <span className="text-text-secondary text-xs">
            Showing{" "}
            <span className="text-gray-900 dark:text-white font-medium">
              1-5
            </span>{" "}
            of{" "}
            <span className="text-gray-900 dark:text-white font-medium">
              24
            </span>{" "}
            imports
          </span>
          <div className="flex gap-2">
            <button
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#3e4a56] text-text-secondary hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors"
              disabled
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#3e4a56] text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ImportsPage;
