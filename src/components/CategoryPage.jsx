import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from './MainLayout';
import Products from './Products';

export default function CategoryPage() {
  const { categoryId } = useParams();

  // e.g. 'electronics' -> 'Electronics'
  const formattedCategory = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  return (
    <MainLayout>
      <div style={{ minHeight: '60vh', paddingTop: '2rem' }}>
        <Products selectedCategory={formattedCategory} />
      </div>
    </MainLayout>
  );
}
