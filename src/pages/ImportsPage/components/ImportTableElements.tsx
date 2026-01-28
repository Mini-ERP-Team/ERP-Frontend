export const ImportStatusBadge = ({ status }: { status: string }) => {
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

export const ActionButton = ({
  status,
  onView,
  canConfirm,
  onConfirm,
}: {
  status: string;
  onView: () => void;
  canConfirm: boolean;
  onConfirm: () => void;
}) => {
  const isPending = status === "Pending Admin Confirmation";

  if (isPending) {
    if (canConfirm) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          className="bg-primary hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm"
        >
          Confirm Stock
        </button>
      );
    }
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onView();
      }}
      className="text-text-secondary hover:text-gray-900 dark:hover:text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors flex items-center justify-end gap-1 ml-auto"
    >
      View Details
      <span className="material-symbols-outlined text-[16px]">
        arrow_forward
      </span>
    </button>
  );
};

export const mapStatusLabel = (s: string): ImportRecord["status"] => {
  const v = (s ?? "").toUpperCase();
  if (v === "PENDING") return "Pending Admin Confirmation";
  if (v === "CONFIRMED") return "Confirmed";
  if (v === "COMPLETED") return "Confirmed";
  return v.includes("PENDING") ? "Pending Admin Confirmation" : "Confirmed";
};

