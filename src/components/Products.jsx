import React, { useState, useContext } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ProductContext } from '../context/ProductContext';
import { UserContext } from '../context/UserContext';

export default function Products({ selectedCategory }) {
  useScrollReveal();
  const { products } = useContext(ProductContext);
  const { wishlist, toggleWishlist, addToCart } = useContext(UserContext);

  // State to manage button text/style temporarily when clicked
  const [addingStates, setAddingStates] = useState({});

  const isWishlisted = (id) => wishlist.some(item => item.productId === id);

  const handleAddToCart = (product) => {
    setAddingStates((prev) => ({ ...prev, [product.id]: true }));
    addToCart(product);
    
    // Scale animation on the cart dot
    const dot = document.getElementById('cart-dot');
    if (dot) {
      dot.style.transform = 'scale(1.5)';
      setTimeout(() => {
        dot.style.transform = '';
      }, 300);
    }

    setTimeout(() => {
      setAddingStates((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const filteredProducts = products.filter(product => {
    if (!selectedCategory || selectedCategory === 'All') return true;
    if (selectedCategory === 'Deals') return product.discountPercentage > 0;
    return product.category === selectedCategory;
  });

  const sectionTitle = selectedCategory && selectedCategory !== 'All' 
    ? (selectedCategory === 'Deals' ? 'HOT DEALS' : selectedCategory.toUpperCase())
    : 'TRENDING NOW';

  return (
    <section id="products-section" className="section reveal">
      <div className="section-header">
        <div>
          <div className="section-tag">Hot Picks</div>
          <h2 className="section-title">{sectionTitle}</h2>
        </div>
        <span className="see-all">See All →</span>
      </div>
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="prod-img-wrap">
              <div className="prod-img">
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '80px' }}>{product.emoji}</span>
                )}
              </div>
              {product.badge && <div className={`prod-badge ${product.badge.toLowerCase()}`}>{product.badge}</div>}
              {product.discountPercentage > 0 && (
                <div className="prod-discount-badge">-{product.discountPercentage}%</div>
              )}
              <div className="prod-actions">
                <button 
                  className="prod-action-btn"
                  onClick={() => toggleWishlist(product)}
                  style={{ color: isWishlisted(product.id) ? '#ff4d1c' : 'inherit', fontSize: '14px', fontWeight: 'bold' }}
                >
                  {isWishlisted(product.id) ? '♥' : '♡'}
                </button>
                <button 
                  className="prod-action-btn cart" 
                  style={{
                    ...(addingStates[product.id] ? { background: '#22c55e' } : {}),
                    ...(!product.inStock ? { background: '#555', cursor: 'not-allowed', color: '#aaa' } : {})
                  }}
                  onClick={() => product.inStock && handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {!product.inStock 
                    ? 'Sold Out' 
                    : addingStates[product.id] ? '✓ Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
            <div className="prod-info">
              <div className="prod-brand">{product.brand}</div>
              <div className="prod-name">{product.name}</div>
              <div className="prod-bottom">
                <div>
                  <span className="prod-price">PKR {product.price.toLocaleString()}</span>
                  {product.oldPrice && <span className="prod-old">{product.oldPrice.toLocaleString()}</span>}
                </div>
                <div className="prod-stars">
                  {'★'.repeat(product.stars)}{'☆'.repeat(5 - product.stars)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
