import { categoryData, Product } from '@/utils/categoryData';

export const allProducts: Product[] = Object.values(categoryData).flatMap(
  (category) => category.products,
);
