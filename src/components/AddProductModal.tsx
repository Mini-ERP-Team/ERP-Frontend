import  { useMemo, useState } from "react";

export type Category = "smartphone" | "component" | "accessory";

export type AddProductPayload =
  | {
      category: "smartphone";
      name: string;
      sku: string;
      brand: string;
      model: string;
      capacity: string;
      colorName: string;
      origin: string;   
      stock: number;
      price: number;
    }
  | {
      category: "component";
      name: string;
      sku: string;
      componentType: string;
      supplier: string;
      stock: number;
      techSpecs: string;
    }
  | {
      category: "accessory";
      name: string;
      sku: string;
      accessoryType: string;
      compatibility: string;
      colorSize: string;
      stock: number;
    };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductPayload) => void;
};

export default function AddProductModal({ isOpen, onClose, onSubmit }: Props) {
  const [category, setCategory] = useState<Category>("smartphone");

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");

  // smartphone
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("256");
  const [colorName, setColorName] = useState("");
  const [origin, setOrigin] = useState("");
  const [phoneStock, setPhoneStock] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  // component
  const [componentType, setComponentType] = useState("");
  const [supplier, setSupplier] = useState("");
  const [componentStock, setComponentStock] = useState<number>(0);
  const [techSpecs, setTechSpecs] = useState("");

  // accessory
  const [accessoryType, setAccessoryType] = useState("");
  const [compatibility, setCompatibility] = useState("");
  const [colorSize, setColorSize] = useState("");
  const [accessoryStock, setAccessoryStock] = useState<number>(0);

  const title = useMemo(() => {
    if (category === "smartphone") return "Smartphone Specifications";
    if (category === "component") return "Component Specifications";
    return "Accessory Specifications";
  }, [category]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (category === "smartphone") {
      onSubmit({
        category,
        name,
        sku,
        brand,
        model,
        capacity,
        colorName,
        origin,
        stock: phoneStock,
        price,
      });
      return;
    }

    if (category === "component") {
      onSubmit({
        category,
        name,
        sku,
        componentType,
        supplier,
        stock: componentStock,
        techSpecs,
      });
      return;
    }

    onSubmit({
      category,
      name,
      sku,
      accessoryType,
      compatibility,
      colorSize,
      stock: accessoryStock,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c252e] w-full max-w-2xl rounded-xl border border-[#283039] shadow-2xl flex flex-col max-h-[90vh]">
        {/* header */}
        <div className="flex items-center justify-between p-6 border-b border-[#283039]">
          <h2 className="text-white text-lg font-bold">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-[#9dabb9] hover:text-white transition-colors rounded-lg p-1 hover:bg-[#283039]"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* body */}
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Product Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#9dabb9] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                  placeholder="e.g. iPhone 15 Pro Max"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  SKU
                </label>
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#9dabb9] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                  placeholder="e.g. PH-15PM-256"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="smartphone">Smartphones</option>
                    <option value="component">Components</option>
                    <option value="accessory">Accessories</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#283039]" />

            <div>
              <h3 className="text-white text-sm font-medium mb-4">{title}</h3>

              {category === "smartphone" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Brand
                    </label>
                    <input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. Apple"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Model
                    </label>
                    <input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. iPhone 15 Pro"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Capacity
                    </label>
                    <select
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                    >
                      <option value="128">128GB</option>
                      <option value="256">256GB</option>
                      <option value="512">512GB</option>
                      <option value="1024">1TB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Color
                    </label>
                    <input
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. Titanium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Origin
                    </label>
                    <input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. VN/A"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Stock Quantity
                    </label>
                    <input
                      value={phoneStock}
                      onChange={(e) => setPhoneStock(Number(e.target.value))}
                      type="number"
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Price
                    </label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      type="number"
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {category === "component" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Component Type
                    </label>
                    <input
                      value={componentType}
                      onChange={(e) => setComponentType(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. GPU"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Supplier
                    </label>
                    <input
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. TSMC"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Stock Quantity
                    </label>
                    <input
                      value={componentStock}
                      onChange={(e) => setComponentStock(Number(e.target.value))}
                      type="number"
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div className="hidden md:block" />

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Technical Specs
                    </label>
                    <textarea
                      value={techSpecs}
                      onChange={(e) => setTechSpecs(e.target.value)}
                      rows={4}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="Enter detailed specifications..."
                    />
                  </div>
                </div>
              )}

              {category === "accessory" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Accessory Type
                    </label>
                    <input
                      value={accessoryType}
                      onChange={(e) => setAccessoryType(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. Charger"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Compatibility
                    </label>
                    <input
                      value={compatibility}
                      onChange={(e) => setCompatibility(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. iPhone 15, Galaxy S23"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Color/Size
                    </label>
                    <input
                      value={colorSize}
                      onChange={(e) => setColorSize(e.target.value)}
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="e.g. White, 2m"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                      Stock Quantity
                    </label>
                    <input
                      value={accessoryStock}
                      onChange={(e) => setAccessoryStock(Number(e.target.value))}
                      type="number"
                      className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="p-6 border-t border-[#283039] flex justify-end gap-3 bg-[#1c252e] rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-medium"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
