import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from './MainLayout';
import Products from './Products';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const decoded = decodeURIComponent(categoryId);

  let mainCategory = decoded;
  let subCategory = 'All';

  const lowerDecoded = decoded.toLowerCase();
  if (lowerDecoded === 'clothing' || lowerDecoded.startsWith('clothing-') || lowerDecoded.startsWith('clothing - ') || lowerDecoded === 'women dresses') {
    mainCategory = 'Women Dresses';
    subCategory = 'All';
  } else {
    mainCategory = decoded.charAt(0).toUpperCase() + decoded.slice(1);
  }

  return (
    <MainLayout>
      <div style={{ minHeight: '60vh', paddingTop: '2rem' }}>
        <Products selectedCategory={mainCategory} initialSubCategory={subCategory} />
      </div>
    </MainLayout>
  );
}
