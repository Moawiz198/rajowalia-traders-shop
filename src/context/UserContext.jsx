import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Global modals open/close states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('luxeUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        syncUserData(user.id);
      } catch (err) {
        console.error('Error loading saved user session:', err);
      }
    }
  }, []);

  const syncUserData = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      // 1. Fetch Cart Items
      const { data: cartData, error: cartErr } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('customer_id', userId);
      
      if (!cartErr && cartData) {
        setCart(cartData
          .filter(item => item.product) // skip orphaned items
          .map(item => ({
            id: item.id,
            productId: item.product_id,
            quantity: Number(item.quantity) || 1,
            selectedWeight: (item.selected_weight && isNaN(Number(item.selected_weight))) ? item.selected_weight : null,
            product: {
              id: item.product.id,
              name: item.product.name,
              brand: item.product.brand,
              price: Number(item.product.price),
              emoji: item.product.emoji,
              image: item.product.image,
              inStock: item.product.in_stock,
              weightOptions: item.product.weight_options || ''
            }
          })));
      }

      // 2. Fetch Wishlist Items
      const { data: wishData, error: wishErr } = await supabase
        .from('wishlist_items')
        .select('*, product:products(*)')
        .eq('customer_id', userId);
      
      if (!wishErr && wishData) {
        setWishlist(wishData.map(item => ({
          id: item.id,
          productId: item.product_id,
          product: {
            id: item.product.id,
            name: item.product.name,
            brand: item.product.brand,
            price: Number(item.product.price),
            emoji: item.product.emoji,
            image: item.product.image,
            inStock: item.product.in_stock
          }
        })));
      }

      // 3. Fetch Orders history
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (!orderErr && orderData) {
        setOrders(orderData);
      }
    } catch (err) {
      console.error('Failed to sync user database state:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (profile) => {
    setLoading(true);
    try {
      // Create new customer
      const { data: created, error: insertErr } = await supabase
        .from('customers')
        .insert([{
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          password: profile.password || null,
          total_orders: 0
        }])
        .select();

      if (insertErr) throw insertErr;
      
      let user = null;
      if (created && created[0]) {
        user = created[0];
      }

      if (user) {
        localStorage.setItem('luxeUser', JSON.stringify(user));
        setCurrentUser(user);
        await syncUserData(user.id);
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
        setAuthModalOpen(false);
        return { success: true, user };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      console.error('Registration failed, using fallback:', err.message);
      alert('Database Save Error: ' + err.message + '\n\nPlease make sure you have run the ALTER TABLE sql commands in your Supabase SQL Editor to add the password column!');
      const fallbackUser = {
        id: Date.now(),
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        password: profile.password || null,
        isFallback: true
      };
      localStorage.setItem('luxeUser', JSON.stringify(fallbackUser));
      setCurrentUser(fallbackUser);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      setAuthModalOpen(false);
      return { success: true, user: fallbackUser };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Find customer by email or phone
      const { data: existing, error: findErr } = await supabase
        .from('customers')
        .select('*')
        .or(`email.eq.${email},phone.eq.${email}`)
        .limit(1);

      if (findErr) throw findErr;

      if (!existing || existing.length === 0) {
        return { success: false, error: 'No account found with this email or phone.' };
      }

      const user = existing[0];
      
      // Check password if it is set in DB
      if (user.password && user.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      localStorage.setItem('luxeUser', JSON.stringify(user));
      setCurrentUser(user);
      await syncUserData(user.id);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      setAuthModalOpen(false);
      return { success: true, user };
    } catch (err) {
      console.error('Login failed:', err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const registerOrLogin = async (profile) => {
    return await signUp(profile);
  };

  const logout = () => {
    localStorage.removeItem('luxeUser');
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
  };

  const requireAuth = (action) => {
    if (currentUser) {
      action();
    } else {
      setPendingAction(() => action);
      setAuthModalOpen(true);
    }
  };

  const addToCart = async (product, selectedWeight = null, qty = 1) => {
    if (!currentUser) return;
    const existingIndex = cart.findIndex(item => item.productId === product.id && item.selectedWeight === selectedWeight);

    if (existingIndex > -1) {
      // Update quantity
      const newQty = cart[existingIndex].quantity + qty;
      setCart(prev => prev.map((item, idx) => idx === existingIndex ? { ...item, quantity: newQty } : item));
      
      try {
        await supabase
          .from('cart_items')
          .update({ quantity: newQty })
          .match({ customer_id: currentUser.id, product_id: product.id, selected_weight: selectedWeight });
      } catch (err) {
        console.error('Failed to update DB cart quantity:', err);
      }
    } else {
      // Add new item
      const newItem = { productId: product.id, quantity: qty, selectedWeight, product };
      setCart(prev => [...prev, newItem]);

      try {
        await supabase
          .from('cart_items')
          .upsert(
            [{ customer_id: currentUser.id, product_id: product.id, selected_weight: selectedWeight || null, quantity: qty }],
            { onConflict: 'customer_id,product_id,selected_weight', ignoreDuplicates: false }
          );
      } catch (err) {
        console.error('Failed to insert cart item in DB:', err);
      }
    }
  };

  const updateCartQuantity = async (productId, nextQty, selectedWeight = null) => {
    if (nextQty <= 0) {
      removeFromCart(productId, selectedWeight);
      return;
    }
    setCart(prev => prev.map(item => (item.productId === productId && item.selectedWeight === selectedWeight) ? { ...item, quantity: nextQty } : item));
    try {
      await supabase
        .from('cart_items')
        .update({ quantity: nextQty })
        .match({ customer_id: currentUser.id, product_id: productId, selected_weight: selectedWeight });
    } catch (err) {
      console.error('Failed to update DB cart quantity:', err);
    }
  };

  const removeFromCart = async (productId, selectedWeight = null) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.selectedWeight === selectedWeight)));
    try {
      await supabase
        .from('cart_items')
        .delete()
        .match({ customer_id: currentUser.id, product_id: productId, selected_weight: selectedWeight });
    } catch (err) {
      console.error('Failed to delete DB cart item:', err);
    }
  };

  const toggleWishlist = async (product) => {
    if (!currentUser) return;
    const isStarred = wishlist.some(item => item.productId === product.id);

    if (isStarred) {
      // Remove
      setWishlist(prev => prev.filter(item => item.productId !== product.id));
      try {
        await supabase
          .from('wishlist_items')
          .delete()
          .match({ customer_id: currentUser.id, product_id: product.id });
      } catch (err) {
        console.error('Failed to delete wishlist item in DB:', err);
      }
    } else {
      // Add to wishlist
      const newItem = { productId: product.id, product };
      setWishlist(prev => [...prev, newItem]);
      try {
        await supabase
          .from('wishlist_items')
          .upsert(
            [{ customer_id: currentUser.id, product_id: product.id }],
            { onConflict: 'customer_id,product_id', ignoreDuplicates: true }
          );
      } catch (err) {
        console.error('Failed to insert wishlist item in DB:', err);
      }
    }
  };

  const [deliveryFee, setDeliveryFee] = useState(300);

  useEffect(() => {
    const calculateDeliveryFee = async () => {
      if (!currentUser || cart.length === 0) {
        setDeliveryFee(300);
        return;
      }
      
      const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      if (totalPrice > 3000) {
        setDeliveryFee(0);
        return;
      }

      const loc = (currentUser.location || '').toLowerCase().replace(/\s+/g, '');
      const isRYK = loc.includes('rahim') || loc.includes('ryk');

      // Check if this customer has placed an order in the last 24 hours
      let hasRecentOrder = false;
      try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        if (currentUser.id && !currentUser.isFallback) {
          const { data: dbOrders, error } = await supabase
            .from('orders')
            .select('created_at')
            .eq('customer_id', currentUser.id)
            .gte('created_at', twentyFourHoursAgo);
          
          if (!error && dbOrders && dbOrders.length > 0) {
            hasRecentOrder = true;
          }
        }

        const saved = localStorage.getItem('luxeOrders');
        if (saved) {
          const list = JSON.parse(saved);
          const threshold = Date.now() - 24 * 60 * 60 * 1000;
          const localRecent = list.some(o => {
            const isSameUser = o.customer === currentUser.name;
            const orderTime = o.created_at ? new Date(o.created_at).getTime() : Date.now();
            return isSameUser && orderTime > threshold;
          });
          if (localRecent) {
            hasRecentOrder = true;
          }
        }
      } catch (err) {
        console.warn('Error checking 24h order limit for fee:', err);
      }

      if (hasRecentOrder) {
        setDeliveryFee(0);
      } else {
        setDeliveryFee(isRYK ? 100 : 300);
      }
    };

    calculateDeliveryFee();
  }, [cart, currentUser]);

  const checkoutCart = async (paymentMethod = 'COD') => {
    if (!currentUser || cart.length === 0) return false;
    try {
      // 1. Real-time Stock Verification (resilient to connection errors)
      for (const item of cart) {
        try {
          const { data: latestProduct, error: stockErr } = await supabase
            .from('products')
            .select('stock, name, in_stock')
            .eq('id', item.productId)
            .limit(1);

          if (!stockErr && latestProduct && latestProduct[0]) {
            const latest = latestProduct[0];
            const currentStock = latest.stock === null || latest.stock === undefined ? 10 : Number(latest.stock);
            if (latest.in_stock === false || currentStock <= 0) {
              alert(`Sorry! "${item.product.name}" is now out of stock. Someone else placed an order for it first!`);
              return false;
            }
            if (item.quantity > currentStock) {
              alert(`Sorry! Only ${currentStock} units of "${item.product.name}" are left. Please reduce your cart quantity.`);
              return false;
            }
          }
        } catch (e) {
          console.warn('Real-time stock check bypassed (Supabase offline):', e.message);
        }
      }

      // 2. If stock check passed, subtract the quantities from database (wrap in try-catch so it doesn't block order placement)
      for (const item of cart) {
        try {
          const { data: latestProduct } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.productId)
            .limit(1);
          
          const latest = latestProduct && latestProduct[0];
          if (latest) {
            const currentStock = latest.stock === null || latest.stock === undefined ? 10 : Number(latest.stock);
            const newStock = Math.max(0, currentStock - item.quantity);
            const inStockVal = newStock > 0;
            await supabase
              .from('products')
              .update({ stock: newStock, in_stock: inStockVal })
              .eq('id', item.productId);
          }
        } catch (e) {
          console.warn('Failed to update DB stock counts:', e.message);
        }
      }

      // Group items description and price
      const getWeightFactor = (weightLabel) => {
        if (!weightLabel) return 1;
        const clean = weightLabel.toLowerCase().trim();
        const kgMatch = clean.match(/^([0-9.]+)\s*kg$/);
        if (kgMatch) return parseFloat(kgMatch[1]);
        const gMatch = clean.match(/^([0-9.]+)\s*(g|gm|grams)$/);
        if (gMatch) return parseFloat(gMatch[1]) / 1000;
        return 1;
      };

      const itemNames = cart.map(item => {
        let sw = item.selectedWeight || '';
        if (sw.includes(' ||| CUSTOM_DESIGN ||| ')) {
          const parts = sw.split(' ||| CUSTOM_DESIGN ||| ');
          sw = parts[0] + ' [Custom Design]';
        }
        return `${item.product.name}${sw ? ` (${sw})` : ''} x${item.quantity}`;
      }).join(', ');
      
      const getSizeAddend = (weightLabel) => {
        if (!weightLabel) return 0;
        
        let actualLabel = weightLabel;
        let customAddend = 0;
        if (actualLabel.includes(' ||| CUSTOM_DESIGN ||| ')) {
          actualLabel = actualLabel.split(' ||| CUSTOM_DESIGN ||| ')[0];
          customAddend = 500;
        }
        
        if (actualLabel.includes(':')) {
          const parts = actualLabel.split(':');
          const customPrice = parseFloat(parts[parts.length - 1]);
          if (!isNaN(customPrice)) return customPrice + customAddend;
        }

        const clean = actualLabel.toLowerCase().trim();
        if (clean === 'xl' || clean === 'xxl') return 300 + customAddend;

        const canvasSteps = {
          '4x4': 0, '6x6': 50, '8x8': 100, '8x10': 150, 
          '10x10': 200, '10x12': 250, '12x12': 300, '12x16': 350, 
          '12x18': 400, '16x20': 450, '18x24': 500, '24x36': 550
        };
        if (canvasSteps[clean] !== undefined) return canvasSteps[clean] + customAddend;

        return customAddend;
      };

      const totalPrice = cart.reduce((sum, item) => {
        const factor = getWeightFactor(item.selectedWeight);
        const addend = getSizeAddend(item.selectedWeight);
        const itemPrice = ((Number(item.product?.price) || 0) * factor) + addend;
        return sum + (itemPrice * (Number(item.quantity) || 1));
      }, 0);

      const orderId = `#LX-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // If customer is fallback (local-only), we pass customer_id as null to satisfy foreign key constraints.
      const parsedId = Number(currentUser.id);
      const isTempId = !isNaN(parsedId) && parsedId > 100000;
      const dbCustomerId = (currentUser.isFallback || isTempId) ? null : currentUser.id;
      
      const newOrder = {
        id: orderId,
        customer_id: dbCustomerId,
        customer: currentUser.name,
        location: currentUser.location,
        sector: cart[0].product.category || 'General',
        item: itemNames,
        price: totalPrice + deliveryFee,
        method: paymentMethod,
        status_icon: '📦',
        status_text: 'Order Placed',
        created_at: new Date().toISOString()
      };

      // 3. Create order in Supabase
      try {
        const { error: ordErr } = await supabase.from('orders').insert([newOrder]);
        if (ordErr) throw ordErr;
      } catch (err) {
        console.warn('Database order insert failed, saving to localStorage:', err.message);
        const saved = localStorage.getItem('luxeOrders') || '[]';
        const list = JSON.parse(saved);
        list.unshift(newOrder);
        localStorage.setItem('luxeOrders', JSON.stringify(list));
      }

      // Send Email Notification (non-blocking)
      const sendEmailNotification = async () => {
        let apiKey = import.meta.env.VITE_WEB3FORMS_KEY;
        try {
          const { data: dbSettings } = await supabase.from('settings').select('value').eq('key', 'web3formsKey').limit(1);
          if (dbSettings && dbSettings[0] && dbSettings[0].value) {
            apiKey = dbSettings[0].value;
          }
        } catch (e) {
          console.warn('Failed to load web3formsKey setting from Supabase:', e);
        }

        if (apiKey) {
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_key: apiKey,
              subject: `New Order Received - ${orderId}`,
              from_name: 'Rajowalia Storefront',
              to_email: 'rajowaliaryk@gmail.com',
              message: `
🎉 NEW ORDER RECEIVED!

📦 Order Details:
---------------------------------------------
Order ID:       ${orderId}
Category/Dept:  ${newOrder.sector}
Payment Method: ${newOrder.method}
Total Price:    PKR ${newOrder.price.toLocaleString()}

👤 Customer Details:
---------------------------------------------
Name:           ${newOrder.customer}
Phone:          ${currentUser.phone || 'N/A'}
Email:          ${currentUser.email || 'N/A'}
City/Address:   ${newOrder.location}

🛒 Items Ordered:
---------------------------------------------
${newOrder.item}

---------------------------------------------
Please process this order in your admin panel.
              `
            })
          }).catch(err => console.error('Failed to dispatch order email:', err));
        }
      };

      sendEmailNotification();

      // 4. Clear user cart in DB
      try {
        await supabase.from('cart_items').delete().eq('customer_id', currentUser.id);
      } catch (err) {
        console.warn('Failed to clear cart items in DB:', err.message);
      }

      // 5. Increment total orders for customer
      try {
        const { data: custRecord } = await supabase.from('customers').select('total_orders').eq('id', currentUser.id);
        const prevCount = custRecord && custRecord[0] ? Number(custRecord[0].total_orders || 0) : 0;
        await supabase.from('customers').update({ total_orders: prevCount + 1 }).eq('id', currentUser.id);
      } catch (err) {
        console.warn('Failed to update total orders count in DB:', err.message);
      }

      // 6. Update local states
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      return true;
    } catch (err) {
      console.error('Checkout failed:', err.message);
      alert('Checkout failed: ' + err.message);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      cart,
      wishlist,
      orders,
      loading,
      authModalOpen,
      setAuthModalOpen,
      requireAuth,
      registerOrLogin,
      signUp,
      signIn,
      logout,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      toggleWishlist,
      checkoutCart,
      deliveryFee,
      syncUserData,
      cartOpen,
      setCartOpen,
      wishlistOpen,
      setWishlistOpen,
      ordersOpen,
      setOrdersOpen
    }}>
      {children}
    </UserContext.Provider>
  );
};
