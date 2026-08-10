import { DATA_CONFIG } from '@/config/index.config';
import { createServiceError } from '@/services/shared/service-error';
import { failure, success, type ServiceResult } from '@/services/shared/service-result';
import type {
  PaginatedResult,
  ResourceDetail,
  ResourceQuery,
  ResourceSort,
  ResourceSummary,
} from './resource.types';

const SORTS: readonly ResourceSort[] = ['featured', 'recent', 'title-asc', 'title-desc'];

function isSort(value: unknown): value is ResourceSort {
  return typeof value === 'string' && SORTS.includes(value as ResourceSort);
}

export function normalizeResourceQuery(
  input: Partial<ResourceQuery> = {}
): ServiceResult<ResourceQuery> {
  const page = input.page ?? DATA_CONFIG.defaultPage;
  const pageSize = input.pageSize ?? DATA_CONFIG.defaultPageSize;
  const search = input.search?.trim();

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1) {
    return failure(
      createServiceError('validation', 'La página solicitada no es válida.', { status: 400 })
    );
  }

  if (pageSize > DATA_CONFIG.maxPageSize) {
    return failure(
      createServiceError('validation', 'El tamaño de página supera el máximo permitido.', {
        status: 400,
      })
    );
  }

  if (search && search.length > DATA_CONFIG.maxSearchLength) {
    return failure(
      createServiceError('validation', 'La búsqueda es demasiado larga.', { status: 400 })
    );
  }

  const sort = input.sort ?? 'featured';
  if (!isSort(sort)) {
    return failure(
      createServiceError('validation', 'El orden solicitado no es válido.', { status: 400 })
    );
  }

  return success({
    page,
    pageSize,
    sort,
    ...(search ? { search } : {}),
    ...(input.category ? { category: input.category } : {}),
  });
}

function matchesSearch(resource: ResourceSummary, search: string | undefined): boolean {
  if (!search) return true;
  const value =
    `${resource.title} ${resource.summary} ${resource.tags.join(' ')}`.toLocaleLowerCase();
  return value.includes(search.toLocaleLowerCase());
}

function sortResources(resources: readonly ResourceDetail[], sort: ResourceSort): ResourceDetail[] {
  return resources.toSorted((left, right) => {
    if (sort === 'recent') return right.updatedAt.localeCompare(left.updatedAt);
    if (sort === 'title-asc') return left.title.localeCompare(right.title, 'es');
    if (sort === 'title-desc') return right.title.localeCompare(left.title, 'es');
    return Number(right.featured) - Number(left.featured) || right.popularity - left.popularity;
  });
}

export function selectResourcePage(
  resources: readonly ResourceDetail[],
  query: ResourceQuery
): PaginatedResult<ResourceSummary> {
  const filtered = sortResources(
    resources.filter(
      (resource) =>
        (!query.category || resource.category.slug === query.category) &&
        matchesSearch(resource, query.search)
    ),
    query.sort
  );
  const start = (query.page - 1) * query.pageSize;
  const total = filtered.length;

  return {
    items: filtered
      .slice(start, start + query.pageSize)
      .map(({ description: _description, ...summary }) => summary),
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages: Math.ceil(total / query.pageSize),
  };
}
