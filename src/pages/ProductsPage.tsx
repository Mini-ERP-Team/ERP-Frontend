import { useState } from "react";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type Variant = {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  stockPercent: number;
  status: StockStatus;
};

type Product = {
  id: number;
  name: string;
  sku?: string;
  category: string;
  price: string;
  stock: number;
  stockPercent: number;
  status: StockStatus;
  image?: string;
  icon?: string;
  variants?: Variant[];
  variantCountText?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    price: "$1,199.00+",
    stock: 34,
    stockPercent: 40,
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBVuFQACffN6RvcrStL4BvjBIy7gKA__L76xy0dK8vbEVN8I1prX3n_DJw6jyPrH0TG1TyEF2eEFA5krcO54J0BOYo6gIw5jeJr3T5BUiY7CSkWIAiZPS7psxSgnevXBsepjOYTy_EhyUc2YMBm0mYLChkkwz44n1qdidCN_Q1nEyQqKFEVasp_OIstNgQ0VqeDvLAZ-hT3pzmysr9r1tAIBAQyvPqhKX15L2ifVUfk_iDCIacxv3DfKEoSAH976sujyvHk6WPUJU",
    variantCountText: "3 Variants",
    variants: [
      {
        id: "v1",
        name: "256GB / Natural Titanium / VN/A",
        sku: "PH-15PM-NT-256",
        price: "$1,199.00",
        stock: 12,
        stockPercent: 20,
        status: "Low Stock",
      },
      {
        id: "v2",
        name: "512GB / Blue Titanium / LL/A",
        sku: "PH-15PM-BL-512",
        price: "$1,399.00",
        stock: 22,
        stockPercent: 45,
        status: "In Stock",
      },
      {
        id: "v3",
        name: "1TB / Black Titanium / ZA/A",
        sku: "PH-15PM-BK-1TB",
        price: "$1,599.00",
        stock: 0,
        stockPercent: 0,
        status: "Out of Stock",
      },
    ],
  },
  {
    id: 2,
    name: "USB-C Charging Cable 2m",
    category: "Accessories",
    price: "$19.99",
    stock: 142,
    stockPercent: 85,
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_XHFezXzYIiuOJ-YxaJ3L_AHRlucrAlXCSvrxfBQDVielOr0SVCJ-BguR18WpVTneyvi7Ky7Hi77VoJFpPD5DbfxlRfYvnzEYAuOES5oTpZqIPHgFr1uyvuPz5IQMZTBdEWjSX6iY7wZnW2vbDCqPaq3Vr6SIdbQJ5WRxL7IT5ZpvEG77UGFQ5KF0X_mEuvqRjzg0jCwL9MRMoqWXIRkrmWCF49rDoT-3lM1SM45xDXu12wdEoYSGmfWrARXzoDfps0gcZajYyyA",
    variantCountText: "2 Variants",
  },
  {
    id: 3,
    name: "AirPods Pro Silicone Case",
    category: "Accessories",
    price: "$12.50",
    stock: 45,
    stockPercent: 45,
    status: "In Stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8e3OwTWeczO2ixPshlI9kBySAXEzGF20tbmxaRRiT9p-Y7qqhhipnPHL6xgytTuyto_R8CEIz1jf74qAeC9BUQFewYzcul8HeMPTAJkbfxvaHmBpkw7jWnQwUrjeg9cozBA0uYaEnCFXTZM9xgaIMAit7VuSbiXAb15L1N_oifxAzdnPZpHALpmLKsWsBBz_2ShWC4ElQz4t7nyOhhQmbYZjfKmqnPtI3MJ0-jSeT2PTvahRMF15sTc7m-7dLPObQlfe2bksA2tI",
    variantCountText: "4 Variants",
  },
  {
    id: 4,
    name: "NVIDIA RTX 4080",
    sku: "CMP-GPU-4080",
    category: "Components",
    price: "$1,199.00",
    stock: 3,
    stockPercent: 10,
    status: "Low Stock",
    icon: "memory",
    variantCountText: "Single Item",
  },
];

const StockBar = ({
  value,
  percent,
  status,
}: {
  value: number;
  percent: number;
  status: StockStatus;
}) => {
  let color = "bg-blue-500";
  if (status === "Low Stock") color = "bg-orange-500";
  if (status === "Out of Stock") color = "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <span>{value}</span>
      <div className="h-1.5 w-16 bg-[#111418] rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const StatusBadge = ({
  status,
  small,
}: {
  status: StockStatus;
  small?: boolean;
}) => {
  let styles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (status === "Low Stock")
    styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (status === "Out of Stock")
    styles = "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-medium border",
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        styles,
      ].join(" ")}
    >
      {status}
    </span>
  );
};

