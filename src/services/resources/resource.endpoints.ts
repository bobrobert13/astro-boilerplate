function segment(value: string): string {
  return encodeURIComponent(value);
}

export const RESOURCE_ENDPOINTS = {
  resources: '/catalog/resources',
  resource: (slug: string) => `/catalog/resources/${segment(slug)}`,
  categories: '/catalog/categories',
} as const;
