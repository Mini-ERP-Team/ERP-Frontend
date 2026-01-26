const orders: Order[] = [
  {
    id: "1",
    orderId: "#ORD-2023-892",
    customerName: "James Wilson",
    customerEmail: "james.w@example.com",
    date: "Oct 24, 2023",
    amount: "$1,245.00",
    status: "Processing",
  },
  {
    id: "2",
    orderId: "#ORD-2023-891",
    customerName: "Elena Rodriguez",
    customerEmail: "elena.rod@example.com",
    date: "Oct 24, 2023",
    amount: "$45.50",
    status: "Completed",
  },
  {
    id: "3",
    orderId: "#ORD-2023-890",
    customerName: "TechStart Solutions",
    customerEmail: "Corporate Account",
    date: "Oct 23, 2023",
    amount: "$3,450.00",
    status: "Awaiting Payment",
  },
  {
    id: "4",
    orderId: "#ORD-2023-889",
    customerName: "Sarah Connor",
    customerEmail: "s.connor@sky.net",
    date: "Oct 23, 2023",
    amount: "$599.00",
    status: "Processing",
  },
  {
    id: "5",
    orderId: "#ORD-2023-888",
    customerName: "Michael Chang",
    customerEmail: "mike.c@example.com",
    date: "Oct 22, 2023",
    amount: "$129.99",
    status: "Completed",
  },
  {
    id: "6",
    orderId: "#ORD-2023-887",
    customerName: "Emily Blunt",
    customerEmail: "e.blunt@example.com",
    date: "Oct 21, 2023",
    amount: "$89.00",
    status: "Completed",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-[#0bda5b]/10 text-[#0bda5b] border-[#0bda5b]/20";
  if (status === "Processing")
    styles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (status === "Awaiting Payment")
    styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}
    >
      {status}
    </span>
  );
};

const SalesPage = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-secondary">
              search
            </span>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-input-bg rounded-lg bg-white dark:bg-input-bg text-gray-900 dark:text-white placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            placeholder="Search orders by ID or Customer Name..."
          />
        </div>

        <button className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all font-medium whitespace-nowrap group">
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
            add
          </span>
          Create Sales Order
        </button>
      </div>

      <div className="w-full bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg flex flex-col overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229]/80 border-b border-gray-100 dark:border-[#111418]">
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Order ID
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Total Amount
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="p-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group"
                >
                  <td className="p-5 text-primary text-sm font-medium">
                    {order.orderId}
                  </td>
                  <td className="p-5 text-gray-900 dark:text-white text-sm">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-text-secondary text-xs">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="p-5 text-text-secondary text-sm">
                    {order.date}
                  </td>
                  <td className="p-5 text-gray-900 dark:text-white text-sm font-bold text-right">
                    {order.amount}
                  </td>
                  <td className="p-5 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-5 text-right">
                    {order.status === "Processing" ? (
                      <button className="text-primary bg-primary/10 hover:bg-primary hover:text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
                        Process
                      </button>
                    ) : (
                      <button className="text-text-secondary hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#3e4a56] hover:bg-gray-100 dark:hover:bg-[#3e4a56] px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#111418] bg-white dark:bg-[#1c2229] flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              1-6
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              48
            </span>{" "}
            orders
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs font-medium text-text-secondary bg-white dark:bg-input-bg hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white rounded border border-gray-200 dark:border-[#3e4a56] transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 text-xs font-medium text-text-secondary bg-white dark:bg-input-bg hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white rounded border border-gray-200 dark:border-[#3e4a56] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesPage;
