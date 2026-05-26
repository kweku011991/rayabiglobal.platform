import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f7f3] font-sans text-[#1b2b1b] selection:bg-[#9caf9c] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#f3f7f3]/80 backdrop-blur-md z-50 border-b border-[#9caf9c]/20">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1b2b1b] flex items-center justify-center overflow-hidden shadow-md">
               <img src="https://i.postimg.cc/g0NZcdqH/logo-png.png" alt="Rayabiglobal Logo" className="w-full h-full object-contain scale-150" />
            </div>
            <div className="text-2xl font-black tracking-tighter text-[#1b2b1b]">rayabiglobal</div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-bold text-[10px] uppercase tracking-[0.2em] text-[#9caf9c]">
            <a href="#how-it-works" className="hover:text-[#1b2b1b] transition">How It Works</a>
            <a href="#features" className="hover:text-[#1b2b1b] transition">Benefits</a>
            <a href="#testimonials" className="hover:text-[#1b2b1b] transition">Reviews</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard"
              className="hidden sm:block bg-[#9caf9c] text-white px-8 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-[#1b2b1b] transition-all active:scale-95 shadow-sm"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50"
            >
              <span className={`w-6 h-0.5 bg-[#1b2b1b] transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#1b2b1b] transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#1b2b1b] transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-[#1b2b1b] transition-all duration-500 z-40 flex flex-col items-center justify-center gap-8 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-[#9caf9c] text-2xl font-black uppercase tracking-widest hover:text-white transition-colors">How It Works</a>
           <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-[#9caf9c] text-2xl font-black uppercase tracking-widest hover:text-white transition-colors">Benefits</a>
           <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-[#9caf9c] text-2xl font-black uppercase tracking-widest hover:text-white transition-colors">Reviews</a>
           <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="bg-[#9caf9c] text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl">Dashboard</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-full max-w-4xl h-full -z-10 pointer-events-none">
          {/* Decorative Green Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#9caf9c]/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#9caf9c]/10 rounded-full border border-[#9caf9c]/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#9caf9c]/20 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center md:text-left md:flex items-center gap-12 relative">
          <div className="md:w-1/2 relative">
            {/* Logo Watermark */}
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] opacity-[0.03] pointer-events-none -z-10">
               <img src="https://i.postimg.cc/g0NZcdqH/logo-png.png" alt="" className="w-full h-full object-contain" />
            </div>
            <div className="inline-block px-4 py-1 mb-8 rounded-full bg-[#9caf9c] text-white text-[10px] font-black uppercase tracking-[0.2em]">
              USA, UK, Dubai & China to Ghana
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-10 uppercase">
              Import <br/>
              <span className="text-[#9caf9c]">Anything.</span>
            </h1>
            <p className="max-w-md text-lg text-[#1b2b1b]/70 mb-12 leading-relaxed font-medium">
              Import premium cars, motorbikes, e-bikes, and luxury accessories. We source, ship, and handle all protocols for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/dashboard"
                search={{ newRequest: true }}
                className="w-full sm:w-auto bg-[#1b2b1b] text-white px-12 py-5 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-[#9caf9c] transition-all shadow-xl"
              >
                Start Importing Now
              </Link>
              <a 
                href="#how-it-works"
                className="w-full sm:w-auto text-[#1b2b1b] border-2 border-[#1b2b1b]/10 px-12 py-5 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1b2b1b]/5 transition-all"
              >
                How It Works
              </a>
            </div>
          </div>
          <div className="hidden md:block md:w-1/2 relative">
             <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1631215539594-576290326ec2?w=800&auto=format&fit=crop" alt="luxury vehicle" className="w-full h-full object-cover grayscale contrast-125" />
             </div>
          </div>
        </div>
      </section>

      {/* Categories / Grid */}
      <section className="py-24 bg-[#1b2b1b] text-white overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase leading-[0.9]">Explore <br/> <span className="text-[#9caf9c]">Inventory.</span></h2>
              <p className="text-[#9caf9c] text-sm font-bold uppercase tracking-[0.2em]">Our core in-store categories.</p>
            </div>
            <Link to="/dashboard" className="bg-[#9caf9c] text-white px-10 py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-[#1b2b1b] transition-all">Go to Shop</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Cars', icon: '🏎️', cat: 'Car' },
              { name: 'Motorbikes', icon: '🏍️', cat: 'Motorbike' },
              { name: 'E-bikes', icon: '🚲', cat: 'E-bike' },
              { name: 'Watches', icon: '⌚', cat: 'Watch' },
              { name: 'Luxury Bags', icon: '👜', cat: 'Bag' },
              { name: 'Other', icon: '📦', cat: 'Other' }
            ].map((cat, i) => (
              <Link key={i} to="/dashboard" search={{ category: cat.cat }} className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:bg-[#9caf9c] transition-all cursor-pointer group text-center">
                <div className="text-2xl mb-4 group-hover:scale-125 transition-transform">{cat.icon}</div>
                <div className="font-black text-[10px] uppercase tracking-widest">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Simple Process</h2>
            <p className="text-[#9caf9c] font-bold uppercase text-[10px] tracking-[0.3em]">Three Steps to global trade</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Request", 
                desc: "Tell us exactly what you want—be it a car, bike, or luxury item." 
              },
              { 
                step: "02", 
                title: "Quote", 
                desc: "Receive a complete landing cost quote including duties and shipping." 
              },
              { 
                step: "03", 
                title: "Receive", 
                desc: "Pay securely on the portal and track your item to your doorstep." 
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-2xl border border-[#9caf9c]/10 hover:shadow-2xl transition-all group">
                <div className={`text-6xl font-black text-[#1b2b1b]/20 mb-8 transition-colors ${
                  i === 0 ? "group-hover:text-[#9caf9c]" : 
                  i === 1 ? "group-hover:text-[#9caf9c]" : 
                  "group-hover:text-[#9caf9c]"
                }`}>{item.step}</div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-[#1b2b1b]/60 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white/30 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Client Reviews</h2>
            <p className="text-[#9caf9c] font-bold uppercase text-[10px] tracking-[0.3em]">Verified Luxury Importers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: "Gideon Obeng", 
                role: "Car Importer", 
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
                text: "The most seamless way to get a vehicle from Dubai to Accra. No hidden fees, just pure professionalism." 
              },
              { 
                name: "Isaac Agyapong", 
                role: "Watch Collector", 
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
                text: "Sourced my Rolex through Rayabiglobal. The tracking timeline kept me at peace throughout the process." 
              },
              { 
                name: "Salifu Sornee", 
                role: "Business Owner", 
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
                text: "We use them for our company mobility needs. Direct sourcing from UK saved us nearly 20% on landing costs." 
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl border border-[#9caf9c]/10 shadow-sm relative group aspect-square flex flex-col justify-center">
                <div className="text-4xl text-[#9caf9c]/20 absolute top-8 right-8 font-serif italic">"</div>
                <p className="text-[#1b2b1b]/70 italic mb-8 font-medium relative z-10 leading-relaxed text-sm md:text-base">
                  {item.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1b2b1b] flex-shrink-0 overflow-hidden shadow-md border-2 border-[#9caf9c]/20">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover grayscale contrast-125"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest text-[#1b2b1b]">{item.name}</h4>
                    <p className="text-[8px] font-bold text-[#9caf9c] uppercase tracking-widest">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 divide-x divide-[#9caf9c]/20">
            {[
              { icon: "🌍", title: "Direct Source", desc: "No middle-men. Direct from foreign dealers." },
              { icon: "🛡️", title: "Secure Pay", desc: "Digital escrow and secure checkout." },
              { icon: "🏎️", title: "Mobility", desc: "Specialized vehicle shipping experts." },
              { icon: "✅", title: "Verified", desc: "All items inspected before shipment." }
            ].map((f, i) => (
              <div key={i} className="px-8 text-center md:text-left">
                <div className="text-3xl mb-6">{f.icon}</div>
                <h4 className="text-lg font-black mb-2 uppercase tracking-tight">{f.title}</h4>
                <p className="text-[10px] text-[#9caf9c] font-bold uppercase tracking-widest leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-[#9caf9c]/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 relative">
            <div className="absolute right-0 bottom-0 w-64 h-64 opacity-[0.02] pointer-events-none -z-10">
               <img src="https://i.postimg.cc/g0NZcdqH/logo-png.png" alt="" className="w-full h-full object-contain" />
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#1b2b1b] flex items-center justify-center overflow-hidden shadow-lg">
                   <img src="https://i.postimg.cc/g0NZcdqH/logo-png.png" alt="" className="w-full h-full object-contain scale-150" />
                </div>
                <div className="text-2xl font-black text-[#1b2b1b] tracking-tighter uppercase">RAYABIGLOBAL</div>
              </div>
              <p className="text-[#9caf9c] leading-relaxed font-bold uppercase text-[10px] tracking-widest max-w-xs">The ultimate bridge to luxury mobility and global markets. From foreign showrooms to your garage in Ghana.</p>
            </div>
            <div>
              <h5 className="font-black mb-6 uppercase tracking-widest text-[10px]">Support</h5>
              <div className="space-y-4 text-[#1b2b1b]/50 text-[10px] font-bold uppercase tracking-widest">
                <p>rayabiglobal@gmail.com</p>
                <a href="https://wa.me/233539957349" className="block text-[#9caf9c] hover:underline">WhatsApp Portal</a>
              </div>
            </div>
            <div>
              <h5 className="font-black mb-6 uppercase tracking-widest text-[10px]">Access</h5>
              <div className="space-y-4 text-[#1b2b1b]/50 text-[10px] font-bold uppercase tracking-widest">
                <Link to="/dashboard" className="block hover:text-[#1b2b1b]">Dashboard</Link>
                <Link 
                  to="/admin"
                  className="hover:text-[#1b2b1b]"
                >
                  Admin Terminal
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center text-[#9caf9c] text-[8px] font-black uppercase tracking-[0.5em]">
            &copy; 2024 rayabiglobal / ACCRA MOBILITY PROTOCOLS
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a 
        href="https://api.whatsapp.com/send?phone=233539957349" 
        className="fixed bottom-8 right-8 bg-[#1b2b1b] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#9caf9c] hover:scale-110 transition-all z-50 group border-2 border-white/20"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.328-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
