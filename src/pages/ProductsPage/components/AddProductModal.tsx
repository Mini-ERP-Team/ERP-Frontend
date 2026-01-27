import { useMemo, useState } from "react";

export type Category = "smartphone" | "component" | "accessory";

export type SmartphoneVariant = {
  id: string;
  sku: string;
  capacity: string;
  colorName: string;
  price: number;
  stock: number;
};

export type AddProductPayload =
  | {
      category: "smartphone";
      name: string;
      brand: string;
      model: string;
      origin: string;
      variants: Omit<SmartphoneVariant, "id">[];
    }
  | {
      category: "component";
      name: string;
      sku: string;
      componentType: string;
      supplier: string;
      stock: number;
      techSpecs: string;
      price: number;
    }
  | {
      category: "accessory";
      name: string;
      sku: string;
      accessoryType: string;
      compatibility: string;
      colorSize: string;
      stock: number;
      price: number;
    };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddProductPayload) => void;
};

export default function AddProductModal({ isOpen, onClose, onSubmit }: Props) {
  const [category, setCategory] = useState<Category>("smartphone");
  const [name, setName] = useState("");

  const [brand, setBrand] = useState("");
  const [phoneModel, setPhoneModel] = useState("");
  const [origin, setOrigin] = useState("");
  
  const [variants, setVariants] = useState<SmartphoneVariant[]>([]);
  
  const [tempSku, setTempSku] = useState("");
  const [tempCapacity, setTempCapacity] = useState("256");
  const [tempColor, setTempColor] = useState("");
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);

  const [singleSku, setSingleSku] = useState("");
  const [singlePrice, setSinglePrice] = useState<number>(0);
  
  const [componentType, setComponentType] = useState("");
  const [supplier, setSupplier] = useState("");
  const [componentStock, setComponentStock] = useState<number>(0);
  const [techSpecs, setTechSpecs] = useState("");

  const [accessoryType, setAccessoryType] = useState("");
  const [compatibility, setCompatibility] = useState("");
  const [colorSize, setColorSize] = useState("");
  const [accessoryStock, setAccessoryStock] = useState<number>(0);

  const title = useMemo(() => {
    if (category === "smartphone") return "Smartphone Variants";
    if (category === "component") return "Component Specifications";
    return "Accessory Specifications";
  }, [category]);

  const handleAddVariant = () => {
    if (!tempSku || !tempColor) return;
    
    const newVariant: SmartphoneVariant = {
      id: Math.random().toString(36).substr(2, 9),
      sku: tempSku,
      capacity: tempCapacity,
      colorName: tempColor,
      price: tempPrice,
      stock: tempStock,
    };

    setVariants([...variants, newVariant]);
    
    setTempSku("");
    setTempColor("");
    setTempPrice(0);
    setTempStock(0);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (category === "smartphone") {
      if (variants.length === 0) {
        alert("Please add at least one variant for this smartphone.");
        return;
      }

      onSubmit({
        category,
        name,
        brand,
        model: phoneModel,
        origin,
        variants: variants.map(({ id, ...rest }) => rest),
      });
      return;
    }

    if (category === "component") {
      onSubmit({
        category,
        name,
        sku: singleSku,
        componentType,
        supplier,
        stock: componentStock,
        techSpecs,
        price: singlePrice,
      });
      return;
    }

    onSubmit({
      category,
      name,
      sku: singleSku,
      accessoryType,
      compatibility,
      colorSize,
      stock: accessoryStock,
      price: singlePrice,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1c252e] w-full max-w-3xl rounded-xl border border-[#283039] shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#283039]">
          <h2 className="text-white text-lg font-bold">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-[#9dabb9] hover:text-white transition-colors rounded-lg p-1 hover:bg-[#283039]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Product Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="e.g. iPhone 15 Pro Max"
                />
              </div>

              {category !== "smartphone" && (
                <div>
                   <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                    SKU
                  </label>
                  <input
                    value={singleSku}
                    onChange={(e) => setSingleSku(e.target.value)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                    placeholder="e.g. CMP-GPU-4080"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="smartphone">Smartphones (Multi-Variant)</option>
                    <option value="component">Components (Single Item)</option>
                    <option value="accessory">Accessories (Single Item)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#283039]" />

            <div>
              <h3 className="text-white text-sm font-medium mb-4">{title}</h3>

              {category === "smartphone" && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                      placeholder="Brand (e.g. Apple)"
                    />
                    <input
                      value={phoneModel}
                      onChange={(e) => setPhoneModel(e.target.value)}
                      className="bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                      placeholder="Model (e.g. iPhone 15 Pro)"
                    />
                    <input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                      placeholder="Origin (e.g. VN/A)"
                    />
                  </div>

                  <div className="bg-[#20272e] p-4 rounded-lg border border-[#283039]">
                     <label className="block text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                       Add New Variant
                     </label>
                     <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                        <div className="md:col-span-2">
                            <input 
                                value={tempSku} 
                                onChange={(e) => setTempSku(e.target.value)}
                                className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white" 
                                placeholder="SKU (e.g. PH-15-256-BL)" 
                            />
                        </div>
                        <div>
                             <select 
                                value={tempCapacity} 
                                onChange={(e) => setTempCapacity(e.target.value)}
                                className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white"
                             >
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1TB">1TB</option>
                             </select>
                        </div>
                        <div>
                             <input 
                                value={tempColor} 
                                onChange={(e) => setTempColor(e.target.value)}
                                className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white" 
                                placeholder="Color" 
                             />
                        </div>
                        <div>
                             <input 
                                type="number"
                                value={tempPrice} 
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white" 
                                placeholder="Price" 
                             />
                        </div>
                         <div>
                             <input 
                                type="number"
                                value={tempStock} 
                                onChange={(e) => setTempStock(Number(e.target.value))}
                                className="w-full bg-[#1c252e] border border-[#283039] rounded px-3 py-2 text-xs text-white" 
                                placeholder="Stock" 
                             />
                        </div>
                     </div>
                     <button 
                        onClick={handleAddVariant}
                        className="mt-3 w-full py-2 bg-[#283039] hover:bg-[#323b46] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2"
                     >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Add Variant
                     </button>
                  </div>

                  {variants.length > 0 && (
                    <div className="border border-[#283039] rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm text-[#9dabb9]">
                            <thead className="bg-[#20272e] text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-2">SKU</th>
                                    <th className="px-4 py-2">Specs</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Stock</th>
                                    <th className="px-4 py-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#283039]">
                                {variants.map((v) => (
                                    <tr key={v.id}>
                                        <td className="px-4 py-2 font-mono text-xs">{v.sku}</td>
                                        <td className="px-4 py-2 text-white">{v.capacity} - {v.colorName}</td>
                                        <td className="px-4 py-2">${v.price}</td>
                                        <td className="px-4 py-2">{v.stock}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button 
                                                onClick={() => handleRemoveVariant(v.id)}
                                                className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  )}
                </div>
              )}

              {category === "component" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Component Type</label>
                    <input value={componentType} onChange={(e) => setComponentType(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="e.g. GPU" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Supplier</label>
                    <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="e.g. TSMC" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Price</label>
                    <input type="number" value={singlePrice} onChange={(e) => setSinglePrice(Number(e.target.value))} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Stock Quantity</label>
                    <input type="number" value={componentStock} onChange={(e) => setComponentStock(Number(e.target.value))} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Technical Specs</label>
                    <textarea value={techSpecs} onChange={(e) => setTechSpecs(e.target.value)} rows={3} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="Enter detailed specifications..." />
                  </div>
                </div>
              )}

              {category === "accessory" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Accessory Type</label>
                    <input value={accessoryType} onChange={(e) => setAccessoryType(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="e.g. Charger" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Compatibility</label>
                    <input value={compatibility} onChange={(e) => setCompatibility(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="e.g. iPhone 15" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Price</label>
                    <input type="number" value={singlePrice} onChange={(e) => setSinglePrice(Number(e.target.value))} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" />
                  </div>
                   <div>
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Stock Quantity</label>
                    <input type="number" value={accessoryStock} onChange={(e) => setAccessoryStock(Number(e.target.value))} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#9dabb9] uppercase tracking-wider mb-2">Color / Size</label>
                    <input value={colorSize} onChange={(e) => setColorSize(e.target.value)} className="w-full bg-[#283039] border border-[#283039] rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none" placeholder="e.g. White, 2m" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#283039] flex justify-end gap-3 bg-[#1c252e] rounded-b-xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-[#3e4a56] text-[#9dabb9] hover:text-white hover:bg-[#3e4a56] transition-colors text-sm font-medium">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-medium">Add Product</button>
        </div>
      </div>
    </div>
  );
}
