import type { ResourceCategory } from '@/services/resources/resource.types';

export const RESOURCE_CATEGORIES: readonly ResourceCategory[] = [
  { slug: 'product', label: 'Producto' },
  { slug: 'engineering', label: 'Ingeniería' },
  { slug: 'operations', label: 'Operaciones' },
];
