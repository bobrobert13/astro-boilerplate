import { createServiceError } from '@/services/shared/service-error';
import { failure, success, type ServiceResult } from '@/services/shared/service-result';
import type { ResourceQuery } from './resource.types';

function optionalInteger(value: string | null): number | undefined | null {
  if (value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

export function parseResourceQuery(url: URL): ServiceResult<Partial<ResourceQuery>> {
  const page = optionalInteger(url.searchParams.get('page'));
  const pageSize = optionalInteger(url.searchParams.get('pageSize'));
  if (page === null || pageSize === null) {
    return failure(
      createServiceError('validation', 'La página solicitada no es válida.', { status: 400 })
    );
  }

  return success({
    ...(url.searchParams.get('search')
      ? { search: url.searchParams.get('search') ?? undefined }
      : {}),
    ...(url.searchParams.get('category')
      ? { category: url.searchParams.get('category') ?? undefined }
      : {}),
    ...(url.searchParams.get('sort')
      ? { sort: url.searchParams.get('sort') as ResourceQuery['sort'] }
      : {}),
    ...(page === undefined ? {} : { page }),
    ...(pageSize === undefined ? {} : { pageSize }),
  });
}

export function serviceResultResponse<T>(
  result: ServiceResult<T>,
  cacheControl = 'public, max-age=60, stale-while-revalidate=300'
): Response {
  const headers = {
    'Cache-Control': cacheControl,
    'Content-Type': 'application/json; charset=utf-8',
  };
  return result.ok
    ? Response.json(result.data, { headers })
    : Response.json({ error: result.error }, { status: result.error.status ?? 500, headers });
}
