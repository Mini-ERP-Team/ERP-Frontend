const customers: Customer[] = [
  {
    id: "1",
    customerId: "#CUS-0092",
    name: "Alice Freeman",
    email: "alice.free@example.com",
    phone: "(555) 123-4567",
    orders: 12,
    lastPurchaseDate: "Oct 24, 2023",
    lastPurchaseItem: "iPhone 14 Case",
    initials: "AF",
    avatarColor: "bg-blue-500/20 text-blue-400",
  },
  {
    id: "2",
    customerId: "#CUS-1023",
    name: "Bob Smith",
    email: "bob.smith@techmail.com",
    phone: "(555) 987-6543",
    orders: 5,
    lastPurchaseDate: "Oct 22, 2023",
    lastPurchaseItem: "USB-C Hub",
    initials: "BS",
    avatarColor: "bg-purple-500/20 text-purple-400",
  },
  {
    id: "3",
    customerId: "#CUS-0881",
    name: "Cameron Lee",
    email: "c.lee88@webmail.net",
    phone: "(555) 234-8901",
    orders: 24,
    lastPurchaseDate: "Sep 30, 2023",
    lastPurchaseItem: "Samsung S23 Ultra",
    initials: "CL",
    avatarColor: "bg-orange-500/20 text-orange-400",
  },
  {
    id: "4",
    customerId: "#CUS-9921",
    name: "Diana Prince",
    email: "diana.p@justice.org",
    phone: "(555) 777-1212",
    orders: 3,
    lastPurchaseDate: "Aug 15, 2023",
    lastPurchaseItem: "Wireless Charger",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8e3OwTWeczO2ixPshlI9kBySAXEzGF20tbmxaRRiT9p-Y7qqhhipnPHL6xgytTuyto_R8CEIz1jf74qAeC9BUQFewYzcul8HeMPTAJkbfxvaHmBpkw7jWnQwUrjeg9cozBA0uYaEnCFXTZM9xgaIMAit7VuSbiXAb15L1N_oifxAzdnPZpHALpmLKsWsBBz_2ShWC4ElQz4t7nyOhhQmbYZjfKmqnPtI3MJ0-jSeT2PTvahRMF15sTc7m-7dLPObQlfe2bksA2tI",
  }, // Có ảnh
  {
    id: "5",
    customerId: "#CUS-4432",
    name: "Ethan Jones",
    email: "ethan.j@startup.io",
    phone: "(555) 333-2211",
    orders: 8,
    lastPurchaseDate: "Nov 02, 2023",
    lastPurchaseItem: "MacBook Air M2",
    initials: "EJ",
    avatarColor: "bg-green-500/20 text-green-400",
  },
  {
    id: "6",
    customerId: "#CUS-1102",
    name: "Fiona Miller",
    email: "f.miller@design.co",
    phone: "(555) 456-7890",
    orders: 1,
    lastPurchaseDate: "Nov 05, 2023",
    lastPurchaseItem: "Sony WH-1000XM5",
    initials: "FM",
    avatarColor: "bg-pink-500/20 text-pink-400",
  },
];

const CustomerAvatar = ({ customer }: { customer: Customer }) => {
  if (customer.avatar) {
    return (
      <div
        className="size-9 rounded-full bg-cover bg-center border border-gray-200 dark:border-[#3e4a56]"
        style={{ backgroundImage: `url("${customer.avatar}")` }}
      ></div>
    );
  }
  return (
    <div
      className={`size-9 rounded-full flex items-center justify-center font-bold text-sm ${customer.avatarColor || "bg-gray-500/20 text-gray-400"}`}
    >
      {customer.initials}
    </div>
  );
};

const CustomersPage = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              type="text"
              className="w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              placeholder="Search customers by name, email..."
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg hover:border-gray-300 dark:hover:bg-[#323b46] rounded-lg text-text-secondary hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
            Filter
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg hover:border-gray-300 dark:hover:bg-[#323b46] rounded-lg text-text-secondary hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">
              download
            </span>
            Export
          </button>
        </div>

        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20 w-full sm:w-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-medium text-sm">Add Customer</span>
        </button>
      </div>

      <div className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229] border-b border-gray-100 dark:border-[#111418]">
                <th className="p-4 pl-6 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[25%]">
                  Customer Name
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[15%]">
                  Phone Number
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[20%]">
                  Email Address
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[10%] text-center">
                  Orders
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[15%]">
                  Last Purchase
                </th>
                <th className="p-4 pr-6 text-xs font-semibold text-text-secondary uppercase tracking-wider w-[10%] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111418]">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar customer={customer} />
                      <div>
                        <p className="text-gray-900 dark:text-white text-sm font-medium">
                          {customer.name}
                        </p>
                        <p className="text-text-secondary text-xs">
                          ID: {customer.customerId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    {customer.phone}
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    {customer.email}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#111418] text-gray-700 dark:text-white border border-gray-200 dark:border-[#3e4a56]">
                      {customer.orders}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-900 dark:text-white">
                        {customer.lastPurchaseDate}
                      </span>
                      <span className="text-xs">
                        {customer.lastPurchaseItem}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="text-text-secondary hover:text-primary p-1.5 hover:bg-gray-100 dark:hover:bg-[#111418] rounded transition-colors">
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

        <div className="border-t border-gray-100 dark:border-[#111418] p-4 flex items-center justify-between bg-white dark:bg-input-bg">
          <p className="text-sm text-text-secondary">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">1</span>{" "}
            to{" "}
            <span className="font-medium text-gray-900 dark:text-white">6</span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              48
            </span>{" "}
            customers
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm text-text-secondary border border-gray-200 dark:border-[#3e4a56] rounded hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 text-sm text-white border border-gray-600 dark:border-[#3e4a56] bg-gray-600 dark:bg-[#3e4a56] rounded transition-colors">
              1
            </button>
            <button className="px-3 py-1 text-sm text-text-secondary border border-gray-200 dark:border-[#3e4a56] rounded hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white transition-colors">
              2
            </button>
            <button className="px-3 py-1 text-sm text-text-secondary border border-gray-200 dark:border-[#3e4a56] rounded hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white transition-colors">
              3
            </button>
            <span className="text-text-secondary self-end px-1">...</span>
            <button className="px-3 py-1 text-sm text-text-secondary border border-gray-200 dark:border-[#3e4a56] rounded hover:bg-gray-100 dark:hover:bg-[#3e4a56] hover:text-gray-900 dark:hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersPage;
