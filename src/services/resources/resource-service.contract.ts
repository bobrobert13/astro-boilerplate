import type { ServiceResult } from '@/services/shared/service-result';
import type {
  PaginatedResult,
  ResourceCategory,
  ResourceDetail,
  ResourceQuery,
  ResourceSummary,
} from './resource.types';

export interface ResourceRequestOptions {
  signal?: AbortSignal;
}

export interface ResourceService {
  list(
    query?: Partial<ResourceQuery>,
    options?: ResourceRequestOptions
  ): Promise<ServiceResult<PaginatedResult<ResourceSummary>>>;
  getBySlug(slug: string, options?: ResourceRequestOptions): Promise<ServiceResult<ResourceDetail>>;
  getCategories(
    options?: ResourceRequestOptions
  ): Promise<ServiceResult<readonly ResourceCategory[]>>;
}
