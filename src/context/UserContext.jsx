import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Deferred authentication states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

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
        setCart(cartData.map(item => ({
          id: item.id,
          productId: item.product_id,
          quantity: item.quantity,
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
      const fallbackUser = {
        id: Date.now(),
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        password: profile.password || null
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

  const addToCart = async (product) => {
    if (!currentUser) return;
    const existingIndex = cart.findIndex(item => item.productId === product.id);

    if (existingIndex > -1) {
      // Update quantity
      const newQty = cart[existingIndex].quantity + 1;
      setCart(prev => prev.map(item => item.productId === product.id ? { ...item, quantity: newQty } : item));
      
      try {
        await supabase
          .from('cart_items')
          .update({ quantity: newQty })
          .match({ customer_id: currentUser.id, product_id: product.id });
      } catch (err) {
        console.error('Failed to update DB cart quantity:', err);
      }
    } else {
      // Add new item
      const newItem = { productId: product.id, quantity: 1, product };
      setCart(prev => [...prev, newItem]);

      try {
        await supabase
          .from('cart_items')
          .insert([{ customer_id: currentUser.id, product_id: product.id, quantity: 1 }]);
      } catch (err) {
        console.error('Failed to insert cart item in DB:', err);
      }
    }
  };

  const updateCartQuantity = async (productId, nextQty) => {
    if (nextQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity: nextQty } : item));
    try {
      await supabase
        .from('cart_items')
        .update({ quantity: nextQty })
        .match({ customer_id: currentUser.id, product_id: productId });
    } catch (err) {
      console.error('Failed to update DB cart quantity:', err);
    }
  };

  const removeFromCart = async (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    try {
      await supabase
        .from('cart_items')
        .delete()
        .match({ customer_id: currentUser.id, product_id: productId });
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
      // Add
      const newItem = { productId: product.id, product };
      setWishlist(prev => [...prev, newItem]);
      try {
        await supabase
          .from('wishlist_items')
          .insert([{ customer_id: currentUser.id, product_id: product.id }]);
      } catch (err) {
        console.error('Failed to insert wishlist item in DB:', err);
      }
    }
  };

  const checkoutCart = async (paymentMethod = 'COD') => {
    if (!currentUser || cart.length === 0) return false;
    try {
      // Group items description and price
      const itemNames = cart.map(item => `${item.product.name} x${item.quantity}`).join(', ');
      const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      const orderId = `#LX-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: orderId,
        customer_id: currentUser.id,
        customer: currentUser.name,
        location: currentUser.location,
        sector: cart[0].product.category || 'General',
        item: itemNames,
        price: totalPrice,
        method: paymentMethod,
        status_icon: '📦',
        status_text: 'Order Placed'
      };

      // 1. Create order
      const { error: ordErr } = await supabase.from('orders').insert([newOrder]);
      if (ordErr) throw ordErr;

      // Send Email Notification (non-blocking)
      const apiKey = import.meta.env.VITE_WEB3FORMS_KEY;
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

      // 2. Clear user cart in DB
      await supabase.from('cart_items').delete().eq('customer_id', currentUser.id);

      // 3. Increment total orders for customer
      const { data: custRecord } = await supabase.from('customers').select('total_orders').eq('id', currentUser.id);
      const prevCount = custRecord && custRecord[0] ? Number(custRecord[0].total_orders || 0) : 0;
      await supabase.from('customers').update({ total_orders: prevCount + 1 }).eq('id', currentUser.id);

      // 4. Update local states
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
      syncUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};
