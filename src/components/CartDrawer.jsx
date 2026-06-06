import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateCartQuantity, removeFromCart, checkoutCart, currentUser, setAuthModalOpen } = useContext(UserContext);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    setLoading(true);
    const success = await checkoutCart(paymentMethod);
    setLoading(false);
    if (success) {
      setCheckoutSuccess(true);
    }
  };

  const handleClose = () => {
    setCheckoutSuccess(false);
    onClose();
  };

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()} style={{ color: '#fff' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '1px', margin: 0 }}>Shopping Cart</h2>
          <button onClick={handleClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {checkoutSuccess ? (
          /* Success Screen */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '64px' }}>🎉</span>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '32px', color: '#4ade80' }}>ORDER PLACED SUCCESSFULLY!</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Your order has been registered in the database.<br />
              Thank you for shopping with us!
            </p>
            <button onClick={handleClose} className="hq-btn" style={{ width: '100%', padding: '12px' }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Normal Cart Items Drawer */
          <>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '5px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '48px', display: 'block' }}>🛒</span>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, marginBottom: '6px' }}>Your cart is empty</div>
                    {!currentUser && <div style={{ fontSize: '13px', color: '#64748b' }}>Sign in to sync your cart and place orders</div>}
                  </div>
                  {!currentUser && (
                    <button 
                      onClick={() => { onClose(); setAuthModalOpen(true); }} 
                      className="hq-btn" 
                      style={{ padding: '10px 20px', fontSize: '13px', width: 'auto' }}
                    >
                      Sign In Now
                    </button>
                  )}
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {/* Image / Emoji */}
                    <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '24px' }}>{item.product.emoji}</span>
                      )}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{item.product.name}</div>
                      <div style={{ fontSize: '12px', color: '#ffd700', fontWeight: 'bold', marginTop: '3px' }}>PKR {item.product.price.toLocaleString()}</div>
                    </div>
                    {/* Quantity selectors */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>
                      <button onClick={() => updateCartQuantity(item.productId, item.quantity - 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>-</button>
                      <span style={{ fontSize: '13px', fontWeight: 600, width: '15px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.productId, item.quantity + 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>+</button>
                    </div>
                    {/* Delete button */}
                    <button onClick={() => removeFromCart(item.productId)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              /* Footer / Checkout Form */
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#ffd700' }}>PKR {totalPrice.toLocaleString()}</span>
                </div>

                {/* Payment method selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Method</label>
                  <select 
                    value={paymentMethod} 
                    onChange={e => setPaymentMethod(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="PREPAID">Prepaid Bank Transfer</option>
                  </select>
                </div>

                <button 
                  onClick={handleCheckout} 
                  className="hq-btn" 
                  disabled={loading}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}
                >
                  {loading ? 'PROCESSING ORDER...' : 'PLACE ORDER'}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