const ProductRow = ({ product }: { product: Product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasVariants = (product.variants?.length ?? 0) > 0;

  return (
    <>
      <tr
        className={[
          "hover:bg-[#323b46] transition-colors group bg-[#283039]",
          hasVariants ? "cursor-pointer" : "",
        ].join(" ")}
        onClick={() => hasVariants && setIsExpanded((v) => !v)}
      >
        <td className="p-4 pl-6">
          <span
            className={[
              "material-symbols-outlined text-[#9dabb9] group-hover:text-white transition-transform",
              hasVariants ? "" : "opacity-0",
              isExpanded ? "rotate-90" : "",
            ].join(" ")}
          >
            chevron_right
          </span>
        </td>

        <td className="p-4 pl-0">
          {product.image ? (
            <div
              className="size-10 rounded bg-[#111418] bg-center bg-cover border border-[#3e4a56]"
              style={{ backgroundImage: `url("${product.image}")` }}
            />
          ) : (
            <div className="size-10 rounded bg-[#111418] flex items-center justify-center border border-[#3e4a56] text-[#9dabb9]">
              <span className="material-symbols-outlined text-sm">
                {product.icon ?? "inventory_2"}
              </span>
            </div>
          )}
        </td>

        <td className="p-4">
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">
              {product.name}
            </span>
            <span className="text-[#9dabb9] text-xs">
              {product.variantCountText ?? "Single Item"}
            </span>
          </div>
        </td>

        <td className="p-4 text-[#9dabb9] text-sm font-mono">
          {product.sku ?? "-"}
        </td>

        <td className="p-4 text-[#9dabb9] text-sm">{product.category}</td>

        <td className="p-4 text-white text-sm font-medium">{product.price}</td>

        <td className="p-4 text-white text-sm font-medium">
          <StockBar
            value={product.stock}
            percent={product.stockPercent}
            status={product.status}
          />
        </td>

        <td className="p-4">
          <StatusBadge status={product.status} />
        </td>

        <td className="p-4 pr-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded transition-colors"
              title="Edit"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
            </button>
          </div>
        </td>
      </tr>

      {isExpanded &&
        hasVariants &&
        product.variants!.map((v) => (
          <tr key={v.id} className="bg-[#20272e] ">
            <td className="p-4 pl-6"></td>

            <td className="p-4 pl-0">
              <div className="size-8 rounded bg-[#111418] border border-[#3e4a56] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#9dabb9] text-sm">
                  smartphone
                </span>
              </div>
            </td>

            <td className="p-4">
              <span className="text-[#ced4da] text-sm pl-2">{v.name}</span>
            </td>

            <td className="p-4 text-[#9dabb9] text-xs font-mono">{v.sku}</td>

            <td className="p-4 text-[#9dabb9] text-xs"></td>

            <td className="p-4 text-[#ced4da] text-sm font-medium">
              {v.price}
            </td>

            <td className="p-4 text-[#ced4da] text-sm font-medium">
              <StockBar
                value={v.stock}
                percent={v.stockPercent}
                status={v.status}
              />
            </td>

            <td className="p-4">
              <StatusBadge status={v.status} small />
            </td>

            <td className="p-4 pr-6 text-right">
              <div className="flex items-center justify-end gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded transition-colors"
                  title="Edit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit
                  </span>
                </button>

                <button
                  className="p-1.5 hover:bg-red-500/20 text-[#9dabb9] hover:text-red-500 rounded transition-colors"
                  title="Delete"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete
                  </span>
                </button>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
};

const ProductPage = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9dabb9]">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              className="w-full bg-[#283039] border border-[#283039] rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-[#9dabb9] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              placeholder="Search by product name..."
              type="text"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#283039] text-[#9dabb9] border border-[#283039] hover:border-[#3e4a56] hover:text-white transition-colors">
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

      <section className="bg-[#283039] rounded-xl border border-[#283039] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c2229] border-b border-[#111418]">
                <th className="p-4 pl-6 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-16"></th>
                <th className="p-4 pl-0 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-16">
                  Image
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Product Name / Variant
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  SKU
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Price
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 pr-6 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#111418]">
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#111418] p-4 flex items-center justify-between">
          <span className="text-xs text-[#9dabb9]">
            Showing 1-4 of 24 products
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs rounded border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] disabled:opacity-50 transition-colors"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 text-xs rounded border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
