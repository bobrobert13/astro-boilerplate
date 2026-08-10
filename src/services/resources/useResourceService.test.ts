import type { AxiosRequestConfig } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import type { ApiClient } from '@/services/shared/api.client';
import { useResourceService } from './useResourceService';

const page = {
  items: [
    {
      id: 'resource-1',
      slug: 'one',
      title: 'One',
      summary: 'Summary',
      category: { slug: 'product', label: 'Producto' },
      tags: ['demo'],
      updatedAt: '2026-01-01T00:00:00.000Z',
      featured: true,
      popularity: 1,
    },
  ],
  page: 1,
  pageSize: 12,
  total: 1,
  totalPages: 1,
};

describe('resource HTTP service', () => {
  it('sends query, signal and a fresh token per request', async () => {
    const requests: Array<{ url: string; config?: AxiosRequestConfig }> = [];
    const client: ApiClient = {
      async get<T>(url: string, config?: AxiosRequestConfig) {
        requests.push({ url, config });
        return { data: page as T };
      },
    };
    const getToken = vi.fn().mockResolvedValueOnce('one').mockResolvedValueOnce('two');
    const service = useResourceService({ client, getToken });
    const controller = new AbortController();

    await Promise.all([
      service.list({ search: 'guide', page: 2, pageSize: 4 }, { signal: controller.signal }),
      service.list({ sort: 'recent' }),
    ]);

    expect(getToken).toHaveBeenCalledTimes(2);
    expect(requests[0]?.config?.headers).toMatchObject({ Authorization: 'Bearer one' });
    expect(requests[0]?.config?.params).toEqual({ search: 'guide', page: '2', pageSize: '4' });
    expect(requests[0]?.config?.signal).toBe(controller.signal);
    expect(requests[1]?.config?.headers).toMatchObject({ Authorization: 'Bearer two' });
  });

  it('returns validation when the response shape is not trusted', async () => {
    const client: ApiClient = {
      async get<T>() {
        return { data: { items: [] } as T };
      },
    };

    const result = await useResourceService({ client }).list();

    expect(result).toMatchObject({ ok: false, error: { code: 'validation' } });
  });
});
