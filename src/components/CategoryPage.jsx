import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Products from './Products';
import Footer from './Footer';

export default function CategoryPage({ cartCount, onAddToCart }) {
  const { categoryId } = useParams();

  // e.g. 'electronics' -> 'Electronics'
  const formattedCategory = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div style={{ minHeight: '60vh', paddingTop: '2rem' }}>
        <Products onAddToCart={onAddToCart} selectedCategory={formattedCategory} />
      </div>
      <Footer />
    </>
  );
}
