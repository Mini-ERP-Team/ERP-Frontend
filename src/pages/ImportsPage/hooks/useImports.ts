import { useEffect, useRef, useState } from "react";
import importsApi from "../../../api/importsApi";
import { mapStatusLabel } from "../components/ImportTableElements";

export const useImports = () => {
  const [importList, setImportList] = useState<ImportRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const didInit = useRef(false);

  const mapToRow = (dto: ImportListItemDto): ImportRecord => {
    const dt = new Date(dto.dateReceived);
    const date = dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const time = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const label = mapStatusLabel(dto.status);
    return {
      id: String(dto.id),
      importId: dto.importId ? `#${dto.importId}` : `#PN-${dto.id}`,
      supplierName: dto.supplier?.name ?? "-",
      supplierLocation: dto.supplier?.address ?? "-",
      supplierCode: dto.supplier?.code ?? undefined,
      date,
      time,
      totalItems: dto.totalItems ?? 0,
      totalAmount: dto.totalAmount ?? 0,
      note: dto.note ?? undefined,
      status: label,
      typeIcon: label === "Pending Admin Confirmation" ? "input" : "inventory",
    };
  };

  const fetchImports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await importsApi.getImports({
        page,
        limit,
        search: search.trim() || undefined,
        status: status || undefined,
      });
      const list = res.data?.data ?? [];
      setImportList(list.map(mapToRow));
      setTotal(res.data?.meta?.total ?? 0);
      setTotalPages(res.data?.meta?.totalPages ?? 1);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Không thể tải danh sách phiếu nhập.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async (id: string) => {
    try {
      setError(null);
      await importsApi.confirmImport(id);
      await fetchImports();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Confirm stock failed. Please try again.",
      );
    }
  };

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      fetchImports();
      return;
    }

    const t = window.setTimeout(() => {
      fetchImports();
    }, 350);

    return () => window.clearTimeout(t);
  }, [page, search, status]);

  return {
    importList,
    setImportList,
    loading,
    error,
    setError,
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
  };
};

