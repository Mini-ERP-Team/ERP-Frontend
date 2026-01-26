import { useState } from "react";

interface Variant {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  stock: number;
  location: string;
}

interface Product {
  id: string;
  name: string;
  totalStock: number;
  brand: string;
  category: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image?: string;
  icon?: string;
  variants?: Variant[];
}

const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    totalStock: 145,
    brand: "Apple",
    category: "Smartphones",
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBVuFQACffN6RvcrStL4BvjBIy7gKA__L76xy0dK8vbEVN8I1prX3n_DJw6jyPrH0TG1TyEF2eEFA5krcO54J0BOYo6gIw5jeJr3T5BUiY7CSkWIAiZPS7psxSgnevXBsepjOYTy_EhyUc2YMBm0mYLChkkwz44n1qdidCN_Q1nEyQqKFEVasp_OIstNgQ0VqeDvLAZ-hT3pzmysr9r1tAIBAQyvPqhKX15L2ifVUfk_iDCIacxv3DfKEoSAH976sujyvHk6WPUJU",
    variants: [
      {
        id: "v1",
        name: "128GB - Blue Titanium - VN/A",
        sku: "IP15P-128-BLU-VN",
        brand: "Apple",
        category: "Smartphones",
        stock: 45,
        location: "Shelf A-01",
      },
      {
        id: "v2",
        name: "256GB - Natural Titanium - VN/A",
        sku: "IP15P-256-NAT-VN",
        brand: "Apple",
        category: "Smartphones",
        stock: 62,
        location: "Shelf A-02",
      },
      {
        id: "v3",
        name: "512GB - Black Titanium - LL/A",
        sku: "IP15P-512-BLK-LL",
        brand: "Apple",
        category: "Smartphones",
        stock: 38,
        location: "Shelf A-03",
      },
    ],
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    totalStock: 82,
    brand: "Samsung",
    category: "Smartphones",
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_XHFezXzYIiuOJ-YxaJ3L_AHRlucrAlXCSvrxfBQDVielOr0SVCJ-BguR18WpVTneyvi7Ky7Hi77VoJFpPD5DbfxlRfYvnzEYAuOES5oTpZqIPHgFr1uyvuPz5IQMZTBdEWjSX6iY7wZnW2vbDCqPaq3Vr6SIdbQJ5WRxL7IT5ZpvEG77UGFQ5KF0X_mEuvqRjzg0jCwL9MRMoqWXIRkrmWCF49rDoT-3lM1SM45xDXu12wdEoYSGmfWrARXzoDfps0gcZajYyyA",
    variants: [
      {
        id: "v1",
        name: "512GB / Titanium Gray",
        sku: "SG-S24U-512-GRY",
        brand: "Samsung",
        category: "Smartphones",
        stock: 32,
        location: "Zone A-12-05",
      },
      {
        id: "v2",
        name: "1TB / Titanium Black",
        sku: "SG-S24U-1TB-BLK",
        brand: "Samsung",
        category: "Smartphones",
        stock: 50,
        location: "Zone A-12-07",
      },
    ],
  },
  {
    id: "3",
    name: "USB-C to Lightning Cable (1m)",
    totalStock: 154,
    brand: "Apple",
    category: "Accessories",
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8e3OwTWeczO2ixPshlI9kBySAXEzGF20tbmxaRRiT9p-Y7qqhhipnPHL6xgytTuyto_R8CEIz1jf74qAeC9BUQFewYzcul8HeMPTAJkbfxvaHmBpkw7jWnQwUrjeg9cozBA0uYaEnCFXTZM9xgaIMAit7VuSbiXAb15L1N_oifxAzdnPZpHALpmLKsWsBBz_2ShWC4ElQz4t7nyOhhQmbYZjfKmqnPtI3MJ0-jSeT2PTvahRMF15sTc7m-7dLPObQlfe2bksA2tI",
  },
  {
    id: "4",
    name: "Screen Protector iPhone 14/15",
    totalStock: 8,
    brand: "Belkin",
    category: "Accessories",
    status: "Low Stock",
    icon: "mobile_friendly",
  },
  {
    id: "5",
    name: 'MacBook Pro 14" M3 Chip',
    totalStock: 12,
    brand: "Apple",
    category: "Laptops",
    status: "Low Stock",
    icon: "laptop_mac",
    variants: [
      {
        id: "v1",
        name: "M3 Pro / 18GB / 512GB / Space Black",
        sku: "MB-PRO14-M3P",
        brand: "Apple",
        category: "Laptops",
        stock: 5,
        location: "Zone C-01-02",
      },
      {
        id: "v2",
        name: "M3 Max / 36GB / 1TB / Silver",
        sku: "MB-PRO14-M3M",
        brand: "Apple",
        category: "Laptops",
        stock: 7,
        location: "Zone C-01-03",
      },
    ],
  },
  {
    id: "6",
    name: "Sony WH-1000XM5",
    totalStock: 18,
    brand: "Sony",
    category: "Audio",
    status: "In Stock",
    icon: "headphones",
  },
  {
    id: "7",
    name: "Anker PowerBank 20k",
    totalStock: 0,
    brand: "Anker",
    category: "Accessories",
    status: "Out of Stock",
    icon: "battery_charging_full",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-[#0bda5b]/10 text-[#0bda5b]";
  if (status === "Low Stock") styles = "bg-orange-500/10 text-orange-400";
  if (status === "Out of Stock") styles = "bg-red-500/10 text-red-400";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
  let colorClass =
    "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  if (category === "Smartphones") colorClass = "bg-blue-500/10 text-blue-400";
  if (category === "Accessories")
    colorClass = "bg-purple-500/10 text-purple-400";
  if (category === "Laptops") colorClass = "bg-green-500/10 text-green-400";
  if (category === "Audio") colorClass = "bg-pink-500/10 text-pink-400";

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colorClass}`}
    >
      {category}
    </span>
  );
};

const InventoryRow = ({ product }: { product: Product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <>
      <tr
        className={`hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors border-b border-gray-100 dark:border-[#111418] ${hasVariants ? "cursor-pointer" : ""}`}
        onClick={() => hasVariants && setIsExpanded(!isExpanded)}
      >
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`text-text-secondary transition-transform duration-200 ${hasVariants ? "" : "opacity-0"} ${isExpanded ? "rotate-90" : ""}`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </div>

            {product.image ? (
              <div
                className="size-10 rounded bg-gray-100 dark:bg-[#111418] bg-center bg-cover border border-gray-200 dark:border-[#283039]"
                style={{ backgroundImage: `url("${product.image}")` }}
              ></div>
            ) : (
              <div className="size-10 rounded bg-gray-100 dark:bg-[#111418] flex items-center justify-center border border-gray-200 dark:border-[#283039] text-text-secondary">
                <span className="material-symbols-outlined text-lg">
                  {product.icon}
                </span>
              </div>
            )}

            <div>
              <span className="text-gray-900 dark:text-white text-sm font-medium block">
                {product.name}
              </span>
              <span className="text-text-secondary text-xs">
                Total Stock: {product.totalStock} Units
              </span>
            </div>
          </div>
        </td>
        <td className="p-4 text-text-secondary text-sm font-mono">-</td>
        <td className="p-4 text-text-secondary text-sm">{product.brand}</td>
        <td className="p-4">
          <CategoryBadge category={product.category} />
        </td>
        <td
          className={`p-4 text-sm font-bold text-right ${product.totalStock === 0 ? "text-red-400" : "text-gray-900 dark:text-white"}`}
        >
          {product.totalStock}
        </td>
        <td className="p-4 text-text-secondary text-sm text-right">Multiple</td>
        <td className="p-4">
          <StatusBadge status={product.status} />
        </td>
        <td className="p-4 text-text-secondary text-sm text-right">
          <button
            className="hover:text-primary transition-colors p-1"
            title="Edit Product"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </td>
      </tr>

      {isExpanded && hasVariants && (
        <tr className="bg-gray-50 dark:bg-[#1c2229]/50">
          <td colSpan={8} className="p-0">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200 dark:divide-[#111418] border-t border-gray-200 dark:border-[#111418] border-dashed">
                {product.variants?.map((variant) => (
                  <tr
                    key={variant.id}
                    className="hover:bg-gray-100 dark:hover:bg-[#1c2229] transition-colors"
                  >
                    <td className="p-3 pl-16 w-[350px]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-[#3e4a56]"></span>
                        <span className="text-gray-700 dark:text-text-secondary text-sm">
                          {variant.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary text-xs font-mono">
                      {variant.sku}
                    </td>
                    <td className="p-3 text-text-secondary text-xs opacity-50">
                      {variant.brand}
                    </td>
                    <td className="p-3 text-text-secondary text-xs opacity-50">
                      {variant.category}
                    </td>
                    <td className="p-3 text-gray-900 dark:text-white text-sm font-medium text-right">
                      {variant.stock}
                    </td>
                    <td className="p-3 text-text-secondary text-xs text-right">
                      {variant.location}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#0bda5b]/10 text-[#0bda5b]">
                        In Stock
                      </span>
                    </td>
                    <td className="p-3 text-text-secondary text-xs text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="hover:text-primary transition-colors p-1"
                          title="Edit Variant"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            edit
                          </span>
                        </button>
                        <button
                          className="hover:text-red-500 transition-colors p-1"
                          title="Delete Variant"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

const InventoryPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-input-bg rounded-xl p-6 border border-gray-200 dark:border-input-bg shadow-sm hover:border-gray-300 dark:hover:border-[#3e4a56] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">
                Total Inventory Value
              </p>
              <h3 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
                $845,290.00
              </h3>
              <p className="text-[#0bda5b] text-xs font-medium mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  trending_up
                </span>{" "}
                +3.2% from last month
              </p>
            </div>
            <div className="bg-primary/20 p-4 rounded-xl text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">
                currency_exchange
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-input-bg rounded-xl p-6 border border-gray-200 dark:border-input-bg shadow-sm hover:border-gray-300 dark:hover:border-[#3e4a56] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">
                Items Low in Stock
              </p>
              <h3 className="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
                12
              </h3>
              <p className="text-[#fa6238] text-xs font-medium mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  priority_high
                </span>{" "}
                2 items critical
              </p>
            </div>
            <div className="bg-orange-500/20 p-4 rounded-xl text-orange-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">
                inventory_2
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-[#283039]">
        <nav aria-label="Tabs" className="flex gap-8">
          <button className="border-b-2 border-primary py-3 text-sm font-medium text-gray-900 dark:text-white px-1">
            Inventory List
          </button>
          <button className="border-b-2 border-transparent py-3 text-sm font-medium text-text-secondary hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#3e4a56] transition-colors px-1">
            Movement History
          </button>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="relative w-full lg:w-[480px]">
          <div className="absolute left-3 top-2.5 text-text-secondary">
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
          </div>
          <input
            className="w-full bg-white dark:bg-input-bg border border-gray-200 dark:border-input-bg rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            placeholder="Search by Product Name, SKU, or Category..."
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 w-full lg:w-auto">
          <span className="material-symbols-outlined text-[20px]">tune</span>
          <span className="text-sm font-medium whitespace-nowrap">
            Stock Adjustment
          </span>
        </button>
      </div>

      <div className="bg-white dark:bg-input-bg rounded-xl border border-gray-200 dark:border-input-bg overflow-hidden flex flex-col shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1c2229] border-b border-gray-200 dark:border-[#111418]">
                <th className="p-4 w-[350px] text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Product Name / Variant
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  SKU
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Brand
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  In-Stock Qty
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Location
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-left">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#111418]">
              {products.map((product) => (
                <InventoryRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#111418] bg-white dark:bg-input-bg flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            Showing 1-7 of 1,240 products
          </span>
          <div className="flex gap-2">
            <button className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#1c2229] text-text-secondary hover:bg-primary hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="size-8 flex items-center justify-center rounded bg-primary text-white">
              1
            </button>
            <button className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#1c2229] text-text-secondary hover:bg-primary hover:text-white transition-colors">
              2
            </button>
            <button className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#1c2229] text-text-secondary hover:bg-primary hover:text-white transition-colors">
              3
            </button>
            <span className="flex items-center justify-center text-text-secondary">
              ...
            </span>
            <button className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#1c2229] text-text-secondary hover:bg-primary hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
