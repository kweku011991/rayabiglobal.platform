import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState, useRef } from "react";
import { getSessionId, formatPrice } from "../lib/utils";
import type { Id } from "../../convex/_generated/dataModel";
import { z } from "zod";

export const Route = createFileRoute("/dashboard")({
  validateSearch: z.object({
    newRequest: z.boolean().optional(),
    category: z.string().optional(),
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { newRequest, category } = Route.useSearch();
  const sessionId = React.useMemo(() => getSessionId(), []);
  
  // Stable UI states - Moved to top level
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(category || "All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newRequest) {
      setIsRequestModalOpen(true);
    }
  }, [newRequest]);

  const generateUploadUrl = useMutation(api.requests.generateUploadUrl);
  const createRequest = useMutation(api.requests.create);
  const createOrder = useMutation(api.orders.create);
  const updateRequestStatus = useMutation(api.requests.updateStatus);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !country) return;
    
    setIsUploading(true);
    try {
      let storageId: Id<"_storage"> | undefined;
      
      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const { storageId: sId } = await result.json();
        storageId = sId as Id<"_storage">;
      }

      await createRequest({
        sessionId,
        description,
        desiredCountry: country,
        storageId,
      });

      setDescription("");
      setCountry("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsRequestModalOpen(false);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f3] pb-20 font-sans text-[#1b2b1b]">
      {/* Header - Stable Shell */}
      <header className="bg-white border-b border-[#9caf9c]/20 sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <a href="/" className="w-12 h-12 rounded-full bg-[#1b2b1b] flex items-center justify-center overflow-hidden hover:scale-110 transition-transform shadow-md">
                <img src="https://i.postimg.cc/g0NZcdqH/logo-png.png" alt="" className="w-full h-full object-contain scale-150" />
             </a>
             <a href="/" className="text-xl font-black tracking-tighter text-[#1b2b1b] uppercase">RAYABIGLOBAL</a>
          </div>
          <button 
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-[#9caf9c] text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#1b2b1b] transition-all active:scale-95 shadow-sm"
          >
            New Request
          </button>
        </div>
      </header>

      {/* Main Content - Suspending parts isolated */}
      <main className="container mx-auto px-6 py-12 space-y-16 relative">
        {/* Large Watermark */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none -z-10">
           <img src="https://i.postimg.cc/g0NZcdqH/logo-png.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Filters and Search - Stable */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-2xl font-black uppercase tracking-tight whitespace-nowrap">Direct Shop</h2>
            <div className="h-px flex-1 bg-[#9caf9c]/20"></div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-64">
              <input 
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#9caf9c]/20 rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#1b2b1b] transition-all"
              />
              <svg className="w-3 h-3 absolute right-4 top-1/2 -translate-y-1/2 text-[#9caf9c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {["All", "Watch", "Bag", "E-bike", "Motorbike", "Car", "Other"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeCategory === cat 
                    ? 'bg-[#1b2b1b] text-[#9caf9c] shadow-lg scale-105' 
                    : 'bg-white text-[#1b2b1b] border border-[#9caf9c]/20 hover:border-[#1b2b1b]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <React.Suspense fallback={<div className="h-96 flex items-center justify-center text-[#9caf9c] font-black uppercase animate-pulse">Syncing Inventory...</div>}>
           <InventoryGrid 
              activeCategory={activeCategory} 
              searchQuery={searchQuery} 
              createOrder={createOrder}
              sessionId={sessionId}
           />
        </React.Suspense>

        <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-[#9caf9c] font-black uppercase animate-pulse">Loading Requests...</div>}>
           <RequestsSection 
              sessionId={sessionId} 
              createOrder={createOrder} 
              updateRequestStatus={updateRequestStatus} 
           />
        </React.Suspense>

        <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-[#9caf9c] font-black uppercase animate-pulse">Loading Shipments...</div>}>
           <OrdersSection sessionId={sessionId} />
        </React.Suspense>
      </main>

      {/* Request Modal - Stable */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-[#1b2b1b]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-[#1b2b1b] p-8 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-widest">Product Request</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-white/50 hover:text-white text-3xl font-black">&times;</button>
            </div>
            <form onSubmit={handleRequestSubmit} className="p-10 space-y-8 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-[10px] font-black text-[#9caf9c] mb-4 uppercase tracking-[0.2em]">Item Specifications</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-[#f3f7f3] rounded-xl p-5 focus:border-[#9caf9c] focus:ring-0 outline-none transition text-[#1b2b1b] font-bold bg-[#f3f7f3]/50"
                  placeholder="e.g. Rolex Submariner Date, 2024 Model, Unworn"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#9caf9c] mb-4 uppercase tracking-[0.2em]">Source Region</label>
                <input 
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border-2 border-[#f3f7f3] rounded-xl p-5 focus:border-[#9caf9c] focus:ring-0 outline-none transition text-[#1b2b1b] font-bold bg-[#f3f7f3]/50"
                  placeholder="e.g. Dubai, Switzerland, USA"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#9caf9c] mb-4 uppercase tracking-[0.2em]">Reference Image (Optional)</label>
                <div className="relative group">
                   <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#9caf9c]/30 rounded-xl p-8 text-center hover:border-[#9caf9c] transition-all bg-[#f3f7f3]/50 group-hover:bg-white"
                  >
                    {selectedImage ? (
                      <div className="flex items-center justify-center gap-2 text-[#1b2b1b] font-bold uppercase text-[10px]">
                        <span className="truncate max-w-[200px]">{selectedImage.name}</span>
                        <span className="text-[#9caf9c]">Click to change</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[#1b2b1b] font-black uppercase text-[10px] tracking-widest">Select Product Photo</p>
                        <p className="text-[#9caf9c] font-bold text-[8px] uppercase tracking-widest">JPG, PNG up to 10MB</p>
                      </div>
                    )}
                  </button>
                </div>
              </div>
              <button 
                type="submit"
                disabled={isUploading}
                className={`w-full bg-[#1b2b1b] text-white py-5 rounded-sm font-black text-xs uppercase tracking-[0.3em] hover:bg-[#9caf9c] shadow-xl active:scale-95 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
              >
                {isUploading ? 'Processing...' : 'Launch Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a 
        href="https://api.whatsapp.com/send?phone=233539957349" 
        className="fixed bottom-8 right-8 bg-[#1b2b1b] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#9caf9c] hover:scale-110 transition-all z-50 group border-2 border-white/20"
        title="Chat with Admin"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.328-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}

// Isolated Sub-components for real-time data

function InventoryGrid({ activeCategory, searchQuery, createOrder, sessionId }: any) {
  const { data: products } = useSuspenseQuery(convexQuery(api.products.listAll, {}));
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyDirect = async (product: any) => {
    if (product.stock <= 0) {
      alert("This item is currently out of stock.");
      return;
    }
    
    const confirmPayment = window.confirm(
      `Confirm purchase of ${product.productName}?\nTotal: ${formatPrice(product.price + product.shippingCost)}`
    );
    if (confirmPayment) {
      await createOrder({
        sessionId,
        source: "direct",
        productId: product._id,
        productDetails: {
          name: product.productName,
          description: product.description,
          price: product.price,
          shippingCost: product.shippingCost,
        },
        totalAmount: product.price + product.shippingCost,
      });
      alert("Payment successful! Order confirmed.");
    }
  };

  if (filteredProducts.length === 0) {
    return <p className="text-[#9caf9c] bg-white p-12 rounded-2xl border border-[#9caf9c]/10 text-center font-bold uppercase text-xs tracking-widest">No inventory found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProducts.map((product) => (
        <div key={product._id} className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all border border-[#9caf9c]/10 group flex flex-col h-full relative">
          {product.stock <= 0 && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center p-6 text-center">
                <span className="bg-[#1b2b1b] text-white px-6 py-3 font-black uppercase text-xs tracking-[0.3em] rotate-[-5deg] shadow-2xl border-4 border-white">Sold Out</span>
             </div>
          )}
          <div className="h-56 bg-gray-100 relative overflow-hidden">
            {product.pictureUrl ? (
              <img src={product.pictureUrl} alt={product.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
            )}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
               <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${product.warehouseLocation === 'Local' ? 'bg-green-500 text-white' : 'bg-[#1b2b1b] text-[#9caf9c]'}`}>
                  {product.warehouseLocation}
                </span>
                {product.condition && (
                   <span className="bg-white text-[#1b2b1b] text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      {product.condition}
                   </span>
                )}
            </div>
          </div>
          <div className="p-8 flex flex-col flex-1">
            <div className="mb-4">
              <div className="text-[8px] font-black text-[#9caf9c] uppercase tracking-[0.2em] mb-1">{product.category}</div>
              <h3 className="text-xl font-black text-[#1b2b1b] mb-1 uppercase tracking-tight">{product.productName}</h3>
              <div className="flex flex-wrap gap-3 text-[10px] font-bold text-[#9caf9c] uppercase tracking-widest">
                 {product.year && <span>{product.year}</span>}
                 {product.mileage && <span>• {product.mileage}</span>}
                 {product.serialNumber && <span className="opacity-50">• SN: {product.serialNumber}</span>}
              </div>
            </div>
            <p className="text-[#1b2b1b]/60 text-sm mb-8 line-clamp-2 font-medium flex-1">{product.description}</p>
            <div className="flex justify-between items-end mt-auto pt-6 border-t border-[#f3f7f3]">
              <div>
                <p className="text-2xl font-black text-[#1b2b1b]">{formatPrice(product.price)}</p>
                <p className="text-[10px] text-[#9caf9c] font-bold uppercase tracking-widest">+ {formatPrice(product.shippingCost)} shipping</p>
              </div>
              <button 
                onClick={() => handleBuyDirect(product)}
                disabled={product.stock <= 0}
                className="bg-[#1b2b1b] text-white px-6 py-2 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#9caf9c] transition-all disabled:opacity-0"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RequestsSection({ sessionId, createOrder, updateRequestStatus }: any) {
  const { data: myRequests } = useSuspenseQuery(convexQuery(api.requests.listByUser, { sessionId }));

  const handleAcceptOffer = async (request: any) => {
    if (!request.adminResponse) return;
    const confirmPayment = window.confirm(
      `Confirm payment for ${request.adminResponse.productDetails}?\nTotal: ${formatPrice(request.adminResponse.totalAmount)}`
    );
    if (confirmPayment) {
      await createOrder({
        sessionId,
        source: "request",
        requestId: request._id,
        productDetails: {
          name: request.adminResponse.productDetails,
          description: request.description,
          price: request.adminResponse.price,
          shippingCost: request.adminResponse.shippingCost,
        },
        totalAmount: request.adminResponse.totalAmount,
      });
      alert("Payment successful! Order confirmed.");
    }
  };

  const handleDeclineOffer = async (requestId: any) => {
    if (window.confirm("Are you sure you want to decline this offer? This will close the request.")) {
      await updateRequestStatus({ requestId, status: "declined" });
    }
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight">Sourcing Requests</h2>
        <div className="h-px flex-1 bg-[#9caf9c]/20"></div>
      </div>
      <div className="space-y-4">
        {myRequests.length === 0 ? (
          <p className="text-[#9caf9c] font-bold uppercase text-[10px] tracking-widest">No active requests.</p>
        ) : (
          myRequests.map((req: any) => (
            <div key={req._id} className="bg-white p-8 rounded-2xl border border-[#9caf9c]/10 shadow-sm flex flex-col md:flex-row gap-8">
              {req.pictureUrl && (
                 <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-[#9caf9c]/10">
                    <img src={req.pictureUrl} alt="" className="w-full h-full object-cover" />
                 </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest mb-1">Product Description</p>
                    <p className="text-[#1b2b1b] font-bold text-lg leading-tight mb-2">{req.description}</p>
                    <p className="text-[10px] text-[#1b2b1b]/50 font-bold uppercase tracking-widest">Target Origin: {req.desiredCountry}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      req.status === 'offer_sent' ? 'bg-blue-100 text-blue-700' :
                      req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {req.status === 'offer_sent' && req.adminResponse && (
                  <div className="mt-8 bg-[#f3f7f3] p-8 rounded-2xl border border-[#9caf9c]/20">
                    <div className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest mb-4">Official Admin Quote</div>
                    <h4 className="font-black text-[#1b2b1b] text-xl mb-2 uppercase tracking-tight">{req.adminResponse.productDetails}</h4>
                    <div className="flex justify-between items-center flex-wrap gap-6">
                      <div>
                        <p className="text-3xl font-black text-[#1b2b1b]">{formatPrice(req.adminResponse.totalAmount)}</p>
                        <p className="text-[10px] text-[#9caf9c] font-bold uppercase tracking-widest">Complete fulfillment including {formatPrice(req.adminResponse.shippingCost)} shipping</p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleAcceptOffer(req)}
                          className="bg-[#1b2b1b] text-white px-8 py-3 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#9caf9c] transition-all shadow-lg"
                        >
                          Accept & Pay
                        </button>
                        <button 
                          onClick={() => handleDeclineOffer(req._id)}
                          className="bg-white text-red-600 px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest border border-red-100 hover:bg-red-50 transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function OrdersSection({ sessionId }: { sessionId: string }) {
  const { data: myOrders } = useSuspenseQuery(convexQuery(api.orders.listByUser, { sessionId }));

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight">Active Shipments</h2>
        <div className="h-px flex-1 bg-[#9caf9c]/20"></div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {myOrders.length === 0 ? (
          <p className="text-[#9caf9c] font-bold uppercase text-[10px] tracking-widest">No active orders found.</p>
        ) : (
          myOrders.map((order: any) => (
            <div key={order._id} className="bg-white p-8 rounded-2xl border border-[#9caf9c]/10 shadow-sm flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <div className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest mb-2">Order Manifest</div>
                <h3 className="font-black text-2xl text-[#1b2b1b] uppercase tracking-tighter mb-1">{order.productDetails.name}</h3>
                <p className="text-[10px] text-[#1b2b1b]/30 font-bold uppercase tracking-widest mb-6">ID: {order._id.substring(0, 12)}</p>
                
                <div className="bg-[#f3f7f3] p-4 rounded-xl inline-block">
                  <div className="text-[8px] font-black text-[#9caf9c] uppercase tracking-widest mb-1">Total Paid</div>
                  <div className="text-xl font-black text-[#1b2b1b]">{formatPrice(order.totalAmount)}</div>
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <div className="text-[10px] font-black text-[#1b2b1b] uppercase tracking-widest mb-8 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   Live Tracking Timeline
                </div>
                <div className="relative pl-8 space-y-8">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#9caf9c]/10"></div>
                  {order.trackingUpdates.map((update: any, idx: number) => (
                    <div key={idx} className="relative group/track">
                      <div className={`absolute -left-[26px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-all duration-500 ${idx === order.trackingUpdates.length - 1 ? 'bg-[#1b2b1b] scale-150' : 'bg-[#9caf9c]'}`}></div>
                      <p className={`font-black uppercase tracking-tight text-sm ${idx === order.trackingUpdates.length - 1 ? 'text-[#1b2b1b]' : 'text-[#1b2b1b]/40'}`}>{update.status}</p>
                      <p className="text-[10px] text-[#9caf9c] font-bold uppercase tracking-widest mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
