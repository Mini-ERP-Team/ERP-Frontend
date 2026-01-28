import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AddImportModal from "./components/AddImportModal";
import ImportDetailModal from "./components/ImportDetailModal";
import ErrorAlert from "../../components/ErrorAlert";
import { useAuthStore } from "../../store/useAuthStore";
import { ActionButton, ImportStatusBadge } from "./components/ImportTableElements";
import { useImports } from "./hooks/useImports";

const ImportsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userRole = useAuthStore((s) => s.user?.vaitro ?? "");
  const isAdmin = userRole.toUpperCase() === "ADMIN";
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState<ImportRecord | null>(null);
  const {
    importList,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    search,
    status,
    setPage,
    setSearch,
    setStatus,
    fetchImports,
    handleConfirmImport,
  } = useImports();

  const urlQ = searchParams.get("q") ?? "";
  useEffect(() => {
    if ((urlQ ?? "") !== (search ?? "")) {
      setSearch(urlQ);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ]);

  const pendingCount = useMemo(() => {
    return importList.filter((x) => x.status === "Pending Admin Confirmation").length;
  }, [importList]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <div className="bg-white dark:bg-input-bg px-4 py-2 rounded-lg border border-gray-200 dark:border-input-bg flex items-center gap-2 shadow-sm dark:shadow-none">
            <span className="text-text-secondary text-xs font-medium uppercase">
              Pending
            </span>
            <span className="text-orange-400 font-bold">{pendingCount}</span>
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
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-blue-500/20"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Log New Stock In
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

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
            <input
              value={search}
              onChange={(e) => {
                const v = e.target.value;
                setSearch(v);
                setPage(1);
                const next = new URLSearchParams(searchParams);
                if (v.trim()) next.set("q", v);
                else next.delete("q");
                setSearchParams(next, { replace: true });
              }}
              className="bg-white dark:bg-[#111418] text-gray-700 dark:text-white text-sm border border-gray-200 dark:border-[#283039] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Search (maphieu / supplier)..."
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="bg-white dark:bg-[#111418] text-gray-700 dark:text-text-secondary text-sm border border-gray-200 dark:border-[#283039] rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
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
              {loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    Loading imports...
                  </td>
                </tr>
              )}

              {!loading && importList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No imports found.
                  </td>
                </tr>
              )}

              {!loading && importList.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group"
                  onClick={() => setSelectedImport(record)}
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
                    <ActionButton
                      status={record.status}
                      onView={() => setSelectedImport(record)}
                      canConfirm={isAdmin}
                      onConfirm={() => handleConfirmImport(record.id)}
                    />
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
              {importList.length === 0 ? 0 : (page - 1) * limit + 1}-
              {(page - 1) * limit + importList.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-900 dark:text-white font-medium">
              {total}
            </span>{" "}
            imports (Page {page}/{totalPages})
          </span>
          <div className="flex gap-2">
            <button
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#3e4a56] text-text-secondary hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#3e4a56] text-text-secondary hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <AddImportModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreated={(created) => {
          if (!created) return;
          fetchImports();
        }}
      />

      <ImportDetailModal
        open={!!selectedImport}
        id={selectedImport?.id ?? null}
        onClose={() => setSelectedImport(null)}
      />
    </>
  );
};

export default ImportsPage;
