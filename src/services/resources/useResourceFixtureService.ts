import { RESOURCE_CATEGORIES } from '@/data/resources/categories.fixture';
import { RESOURCES } from '@/data/resources/resources.fixture';
import { createServiceError } from '@/services/shared/service-error';
import { failure, success } from '@/services/shared/service-result';
import type { ResourceService } from './resource-service.contract';
import { normalizeResourceQuery, selectResourcePage } from './resource.queries';

/** Returns deterministic local data while preserving the production service contract. */
export function useResourceFixtureService(): ResourceService {
  return {
    async list(input) {
      const query = normalizeResourceQuery(input);
      return query.ok ? success(selectResourcePage(RESOURCES, query.data)) : failure(query.error);
    },
    async getBySlug(slug) {
      const resource = RESOURCES.find((item) => item.slug === slug);
      return resource
        ? success(resource)
        : failure(
            createServiceError('not_found', 'No encontramos el recurso solicitado.', {
              status: 404,
            })
          );
    },
    async getCategories() {
      return success(RESOURCE_CATEGORIES);
    },
  };
}
