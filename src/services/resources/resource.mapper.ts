import type { ResourceCategory, ResourceDetail, ResourceSummary } from './resource.types';

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isResourceCategory(value: unknown): value is ResourceCategory {
  return record(value) && typeof value.slug === 'string' && typeof value.label === 'string';
}

export function isResourceSummary(value: unknown): value is ResourceSummary {
  return (
    record(value) &&
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    typeof value.summary === 'string' &&
    isResourceCategory(value.category) &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === 'string') &&
    typeof value.updatedAt === 'string' &&
    typeof value.featured === 'boolean' &&
    typeof value.popularity === 'number'
  );
}

export function isResourceDetail(value: unknown): value is ResourceDetail {
  return record(value) && isResourceSummary(value) && typeof value.description === 'string';
}

export function isPaginatedResource(value: unknown): value is {
  items: readonly ResourceSummary[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
} {
  return (
    record(value) &&
    Array.isArray(value.items) &&
    value.items.every(isResourceSummary) &&
    Number.isInteger(value.page) &&
    Number.isInteger(value.pageSize) &&
    Number.isInteger(value.total) &&
    Number.isInteger(value.totalPages)
  );
}
