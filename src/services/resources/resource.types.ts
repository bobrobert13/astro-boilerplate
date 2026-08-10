/** Domain model for the replaceable resource-catalog demonstration. */
export interface ResourceCategory {
  slug: string;
  label: string;
}

export interface ResourceSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  tags: readonly string[];
  updatedAt: string;
  featured: boolean;
  popularity: number;
}

export interface ResourceDetail extends ResourceSummary {
  description: string;
}

export type ResourceSort = 'featured' | 'recent' | 'title-asc' | 'title-desc';

export interface ResourceQuery {
  search?: string;
  category?: string;
  sort: ResourceSort;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: readonly T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
