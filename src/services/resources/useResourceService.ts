import { api, buildAuthHeaders, type ApiClient } from '@/services/shared/api.client';
import { createServiceError } from '@/services/shared/service-error';
import { toServiceError } from '@/services/shared/service-error.mapper';
import { failure, success, type ServiceResult } from '@/services/shared/service-result';
import type { ResourceService } from './resource-service.contract';
import { RESOURCE_ENDPOINTS } from './resource.endpoints';
import { isPaginatedResource, isResourceCategory, isResourceDetail } from './resource.mapper';
import type { ResourceCategory, ResourceQuery } from './resource.types';

type TokenProvider = () => string | null | undefined | Promise<string | null | undefined>;

export interface ResourceServiceOptions {
  client?: ApiClient;
  getToken?: TokenProvider;
}

function queryParams(input: Partial<ResourceQuery> | undefined): Record<string, string> {
  const query = input ?? {};
  return {
    ...(query.search ? { search: query.search } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.sort ? { sort: query.sort } : {}),
    ...(query.page ? { page: String(query.page) } : {}),
    ...(query.pageSize ? { pageSize: String(query.pageSize) } : {}),
  };
}

export function useResourceService(options: ResourceServiceOptions = {}): ResourceService {
  const client = options.client ?? api;

  async function getRequest<T>(
    url: string,
    validate: (value: unknown) => value is T,
    request: { signal?: AbortSignal; params?: Record<string, string> } = {}
  ): Promise<ServiceResult<T>> {
    try {
      const token = await options.getToken?.();
      const response = await client.get<unknown>(url, {
        signal: request.signal,
        params: request.params,
        headers: buildAuthHeaders(token),
      });
      return validate(response.data)
        ? success(response.data)
        : failure(createServiceError('validation', 'El servicio devolvió datos inválidos.'));
    } catch (error) {
      return failure(toServiceError(error));
    }
  }

  return {
    list(query, options) {
      return getRequest(RESOURCE_ENDPOINTS.resources, isPaginatedResource, {
        signal: options?.signal,
        params: queryParams(query),
      });
    },
    getBySlug(slug, options) {
      return getRequest(RESOURCE_ENDPOINTS.resource(slug), isResourceDetail, options);
    },
    getCategories(options) {
      return getRequest(
        RESOURCE_ENDPOINTS.categories,
        (value): value is readonly ResourceCategory[] =>
          Array.isArray(value) && value.every(isResourceCategory),
        options
      );
    },
  };
}
