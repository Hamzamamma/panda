"use client";

import { useProducts } from "@/hooks/use-medusa";
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Image as ImageIcon
} from "lucide-react";

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-display font-bold text-fwBlack">Products</h1>
          <p className="text-gray-500 font-medium">Manage and view your store's merchandise.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-fwBlack text-white rounded-xl font-bold shadow-comic hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-fwBlack rounded-xl text-sm font-bold shadow-comic-sm focus:outline-none focus:ring-2 focus:ring-fwPurple/20"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-fwBlack rounded-xl font-bold shadow-comic-sm hover:bg-gray-50 transition-all">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic h-[320px] animate-pulse" />
          ))
        ) : products && products.length > 0 ? (
          products.map((product: any) => (
            <div key={product.id} className="group bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer">
              {/* Image Preview */}
              <div className="aspect-square bg-fwGray border-b-2 border-fwBlack relative flex items-center justify-center overflow-hidden">
                {product.thumbnail ? (
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-white border-2 border-fwBlack rounded-full text-[10px] font-bold uppercase shadow-comic-sm">
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-fwBlack line-clamp-1">{product.title}</h3>
                    <p className="text-sm font-bold text-gray-500 mt-0.5">{product.collection?.title || "No Collection"}</p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                <div className="mt-4 flex items-center justify-between border-t-2 border-gray-50 pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory</p>
                    <p className="text-sm font-bold text-fwBlack mt-0.5">{product.variants?.[0]?.inventory_quantity || 0} in stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</p>
                    <p className="text-lg font-display font-bold text-fwPurple mt-0.5">
                      € {((product.variants?.[0]?.prices?.[0]?.amount || 0) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 bg-white border-2 border-dashed border-gray-300 rounded-3xl">
            <ShoppingBag className="w-16 h-16 text-gray-200" />
            <div className="text-center">
              <p className="text-xl font-display font-bold text-gray-400">No products found</p>
              <p className="text-gray-400 font-medium">Start by adding your first product to the store.</p>
            </div>
            <button className="mt-4 px-8 py-3 bg-fwBlack text-white rounded-xl font-bold shadow-comic-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              Create Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
