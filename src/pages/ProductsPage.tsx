const products: Product[] = [
  {
    id: 1,
    name: "Samsung Galaxy S23 Ultra",
    sku: "PH-S23U-256",
    category: "Smartphones",
    price: "$1,199.00",
    stock: 12,
    stockStatus: "Low Stock",
    stockPercent: 15,
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocLfrk1X8_w4kX7d1X_1X_1X_1X_1X_1X_1=s96-c",
  },
  {
    id: 2,
    name: "USB-C Charging Cable 2m",
    sku: "CB-USBC-2M",
    category: "Accessories",
    price: "$19.99",
    stock: 142,
    stockStatus: "In Stock",
    stockPercent: 85,
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocLfrk1X8_w4kX7d1X_1X_1X_1X_1X_1X_1=s96-c",
  },
  {
    id: 3,
    name: "AirPods Pro Silicone Case",
    sku: "CS-APP-BLK",
    category: "Accessories",
    price: "$12.50",
    stock: 45,
    stockStatus: "In Stock",
    stockPercent: 45,
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocLfrk1X8_w4kX7d1X_1X_1X_1X_1X_1X_1=s96-c",
  },
  {
    id: 4,
    name: "iPhone 14 Pro Max 256GB",
    sku: "PH-14PM-256",
    category: "Smartphones",
    price: "$1,099.00",
    stock: 0,
    stockStatus: "Out of Stock",
    stockPercent: 0,
    icon: "image_not_supported",
  },
  {
    id: 5,
    name: "NVIDIA RTX 4080",
    sku: "CMP-GPU-4080",
    category: "Components",
    price: "$1,199.00",
    stock: 3,
    stockStatus: "Low Stock",
    stockPercent: 10,
    icon: "memory",
  },
  {
    id: 6,
    name: "AMD Ryzen 9 7900X",
    sku: "CMP-CPU-R9",
    category: "Components",
    price: "$549.00",
    stock: 28,
    stockStatus: "In Stock",
    stockPercent: 35,
    icon: "developer_board",
  },
];

const StockBar = ({ percent, status }: { percent: number; status: string }) => {
  let color = "bg-[#0bda5b]";
  if (status === "Low Stock") color = "bg-orange-500";
  if (status === "Out of Stock") color = "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm font-medium">
        {percent > 0 ? percent * 2 : 0}
      </span>{" "}
      <div className="h-1.5 w-16 bg-[#111418] rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-[#0bda5b]/10 text-[#0bda5b] border-[#0bda5b]/20";
  if (status === "Low Stock")
    styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (status === "Out of Stock")
    styles = "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      {status}
    </span>
  );
};

const ProductsPage = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              type="text"
              className="w-full bg-input-bg border border-input-bg rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              placeholder="Search by product name..."
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-input-bg text-text-secondary border border-input-bg hover:border-[#3e4a56] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              filter_alt
            </span>
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap self-end md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm font-medium">Add Product</span>
        </button>
      </div>

      <section className="bg-input-bg rounded-xl border border-input-bg overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c2229] border-b border-[#111418]">
                <th className="p-4 pl-6 text-xs font-semibold text-text-secondary uppercase tracking-wider w-16">
                  Image
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Product Name
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  SKU
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Price
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 pr-6 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111418]">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-[#323b46] transition-colors group"
                >
                  <td className="p-4 pl-6">
                    {product.image ? (
                      <div
                        className="size-10 rounded bg-[#111418] bg-center bg-cover border border-[#3e4a56]"
                        style={{ backgroundImage: `url("${product.image}")` }}
                      ></div>
                    ) : (
                      <div className="size-10 rounded bg-[#111418] flex items-center justify-center border border-[#3e4a56] text-text-secondary">
                        <span className="material-symbols-outlined text-sm">
                          {product.icon}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-white text-sm font-medium">
                      {product.name}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary text-sm font-mono">
                    {product.sku}
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    {product.category}
                  </td>
                  <td className="p-4 text-white text-sm font-medium">
                    {product.price}
                  </td>
                  <td className="p-4 text-white text-sm font-medium">
                    <StockBar
                      percent={product.stockPercent}
                      status={product.stockStatus}
                    />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={product.stockStatus} />
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 hover:bg-primary/20 text-text-secondary hover:text-primary rounded transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button
                        className="p-1.5 hover:bg-red-500/20 text-text-secondary hover:text-red-500 rounded transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#111418] p-4 flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            Showing 1-6 of 24 products
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs rounded border border-[#3e4a56] text-text-secondary hover:text-white hover:bg-[#3e4a56] disabled:opacity-50 transition-colors"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 text-xs rounded border border-[#3e4a56] text-text-secondary hover:text-white hover:bg-[#3e4a56] transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
