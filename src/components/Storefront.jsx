import React from 'react';
import MainLayout from './MainLayout';
import Hero from './Hero';
import Ticker from './Ticker';
import FlashSale from './FlashSale';
import Categories from './Categories';
import PromoBanner from './PromoBanner';
import Products from './Products';
import Features from './Features';
import Brands from './Brands';
import Newsletter from './Newsletter';

export default function Storefront() {
  return (
    <MainLayout>
      <Hero />
      <Ticker />
      <FlashSale />
      <Categories />
      <PromoBanner />
      <Products />
      <Features />
      <Brands />
      <Newsletter />
    </MainLayout>
  );
}
