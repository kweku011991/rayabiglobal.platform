import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { formatPrice } from "../lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const addProduct = useMutation(api.products.add);
  const respondToRequest = useMutation(api.requests.respond);

  // Form states - Top level, completely outside Suspense
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [offerDetails, setOfferDetails] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerShipping, setOfferShipping] = useState("");

  const [newProductName, setNewProductName] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [newProductCategory, setNewProductCategory] = useState<"Watch" | "Bag" | "E-bike" | "Motorbike" | "Car" | "Other">("Watch");
  const [newProductStock, setNewProductStock] = useState("1");
  const [newProductYear, setNewProductYear] = useState("");
  const [newProductCondition, setNewProductCondition] = useState("");
  const [newProductSerial, setNewProductSerial] = useState("");
  const [newProductMileage, setNewProductMileage] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductShipping, setNewProductShipping] = useState("");
  const [newProductLocation, setNewProductLocation] = useState<"Local" | "Abroad">("Abroad");
  const [newProductImage, setNewProductImage] = useState("");

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId) return;
    try {
      await respondToRequest({
        requestId: selectedRequestId as any,
        productDetails: offerDetails,
        price: Number(offerPrice),
        shippingCost: Number(offerShipping),
      });
      setSelectedRequestId(null);
      setOfferDetails("");
      setOfferPrice("");
      setOfferShipping("");
      alert("Quote transmitted successfully.");
    } catch (err) {
      alert("Failed to transmit quote.");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({
        productName: newProductName,
        description: newProductDesc,
        category: newProductCategory,
        stock: Number(newProductStock),
        year: newProductYear || undefined,
        condition: newProductCondition || undefined,
        serialNumber: newProductSerial || undefined,
        mileage: newProductMileage || undefined,
        price: Number(newProductPrice),
        shippingCost: Number(newProductShipping),
        warehouseLocation: newProductLocation,
        pictureUrl: newProductImage,
      });
      setNewProductName("");
      setNewProductDesc("");
      setNewProductYear("");
      setNewProductCondition("");
      setNewProductSerial("");
      setNewProductMileage("");
      setNewProductPrice("");
      setNewProductShipping("");
      setNewProductImage("");
      setNewProductStock("1");
      alert("Product published to inventory.");
    } catch (err) {
      alert("Failed to publish product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f3] p-4 md:p-8 font-sans text-[#1b2b1b]">
      <div className="max-w-6xl mx-auto">
        {/* Header - Permanent */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-full bg-[#1b2b1b] flex items-center justify-center overflow-hidden shadow-lg border-2 border-white">
                <img src="https://i.postimg.cc/g0NZcdqH/logo-png.png" alt="" className="w-full h-full object-contain scale-150" />
             </div>
             <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Terminal</h1>
          </div>
          <a href="/" className="bg-white text-[#1b2b1b] px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-[#9caf9c]/20 hover:bg-[#1b2b1b] hover:text-white transition-all shadow-sm">Exit</a>
        </div>

        {/* Analytics - Suspending */}
        <React.Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-pulse h-32 bg-white/50 rounded-2xl"></div>}>
           <StatsSection />
        </React.Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* User Requests - Suspending */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 bg-[#1b2b1b] text-[#9caf9c] rounded-lg flex items-center justify-center text-sm font-black">RQ</span>
              Active Requests
            </h2>
            <React.Suspense fallback={<div className="h-64 bg-white/50 rounded-2xl animate-pulse"></div>}>
               <RequestsList onPrepareQuote={(id) => setSelectedRequestId(id)} />
            </React.Suspense>
          </section>

          {/* Logistics - Suspending */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 bg-[#1b2b1b] text-[#9caf9c] rounded-lg flex items-center justify-center text-sm font-black">OR</span>
              Logistics
            </h2>
            <React.Suspense fallback={<div className="h-64 bg-white/50 rounded-2xl animate-pulse"></div>}>
               <OrdersList onUpdateStatus={updateOrderStatus} />
            </React.Suspense>
          </section>
        </div>

        {/* Inventory Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
             <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 bg-[#1b2b1b] text-[#9caf9c] rounded-lg flex items-center justify-center text-sm font-black">IN</span>
              Inventory Management
            </h2>
            <div className="h-px flex-1 bg-[#9caf9c]/20"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Add Product Form - PERMANENT, NEVER SUSPENDS */}
            <div className="bg-white p-10 rounded-2xl border border-[#9caf9c]/10 shadow-sm h-fit lg:col-span-1">
              <h3 className="text-lg font-black text-[#1b2b1b] mb-8 uppercase tracking-widest">New Manifest</h3>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Product Name" 
                  className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  required
                />
                <textarea 
                  placeholder="Description" 
                  className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  rows={2}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                  >
                    <option value="Watch">Watch</option>
                    <option value="Bag">Bag</option>
                    <option value="E-bike">E-bike</option>
                    <option value="Motorbike">Motorbike</option>
                    <option value="Car">Car</option>
                    <option value="Other">Other</option>
                  </select>
                  <input 
                    type="number" 
                    placeholder="Stock Qty" 
                    className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Year" 
                    className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                    value={newProductYear}
                    onChange={(e) => setNewProductYear(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Condition" 
                    className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                    value={newProductCondition}
                    onChange={(e) => setNewProductCondition(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Serial / VIN" 
                    className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                    value={newProductSerial}
                    onChange={(e) => setNewProductSerial(e.target.value)}
                  />
                   <input 
                    type="text" 
                    placeholder="Mileage (Vehicles)" 
                    className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                    value={newProductMileage}
                    onChange={(e) => setNewProductMileage(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" 
                    placeholder="Price ($)" 
                    className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    required
                  />
                  <input 
                    type="number" 
                    placeholder="Shipping ($)" 
                    className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                    value={newProductShipping}
                    onChange={(e) => setNewProductShipping(e.target.value)}
                    required
                  />
                </div>
                <select 
                  className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                  value={newProductLocation}
                  onChange={(e) => setNewProductLocation(e.target.value as any)}
                >
                  <option value="Local">Local Warehouse</option>
                  <option value="Abroad">Source Abroad</option>
                </select>
                <input 
                  type="url" 
                  placeholder="Image URL" 
                  className="w-full bg-[#f3f7f3] rounded-sm p-4 text-xs font-bold uppercase tracking-widest outline-none border-2 border-transparent focus:border-[#9caf9c] transition-all"
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                />
                <button type="submit" className="w-full bg-[#1b2b1b] text-white py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#9caf9c] transition-all">Publish Item</button>
              </form>
            </div>

            {/* Inventory List - Suspending */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-black text-[#1b2b1b] mb-4 uppercase tracking-widest">Active Inventory</h3>
              <React.Suspense fallback={<div className="grid grid-cols-2 gap-6 animate-pulse"><div className="h-32 bg-white/50 rounded-2xl"></div><div className="h-32 bg-white/50 rounded-2xl"></div></div>}>
                 <InventoryList />
              </React.Suspense>
            </div>
          </div>
        </section>
      </div>

      {/* Quote Modal - PERMANENT */}
      {selectedRequestId && (
        <div className="fixed inset-0 bg-[#1b2b1b]/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-[#1b2b1b] p-8 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-widest">Transmit Quote</h3>
              <button onClick={() => setSelectedRequestId(null)} className="text-white/50 hover:text-white text-3xl font-black">&times;</button>
            </div>
            <form onSubmit={handleRespond} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#9caf9c] mb-4 uppercase tracking-widest">Fulfillment Specs</label>
                <textarea 
                  placeholder="Official product details and condition..." 
                  className="w-full bg-[#f3f7f3] border-2 border-[#f3f7f3] rounded-sm p-4 font-bold text-xs outline-none focus:border-[#9caf9c] transition-all"
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-black text-[#9caf9c] mb-2 uppercase tracking-widest">Price ($)</label>
                   <input 
                    type="number" 
                    className="w-full bg-[#f3f7f3] border-2 border-[#f3f7f3] rounded-sm p-4 font-bold text-xs outline-none focus:border-[#9caf9c] transition-all"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-[#9caf9c] mb-2 uppercase tracking-widest">Shipping ($)</label>
                   <input 
                    type="number" 
                    className="w-full bg-[#f3f7f3] border-2 border-[#f3f7f3] rounded-sm p-4 font-bold text-xs outline-none focus:border-[#9caf9c] transition-all"
                    value={offerShipping}
                    onChange={(e) => setOfferShipping(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1b2b1b] text-white py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#9caf9c] shadow-xl transition-all">Submit Protocol</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Suspending Components

function StatsSection() {
  const { data: stats } = useSuspenseQuery(convexQuery(api.orders.getStats, {}));
  const { data: userCount } = useSuspenseQuery(convexQuery(api.sessions.getCount, {}));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#9caf9c]/10">
        <p className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest mb-2">Aggregate Revenue</p>
        <p className="text-3xl font-black text-[#1b2b1b]">{formatPrice(stats.totalSales)}</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#9caf9c]/10">
        <p className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest mb-2">Total Executed Orders</p>
        <p className="text-3xl font-black text-[#1b2b1b]">{stats.orderCount}</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#9caf9c]/10">
        <p className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest mb-2">Active Protocol Sessions</p>
        <p className="text-3xl font-black text-[#1b2b1b]">{userCount}</p>
      </div>
    </div>
  );
}

function RequestsList({ onPrepareQuote }: { onPrepareQuote: (id: string) => void }) {
  const { data: requests } = useSuspenseQuery(convexQuery(api.requests.listAll, {}));
  
  if (requests.length === 0) return <p className="text-[#9caf9c] font-bold uppercase text-[10px]">Zero requests pending.</p>;
  
  return (
    <div className="space-y-4">
      {requests.map((req: any) => (
        <div key={req._id} className="bg-white p-8 rounded-2xl border border-[#9caf9c]/10 shadow-sm flex flex-col md:flex-row gap-6">
          {req.pictureUrl && (
             <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-[#9caf9c]/10">
                <img src={req.pictureUrl} alt="" className="w-full h-full object-cover" />
             </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest">Session ID</p>
                <p className="text-[#1b2b1b] font-bold text-xs">{req.sessionId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                req.status === 'offer_sent' ? 'bg-[#1b2b1b] text-[#9caf9c]' :
                req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {req.status.replace('_', ' ')}
              </span>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest mb-1">Product Description</p>
              <p className="text-[#1b2b1b] font-bold leading-relaxed">{req.description}</p>
              <p className="text-[10px] text-[#1b2b1b]/50 font-bold uppercase tracking-widest mt-2">Origin: {req.desiredCountry}</p>
            </div>

            {req.status === 'pending' && (
              <button 
                onClick={() => onPrepareQuote(req._id)}
                className="w-full bg-[#1b2b1b] text-white py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#9caf9c] transition-all"
              >
                Prepare Quote
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersList({ onUpdateStatus }: { onUpdateStatus: any }) {
  const { data: orders } = useSuspenseQuery(convexQuery(api.orders.listAll, {}));
  
  if (orders.length === 0) return <p className="text-[#9caf9c] font-bold uppercase text-[10px]">Zero active shipments.</p>;
  
  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <div key={order._id} className="bg-white p-8 rounded-2xl border border-[#9caf9c]/10 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-[#f3f7f3]">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest">Order Payload</p>
              <h4 className="text-[#1b2b1b] font-black uppercase tracking-tight">{order.productDetails.name}</h4>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-[#1b2b1b]">{formatPrice(order.totalAmount)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#9caf9c] uppercase tracking-widest">Protocol Status Update</p>
            <select 
              className="w-full bg-[#f3f7f3] border-2 border-[#f3f7f3] rounded-sm p-4 font-bold text-xs uppercase tracking-widest text-[#1b2b1b] outline-none focus:border-[#9caf9c] transition-all"
              onChange={(e) => onUpdateStatus({ orderId: order._id, status: e.target.value as any })}
              defaultValue={order.orderStatus}
            >
              <option value="payment_confirmed">Payment Confirmed</option>
              <option value="sourcing_in_progress">Sourcing in Progress</option>
              <option value="item_received_warehouse">Item Received at Warehouse</option>
              <option value="shipped_to_ghana">Shipped to Ghana</option>
              <option value="cleared_at_customs">Cleared at Customs</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function InventoryList() {
  const { data: products } = useSuspenseQuery(convexQuery(api.products.listAll, {}));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((p: any) => (
        <div key={p._id} className="bg-white p-6 rounded-2xl border border-[#9caf9c]/10 shadow-sm flex gap-6 items-center">
          <div className="w-24 h-24 bg-[#f3f7f3] rounded-xl overflow-hidden shrink-0 border border-[#9caf9c]/10 relative">
            {p.pictureUrl && <img src={p.pictureUrl} alt="" className="w-full h-full object-cover" />}
            <span className="absolute top-1 left-1 bg-[#1b2b1b] text-[#9caf9c] text-[6px] px-1 font-black rounded-xs">{p.category}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-[#1b2b1b] uppercase tracking-tight text-sm mb-1 truncate">{p.productName}</h4>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-[8px] font-bold text-[#9caf9c] uppercase tracking-widest mb-2">
               {p.year && <span>{p.year}</span>}
               {p.condition && <span>• {p.condition}</span>}
               <span>• STOCK: {p.stock}</span>
            </div>
            <p className="text-lg font-black text-[#1b2b1b]">{formatPrice(p.price)}</p>
            <p className="text-[8px] font-black text-[#9caf9c] uppercase tracking-widest mt-1">Ref: {p._id.substring(0, 8)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
