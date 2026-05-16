import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, ChevronLeft, CheckCircle2, ChevronRight, ShoppingBag, QrCode, Search, X } from 'lucide-react';
import { MENU, TAG_COLORS, MenuItem, MenuCategory } from './data';

interface CartItem {
  cartId: string;
  itemId: string;
  name: string;
  price: number;
  qty: number;
  size?: 'S' | 'M';
}

interface Order {
  id: number;
  items: CartItem[];
  total: number;
  count: number;
  time: string;
}

export default function App() {
  const [activeCat, setActiveCat] = useState(MENU[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dismiss splash
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const navRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Sync scroll
  useEffect(() => {
    if (navRef.current) {
      const activeEl = navRef.current.querySelector(`[data-id="${activeCat}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeCat]);

  useEffect(() => {
    if (cartOpen || counterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [cartOpen, counterOpen]);

  // Derived state
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.qty * i.price, 0), [cart]);
  const activeCategoryData = MENU.find(c => c.id === activeCat);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const query = searchTerm.toLowerCase();
    const results: { category: MenuCategory, item: MenuItem }[] = [];
    MENU.forEach(cat => {
      cat.items.forEach(item => {
        if (item.name.toLowerCase().includes(query) || item.desc?.toLowerCase().includes(query)) {
          results.push({ category: cat, item });
        }
      });
    });
    return results;
  }, [searchTerm]);

  const updateQty = useCallback((cartId: string, delta: number) => {
    setCart(prev => {
      return prev.map(c => c.cartId === cartId ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0);
    });
  }, []);

  const addItem = useCallback((item: MenuItem, size?: 'S' | 'M') => {
    const cid = size ? `${item.id}_${size}` : item.id;
    const price = size ? item.prices![size] : item.price!;
    const name = size ? `${item.name} (${size === 'S' ? 'Small' : 'Medium'})` : item.name;

    setCart(prev => {
      const existing = prev.find(c => c.cartId === cid);
      if (existing) {
        return prev.map(c => c.cartId === cid ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { cartId: cid, itemId: item.id, name, price, qty: 1, size }];
    });
  }, []);

  const getCartItemQty = useCallback((cartId: string) => {
    return cart.find(c => c.cartId === cartId)?.qty || 0;
  }, [cart]);

  const confirmOrder = useCallback(() => {
    if (cartCount === 0) return;
    const snap: Order = {
      id: Date.now(),
      items: [...cart],
      total: cartTotal,
      count: cartCount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setOrders(prev => [...prev, snap]);
    setCart([]);
    setCartOpen(false);
  }, [cart, cartTotal, cartCount]);

  const grandTotal = orders.reduce((s, o) => s + o.total, 0);

  const renderItemCard = (item: MenuItem, category: MenuCategory, idx: number) => {
    if (category.hasSizes && item.prices) {
      return (
        <motion.div 
          layout
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(idx * 0.05, 0.3) + 0.1 }}
          className="bg-bg-card border border-border-dark rounded-2xl p-4 flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              {item.desc && <p className="text-slate-400 text-sm mt-1 leading-snug">{item.desc}</p>}
            </div>
            {searchTerm && (
              <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-slate-400 whitespace-nowrap ml-2">
                {category.label}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['S', 'M'] as const).map(size => {
              const cid = `${item.id}_${size}`;
              const qty = getCartItemQty(cid);
              const price = item.prices![size];
              return (
                <div key={size} className={`flex flex-col border rounded-xl overflow-hidden transition-colors ${qty > 0 ? 'bg-brand-500/10 border-brand-500/30' : 'bg-bg-elevated border-border-dark'}`}>
                   <div className="p-3 pb-2 flex-grow flex flex-col items-center text-center">
                     <div className="text-xs font-bold text-slate-400 tracking-wider mb-1">
                       {size === 'S' ? 'SMALL' : 'MEDIUM'}
                      </div>
                     <div className="font-display font-bold text-xl text-brand-400">₹{price}</div>
                   </div>
                   <div className="px-2 pb-2">
                      {qty > 0 ? (
                        <div className="flex items-center justify-between bg-brand-500 text-white rounded-lg p-1 h-[40px]">
                          <button onClick={() => updateQty(cid, -1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/10 active:bg-black/20 text-white"><Minus size={16} /></button>
                          <span className="font-bold text-sm">{qty}</span>
                          <button onClick={() => updateQty(cid, 1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/10 active:bg-black/20 text-white"><Plus size={16} /></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addItem(item, size)}
                          className="w-full h-[40px] flex items-center justify-center bg-white/5 hover:bg-white/10 active:bg-white/15 text-white font-semibold text-sm rounded-lg transition-colors border border-white/5"
                        >
                          Add +
                        </button>
                      )}
                   </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )
    }

    // Normal Item
    const qty = getCartItemQty(item.id);
    return (
      <motion.div 
        layout
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(idx * 0.05, 0.3) + 0.1 }}
        className="bg-bg-card border border-border-dark rounded-2xl p-4 flex justify-between items-center gap-4 group hover:border-brand-500/20 transition-colors"
      >
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-slate-50">{item.name}</h3>
            {searchTerm && (
              <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-slate-400 whitespace-nowrap ml-2">
                {category.label}
              </span>
            )}
          </div>
          {item.desc && <p className="text-slate-400 text-sm mt-1 leading-snug">{item.desc}</p>}
          <div className="font-display font-bold text-xl text-brand-400 mt-2">₹{item.price}</div>
        </div>
        
        <div className="shrink-0 relative">
          {qty > 0 ? (
            <div className="flex items-center bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/20">
              <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 flex items-center justify-center hover:bg-black/10 active:bg-black/20 rounded-l-xl"><Minus size={18} /></button>
              <span className="w-4 text-center font-bold text-sm bg-transparent pointer-events-none">{qty}</span>
              <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 flex items-center justify-center hover:bg-black/10 active:bg-black/20 rounded-r-xl"><Plus size={18} /></button>
            </div>
          ) : (
            <button 
              onClick={() => addItem(item)}
              className="w-12 h-12 flex items-center justify-center bg-bg-elevated border border-border-dark hover:border-brand-500/30 text-brand-500 rounded-xl transition-all active:scale-95"
            >
              <Plus size={20} className="stroke-[2.5px]" />
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark text-slate-50 font-sans mx-auto max-w-md relative sm:border-x sm:border-border-dark overflow-hidden pb-32">
      
      {/* Header Area */}
      <header className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="pt-6 pb-4 px-6 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-br from-brand-400 to-brand-600 text-transparent bg-clip-text">
                Swaad ki Baithak
              </span>
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
              स्वाद की बैठक • Boisar
            </p>
          </div>
          {orders.length > 0 && (
            <button 
              onClick={() => setCounterOpen(true)}
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-semibold active:scale-95 transition-transform shrink-0"
            >
              <CheckCircle2 size={16} />
              {orders.length} Order{orders.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search for items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Categories Nav */}
        {!searchTerm && (
          <div 
            ref={navRef}
            className="flex overflow-x-auto no-scrollbar py-3 px-4 flex-nowrap gap-2 items-center"
          >
          {MENU.map(cat => {
            const isActive = cat.id === activeCat;
            return (
              <button
                key={cat.id}
                data-id={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 focus:outline-none ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 bg-white/5 hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-brand-500 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="text-base leading-none">{cat.emoji}</span>
                {cat.label}
              </button>
            )
          })}
        </div>
        )}
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="px-4 py-6">
        {searchResults ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="px-2 mb-1">
              <h2 className="text-xl font-display font-bold text-slate-200">Search Results</h2>
              <p className="text-sm text-slate-400 mt-1">Found {searchResults.length} items for "{searchTerm}"</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {searchResults.length > 0 ? searchResults.map((result, idx) => {
                return renderItemCard(result.item, result.category, idx);
              }) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500">
                    <Search size={28} />
                  </div>
                  <p className="text-lg font-semibold text-slate-300">No matching items</p>
                  <p className="text-sm text-slate-500 mt-1">Try searching for something else.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : activeCategoryData ? (
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Category Title */}
            <div className="flex items-center gap-3 px-2 mb-2">
              <span className="text-4xl">{activeCategoryData.emoji}</span>
              <div>
                <h2 className="text-2xl font-display font-bold">{activeCategoryData.label}</h2>
                <div className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${TAG_COLORS[activeCategoryData.tag] || TAG_COLORS['Extras']}`}>
                  {activeCategoryData.tag}
                </div>
              </div>
            </div>

            {activeCategoryData.note && (
              <div className="bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm px-4 py-3 rounded-2xl flex items-start gap-3">
                <div className="mt-0.5">✨</div>
                <div>{activeCategoryData.note}</div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {activeCategoryData.items.map((item, idx) => {
                return renderItemCard(item, activeCategoryData, idx);
              })}
            </div>
          </motion.div>
        ) : null}
      </main>

      {/* Floating Action Button for Cart */}
      <AnimatePresence>
        {cartCount > 0 && !counterOpen && !cartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 left-0 right-0 z-40 px-4 sm:max-w-md mx-auto"
          >
            <button 
              onClick={() => setCartOpen(true)}
              className="w-full bg-brand-500 text-white rounded-2xl h-16 px-6 flex items-center justify-between shadow-[0_8px_32px_-8px_rgba(249,115,22,0.6)] border border-brand-400/30 overflow-hidden relative group active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-4">
                <div className="bg-black/20 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                  {cartCount}
                </div>
                <span className="font-semibold text-lg tracking-wide">View Cart</span>
              </div>
              <div className="relative font-display font-bold text-xl">
                ₹{cartTotal}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-bg-dark/80 backdrop-blur-sm z-50 sm:max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card sm:max-w-md mx-auto rounded-t-3xl border-t border-border-dark flex flex-col shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)]"
              style={{ maxHeight: '85vh' }}
            >
              <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white">Your Cart</h3>
                  <p className="text-brand-300/80 text-sm mt-0.5">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                </div>
                <button 
                  onClick={() => setCart([])}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 active:scale-95 transition-all"
                >
                  Clear all
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2">
                {cart.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-bg-elevated rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="text-border-dark" size={32} />
                    </div>
                    <p className="text-lg font-semibold text-slate-300">Your cart is empty</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-[200px]">Looks like you haven't added anything yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 py-4">
                    {cart.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={item.cartId} 
                        className="flex items-center justify-between p-4 bg-bg-elevated rounded-2xl border border-white/5"
                      >
                        <div className="pr-4 flex-1">
                          <h4 className="font-semibold text-slate-100">{item.name}</h4>
                          <p className="text-brand-300/70 text-sm mt-1">₹{item.price} × {item.qty}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-display font-bold text-lg text-white">₹{item.price * item.qty}</span>
                          <div className="flex items-center bg-bg-dark border border-border-dark rounded-xl">
                            <button onClick={() => updateQty(item.cartId, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 active:bg-white/20 text-slate-300 rounded-l-xl"><Minus size={14} /></button>
                            <span className="w-6 text-center font-bold text-sm bg-transparent pointer-events-none text-white">{item.qty}</span>
                            <button onClick={() => updateQty(item.cartId, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 active:bg-white/20 text-brand-400 rounded-r-xl"><Plus size={14} /></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-bg-dark border-t border-white/5 shrink-0">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-slate-400 font-bold tracking-wider text-sm">TOTAL AMOUNT</span>
                    <span className="font-display font-bold text-3xl text-white">₹{cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      setCounterOpen(true);
                    }}
                    className="w-full bg-brand-500 text-white rounded-2xl h-14 font-semibold text-lg hover:bg-brand-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Counter
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Counter Screen */}
      <AnimatePresence>
        {counterOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-bg-dark sm:max-w-md mx-auto flex flex-col overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative pt-12 px-6 pb-6 shrink-0">
              <button 
                onClick={() => setCounterOpen(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center mb-6 transition-colors border border-white/10"
              >
                <ChevronLeft size={20} className="text-slate-300" />
              </button>
              
              <h2 className="font-display font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 mb-2">
                Order Summary
              </h2>
              <p className="text-brand-300/60 font-medium uppercase tracking-wider text-sm">Show this at the counter</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-6">
              
              {/* Current Pending Cart shown as "New Order" block if not confirmed */}
              {cart.length > 0 && (
                <div className="bg-brand-500/5 border border-brand-500/20 rounded-3xl overflow-hidden">
                  <div className="bg-brand-500/10 px-5 py-4 border-b border-brand-500/20 flex items-center justify-between">
                     <span className="text-brand-400 font-bold text-sm tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                       NEW ITEMS
                     </span>
                     <span className="text-brand-300/50 text-xs font-semibold">Not Confirmed</span>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    {cart.map(item => (
                      <div key={item.cartId} className="px-3 py-3 flex justify-between items-center bg-white/5 rounded-xl">
                        <div className="font-medium text-slate-200 text-[15px]">
                          {item.qty > 1 && <span className="text-brand-500 font-bold mr-2">{item.qty}×</span>}
                          {item.name}
                        </div>
                        <div className="font-display font-medium text-brand-300">₹{item.price * item.qty}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-bg-dark border-t border-brand-500/10 flex gap-2">
                     <button onClick={() => { setCounterOpen(false); setCartOpen(true); }} className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-200 font-semibold text-sm transition-colors">
                       Edit
                     </button>
                     <button onClick={confirmOrder} className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform">
                       Confirm Order
                     </button>
                  </div>
                </div>
              )}

              {/* Confirmed Orders */}
              {orders.length > 0 && (
                 <div className="flex flex-col gap-4">
                   {orders.map((order, oi) => (
                     <div key={order.id} className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
                       <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="relative flex items-center justify-center w-5 h-5">
                             <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                             <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                           </div>
                           <span className="text-emerald-400 font-bold text-[13px] tracking-wide">ORDER {oi + 1} CONFIRMED</span>
                         </div>
                         <span className="text-slate-500 text-xs font-semibold">{order.time}</span>
                       </div>
                       <div className="p-2 flex flex-col gap-1">
                         {order.items.map(item => (
                           <div key={item.cartId} className="px-3 py-3 flex justify-between items-center text-sm">
                             <div className="font-medium text-slate-300">
                               {item.qty > 1 && <span className="text-brand-500/80 mr-2">{item.qty}×</span>}
                               {item.name}
                             </div>
                             <div className="font-display font-medium text-slate-400">₹{item.price * item.qty}</div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
              )}

             {/* Grand Total */}
             {orders.length > 0 && (
                <div className="bg-brand-500/10 border border-brand-500/20 rounded-3xl p-6 flex items-center justify-between mt-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-brand-500/20 blur-2xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                  <div>
                    <div className="text-brand-300/80 text-xs font-bold tracking-widest mb-1">GRAND TOTAL</div>
                    <div className="text-brand-300/60 text-sm font-medium">{orders.reduce((s, o) => s + o.count, 0)} items confirmed</div>
                  </div>
                  <div className="font-display font-bold text-4xl text-brand-400">
                    ₹{grandTotal}
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-dark via-bg-dark to-transparent pt-12 flex gap-3">
               <button onClick={() => setCounterOpen(false)} className="flex-1 h-14 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold active:scale-[0.98] transition-all">
                 + Add More
               </button>
               {orders.length > 0 && cart.length === 0 && (
                 <button onClick={() => { setShowPayment(true); }} className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-all">
                   Pay Bill (₹{grandTotal})
                 </button>
               )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-bg-dark flex flex-col items-center justify-center"
          >
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-center"
            >
              <div className="w-24 h-24 mx-auto bg-brand-500/10 rounded-3xl flex items-center justify-center mb-6 border border-brand-500/20 relative overflow-hidden shadow-2xl shadow-brand-500/20">
                <motion.div 
                  className="absolute inset-0 border-b-2 border-brand-500 bg-brand-500/20"
                  initial={{ top: "-100%" }}
                  animate={{ top: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
                <QrCode size={40} className="text-brand-400 relative z-10" />
              </div>
              <h1 className="font-display font-bold text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-brand-300 to-brand-600 mb-2">
                Swaad ki Baithak
              </h1>
              <p className="text-brand-300/60 uppercase tracking-widest text-sm font-semibold">
                <motion.span 
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                >
                  Scanning Menu QR...
                </motion.span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Screen */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg-dark/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-bg-card border border-border-dark w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-brand-500/20 blur-[50px] rounded-full pointer-events-none" />
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                 className="w-20 h-20 mx-auto bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6"
               >
                 <CheckCircle2 size={40} className="stroke-[2.5px]" />
               </motion.div>
               <h2 className="font-display font-bold text-2xl text-white mb-2">Proceed to Counter</h2>
               <p className="text-slate-400 text-sm mb-8">Please complete your payment of <span className="text-brand-400 font-bold text-base">₹{grandTotal}</span> at the counter to finish.</p>
               
               <button 
                 onClick={() => {
                   setShowPayment(false);
                   setOrders([]);
                   setCounterOpen(false);
                   setShowSplash(true);
                   setActiveCat(MENU[0].id);
                 }}
                 className="w-full bg-brand-500 text-white rounded-2xl h-14 font-semibold text-lg hover:bg-brand-400 active:scale-[0.98] transition-all flex items-center justify-center"
               >
                 Done, Thank You!
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
