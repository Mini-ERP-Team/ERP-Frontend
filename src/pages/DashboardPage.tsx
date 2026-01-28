import { useNavigate } from "react-router-dom";

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
            { icon: "add_circle", label: "Add Product" },
            { icon: "shopping_cart", label: "Create Order" },
            { icon: "assignment_return", label: "Register Return" },
            { icon: "person_add", label: "New Supplier" },
          ].map((action, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 bg-card-dark hover:bg-primary text-white px-4 py-3 rounded-lg border border-card-dark hover:border-primary transition-all group"
              onClick={() => {
                if (action.label === "Create Order") navigate("/sales/new");
                if (action.label === "Add Product") navigate("/products");
                if (action.label === "New Supplier") navigate("/suppliers");
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
          <div className="flex-1 flex items-end gap-2 sm:gap-4 md:gap-6 h-64 w-full">
            {[40, 65, 50, 85, 75, 45, 30].map((h, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end gap-2 group"
              >
                <div
                  className={`w-full rounded-t-sm transition-all relative ${i === 4 ? "bg-primary shadow-[0_0_15px_rgba(19,127,236,0.3)]" : "bg-primary/30 group-hover:bg-primary"}`}
                  style={{ height: `${h}%` }}
                ></div>
                <p className="text-text-secondary text-xs text-center">
                  Day {i + 1}
                </p>
              </div>
            ))}
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
              <tr className="hover:bg-[#323b46] transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="size-10 rounded bg-[#111418] flex items-center justify-center border border-[#3e4a56] text-text-secondary">
                    <span className="material-symbols-outlined">
                      smartphone
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    Samsung Galaxy S23
                  </span>
                </td>
                <td className="p-4 text-text-secondary text-sm">SP-S23-001</td>
                <td className="p-4 text-white text-sm font-bold text-right">
                  12
                </td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                    Critical
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
