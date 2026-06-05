import React, { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Ticker from './Ticker';
import Categories from './Categories';
import PromoBanner from './PromoBanner';
import Products from './Products';
import Brands from './Brands';
import Newsletter from './Newsletter';
import Footer from './Footer';

export default function Storefront({ cartCount, onAddToCart }) {
  return (
    <>
      <Navbar cartCount={cartCount} />
      <Hero />
      <Ticker />
      <Categories />
      <PromoBanner />
      <Products onAddToCart={onAddToCart} />
      <Brands />
      <Newsletter />
      <Footer />
    </>
  );
}
