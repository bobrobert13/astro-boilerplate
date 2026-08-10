import { describe, expect, it } from 'vitest';
import { parseResourceQuery, serviceResultResponse } from './resource.http';
import { failure, success } from '@/services/shared/service-result';
import { createServiceError } from '@/services/shared/service-error';

describe('resource HTTP boundary', () => {
  it('parses supported query parameters without losing defaults', () => {
    const result = parseResourceQuery(
      new URL(
        'http://localhost/api/catalog/resources?search=SSR&category=engineering&sort=recent&page=2&pageSize=4'
      )
    );

    expect(result).toEqual({
      ok: true,
      data: { search: 'SSR', category: 'engineering', sort: 'recent', page: 2, pageSize: 4 },
    });
  });

  it('rejects malformed numeric query values', () => {
    const result = parseResourceQuery(new URL('http://localhost/api/catalog/resources?page=wat'));

    expect(result).toMatchObject({ ok: false, error: { code: 'validation', status: 400 } });
  });

  it('serializes success and failure with stable JSON headers', async () => {
    const successResponse = serviceResultResponse(success({ ok: true }));
    const failureResponse = serviceResultResponse(
      failure(createServiceError('not_found', 'Missing', { status: 404 }))
    );

    expect(successResponse.status).toBe(200);
    expect(successResponse.headers.get('cache-control')).toContain('max-age=60');
    expect(await failureResponse.json()).toMatchObject({ error: { code: 'not_found' } });
    expect(failureResponse.status).toBe(404);
  });
});
