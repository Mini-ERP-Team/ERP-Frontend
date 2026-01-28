import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import productsApi from "../api/productsApi.ts";
import ErrorAlert from "../components/ErrorAlert";

type LowStockRow = {
  key: string;
  name: string;
  sku: string;
  qty: number;
  icon: string;
  level: "Critical" | "Low";
};

const StatCard = ({
  title,
  value,
  icon,
  iconBg,
  trend,
  trendValue,
  isUp,
}: StatCardProps) => (
  <div className="bg-card-dark rounded-xl p-5 border border-card-dark hover:border-[#3e4a56] transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`${iconBg} p-2 rounded-lg`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span
        className={`${isUp ? "text-[#0bda5b] bg-[#0bda5b]/10" : "text-[#fa6238] bg-[#fa6238]/10"} text-sm font-medium flex items-center gap-1 px-2 py-0.5 rounded`}
      >
        {trendValue}{" "}
        <span className="material-symbols-outlined text-[16px]">{trend}</span>
      </span>
    </div>
    <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
    <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAdmin = (user?.vaitro ?? "").toUpperCase() === "ADMIN";

  const [lowStockRows, setLowStockRows] = useState<LowStockRow[]>([]);
  const [lowStockLoading, setLowStockLoading] = useState(false);
  const [lowStockError, setLowStockError] = useState<string | null>(null);

  const LOW_STOCK_THRESHOLD = 5;

  const mapDanhMucToIcon = (danhmuc?: string | null) => {
    const v = (danhmuc ?? "").toLowerCase();
    if (v === "smartphone") return "smartphone";
    if (v === "component") return "memory";
    if (v === "accessory") return "devices_other";
    return "inventory_2";
  };

  const computeLowStockRows = (list: ProductListItemDto[]) => {
    const rows: LowStockRow[] = [];

    for (const p of list) {
      const icon = mapDanhMucToIcon(p.category);
      const variants = p.variants ?? [];

      if (variants.length > 0) {
        for (const v of variants) {
          const qty = v.tonkho ?? 0;
          if (qty <= LOW_STOCK_THRESHOLD) {
            rows.push({
              key: `${p.id}-${v.idphanloai}`,
              name: p.name,
              sku: v.sku ?? "-",
              qty,
              icon,
              level: qty <= 0 ? "Critical" : "Low",
            });
          }
        }
        continue;
      }

      if ((p.stock ?? 0) <= LOW_STOCK_THRESHOLD) {
        rows.push({
          key: `${p.id}`,
          name: p.name,
          sku: "-",
          qty: p.stock ?? 0,
          icon,
          level: (p.stock ?? 0) <= 0 ? "Critical" : "Low",
        });
      }
    }

    rows.sort((a, b) => {
      if (a.level !== b.level) return a.level === "Critical" ? -1 : 1;
      return a.qty - b.qty;
    });

    return rows.slice(0, 8);
  };

  const fetchLowStock = async () => {
    setLowStockLoading(true);
    setLowStockError(null);
    try {
      const res = await productsApi.getAllProducts({ page: 1, limit: 200 });
      const list = res.data?.data ?? [];
      setLowStockRows(computeLowStockRows(list));
    } catch (e) {
      setLowStockError(
        e instanceof Error ? e.message : "Không thể tải cảnh báo tồn kho.",
      );
      setLowStockRows([]);
    } finally {
      setLowStockLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revenueSeries = useMemo(() => {
    return [120, 180, 160, 220, 205, 260, 240];
  }, []);

  const revenueChart = useMemo(() => {
    const w = 640;
    const h = 220;
    const pad = 24;

    const max = Math.max(...revenueSeries, 1);
    const min = Math.min(...revenueSeries, 0);
    const span = Math.max(1, max - min);

    const pts = revenueSeries.map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (revenueSeries.length - 1);
      const y = pad + ((max - v) * (h - pad * 2)) / span;
      return { x, y, v };
    });

    const line = `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")}`;
    const area = `${line} L ${pts[pts.length - 1].x},${h - pad} L ${pts[0].x},${h - pad} Z`;

    return { w, h, pad, pts, line, area };
  }, [revenueSeries]);

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$124,500"
          icon="payments"
          iconBg="bg-primary/20 text-primary"
          trend="trending_up"
          trendValue="+12%"
          isUp={true}
        />
        <StatCard
          title="Active Inventory"
          value="3,402"
          icon="inventory"
          iconBg="bg-blue-500/20 text-blue-400"
          trend="trending_up"
          trendValue="+5%"
          isUp={true}
        />
        <StatCard
          title="Pending Orders"
          value="15"
          icon="pending_actions"
          iconBg="bg-orange-500/20 text-orange-400"
          trend="trending_down"
          trendValue="-2%"
          isUp={false}
        />
        <StatCard
          title="Return Rate"
          value="2.1%"
          icon="assignment_return"
          iconBg="bg-red-500/20 text-red-400"
          trend="trending_down"
          trendValue="-0.5%"
          isUp={true}
        />
      </section>

      <section>
        <h3 className="text-white text-lg font-bold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { icon: "add_circle", label: "Add Product", path: "/products" },
            ...(isAdmin
              ? []
              : [{ icon: "shopping_cart", label: "Create Order", path: "/sales/new" }]),
            { icon: "person_add", label: "New Supplier", path: "/suppliers" },
          ].map((action, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 bg-card-dark hover:bg-primary text-white px-4 py-3 rounded-lg border border-card-dark hover:border-primary transition-all group"
              onClick={() => {
                navigate(action.path);
              }}
            >
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">
                {action.icon}
              </span>
              <span className="font-medium text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card-dark rounded-xl p-6 border border-card-dark flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-lg font-bold">Revenue Overview</h3>
            <select className="bg-[#111418] text-white text-sm border-none rounded px-3 py-1 focus:ring-0">
              <option>Last 7 Days</option>
            </select>
          </div>

          <div className="flex-1 w-full">
            <div className="h-64 w-full rounded-lg border border-[#111418] bg-[#111418] overflow-hidden">
              <svg
                viewBox={`0 0 ${revenueChart.w} ${revenueChart.h}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(19,127,236,0.35)" />
                    <stop offset="100%" stopColor="rgba(19,127,236,0.02)" />
                  </linearGradient>
                  <linearGradient id="revStroke" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="rgba(19,127,236,0.7)" />
                    <stop offset="100%" stopColor="rgba(19,127,236,1)" />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3].map((i) => {
                  const y =
                    revenueChart.pad +
                    (i * (revenueChart.h - revenueChart.pad * 2)) / 3;
                  return (
                    <line
                      key={i}
                      x1={revenueChart.pad}
                      y1={y}
                      x2={revenueChart.w - revenueChart.pad}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  );
                })}

                <path d={revenueChart.area} fill="url(#revFill)" />

                <path
                  d={revenueChart.line}
                  fill="none"
                  stroke="url(#revStroke)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {revenueChart.pts.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#111418"
                    stroke="rgba(19,127,236,1)"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2">
              {revenueSeries.map((v, i) => (
                <div key={i} className="text-center">
                  <div className="text-[11px] text-text-secondary">Day {i + 1}</div>
                  <div className="text-xs text-white font-semibold">${v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 bg-card-dark rounded-xl p-6 border border-card-dark">
          <h3 className="text-white text-lg font-bold mb-6">Recent Activity</h3>
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#111418]"></div>
            {[
              {
                icon: "add",
                bg: "bg-primary",
                title: "iPhone 14 Pro Added",
                sub: "2m ago",
              },
              {
                icon: "local_shipping",
                bg: "bg-[#0bda5b]",
                title: "Order #9921 Delivered",
                sub: "1h ago",
              },
              {
                icon: "warning",
                bg: "bg-orange-500",
                title: "Low Stock Alert",
                sub: "5h ago",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 relative z-0">
                <div
                  className={`${item.bg} text-white size-8 rounded-full flex items-center justify-center border-4 border-card-dark shrink-0`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-text-secondary text-xs mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-card-dark rounded-xl border border-card-dark overflow-hidden">
        <div className="p-6 border-b border-[#111418] flex justify-between items-center">
          <h3 className="text-white text-lg font-bold">Low Stock Alerts</h3>
        </div>
        {lowStockError && (
          <div className="px-6 pt-4">
            <ErrorAlert message={lowStockError} className="mb-0" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c2229]">
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Product Name
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  SKU
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Quantity
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111418]">
              {lowStockLoading && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary">
                    Loading low stock items...
                  </td>
                </tr>
              )}

              {!lowStockLoading && lowStockRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary">
                    No low stock items.
                  </td>
                </tr>
              )}

              {!lowStockLoading &&
                lowStockRows.map((row) => (
                  <tr key={row.key} className="hover:bg-[#323b46] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="size-10 rounded bg-[#111418] flex items-center justify-center border border-[#3e4a56] text-text-secondary">
                        <span className="material-symbols-outlined">
                          {row.icon}
                        </span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {row.name}
                      </span>
                    </td>
                    <td className="p-4 text-text-secondary text-sm font-mono">
                      {row.sku}
                    </td>
                    <td className="p-4 text-white text-sm font-bold text-right">
                      {row.qty}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.level === "Critical"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {row.level}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
