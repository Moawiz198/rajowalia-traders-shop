import React from 'react';
import MainLayout from './MainLayout';
import Hero from './Hero';
import Ticker from './Ticker';
import Categories from './Categories';
import PromoBanner from './PromoBanner';
import Products from './Products';
import Brands from './Brands';
import Newsletter from './Newsletter';

export default function Storefront() {
  return (
    <MainLayout>
      <Hero />
      <Ticker />
      <Categories />
      <PromoBanner />
      <Products />
      <Brands />
      <Newsletter />
    </MainLayout>
  );
}
