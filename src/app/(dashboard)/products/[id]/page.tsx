"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/use-medusa";
import {
  ArrowLeft,
  Package,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Boxes,
  Copy,
  ExternalLink,
  Edit,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-600">Product not found</h2>
        <p className="text-gray-400 mt-2">The product you're looking for doesn't exist.</p>
        <Link href="/products" className="mt-6 px-6 py-3 bg-fwBlack text-white rounded-xl font-bold">
          Back to Products
        </Link>
      </div>
    );
  }

  const mainImage = product.thumbnail || product.images?.[0]?.url;
  const price = product.variants?.[0]?.prices?.[0];
  const inventory = product.variants?.[0]?.inventory_quantity || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-fwBlack">
              {product.title}
            </h1>
            <button
              onClick={() => navigator.clipboard.writeText(product.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy ID"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{product.handle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase border-2 border-fwBlack shadow-comic-sm ${
            product.status === 'published' ? 'bg-fwGreen text-fwGreenText' : 'bg-gray-100 text-gray-600'
          }`}>
            {product.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              <h2 className="font-display font-bold text-fwBlack">Media</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Main Image */}
                <div className="aspect-square bg-fwGray rounded-xl border-2 border-fwBlack overflow-hidden flex items-center justify-center">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  )}
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {product.images?.slice(0, 6).map((image: any, index: number) => (
                    <div
                      key={image.id || index}
                      className="aspect-square bg-fwGray rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-fwBlack transition-colors"
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {(!product.images || product.images.length === 0) && (
                    <div className="col-span-3 py-8 text-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No additional images</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              <h2 className="font-display font-bold text-fwBlack">Description</h2>
            </div>
            <div className="p-6">
              {product.description ? (
                <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
              ) : (
                <p className="text-gray-400 italic">No description available</p>
              )}
            </div>
          </div>

          {/* Variants Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5" />
                <h2 className="font-display font-bold text-fwBlack">Variants</h2>
              </div>
              <span className="text-sm text-gray-500">{product.variants?.length || 0} variants</span>
            </div>
            <div className="divide-y-2 divide-gray-100">
              {product.variants?.map((variant: any) => (
                <div key={variant.id} className="p-4 hover:bg-fwGray transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-fwGray rounded-lg border-2 border-gray-200 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-fwBlack">{variant.title || 'Default'}</p>
                        <p className="text-xs text-gray-500">SKU: {variant.sku || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Stock</p>
                        <p className={`font-bold ${variant.inventory_quantity > 0 ? 'text-fwGreenText' : 'text-red-600'}`}>
                          {variant.inventory_quantity || 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Price</p>
                        <p className="font-bold text-fwPurple">
                          {variant.prices?.[0]?.currency_code?.toUpperCase() || 'EUR'}{' '}
                          {((variant.prices?.[0]?.amount || 0) / 100).toFixed(2)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                </div>
              ))}
              {(!product.variants || product.variants.length === 0) && (
                <div className="p-8 text-center text-gray-400">
                  <Boxes className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No variants</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Price & Stock Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <h2 className="font-display font-bold text-fwBlack">Pricing</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Price</p>
                <p className="text-3xl font-display font-bold text-fwPurple mt-1">
                  {price?.currency_code?.toUpperCase() || 'EUR'} {((price?.amount || 0) / 100).toFixed(2)}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Stock</p>
                <p className={`text-2xl font-display font-bold mt-1 ${inventory > 0 ? 'text-fwGreenText' : 'text-red-600'}`}>
                  {inventory} units
                </p>
              </div>
            </div>
          </div>

          {/* Organization Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              <h2 className="font-display font-bold text-fwBlack">Organization</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Collection</p>
                <p className="font-bold text-fwBlack mt-1">
                  {product.collection?.title || 'No collection'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Type</p>
                <p className="font-bold text-fwBlack mt-1">
                  {product.type?.value || 'No type'}
                </p>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: any) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-fwGray rounded-lg text-xs font-bold text-gray-600"
                      >
                        {tag.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50">
              <h2 className="font-display font-bold text-fwBlack">Details</h2>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtitle</span>
                <span className="font-bold text-fwBlack">{product.subtitle || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Weight</span>
                <span className="font-bold text-fwBlack">{product.weight ? `${product.weight}g` : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Material</span>
                <span className="font-bold text-fwBlack">{product.material || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Origin</span>
                <span className="font-bold text-fwBlack">{product.origin_country || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">HS Code</span>
                <span className="font-bold text-fwBlack">{product.hs_code || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
