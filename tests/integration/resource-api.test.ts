import { describe, expect, it } from 'vitest';
import { GET as getResources } from '@/pages/api/catalog/resources/index';
import { GET as getResource } from '@/pages/api/catalog/resources/[slug]';
import { GET as getCategories } from '@/pages/api/catalog/categories';

describe('resource API flow', () => {
  it('serves a paginated catalog and categories', async () => {
    const listResponse = await getResources({
      request: new Request('http://localhost/api/catalog/resources?page=1&pageSize=2'),
    } as never);
    const categoriesResponse = await getCategories({} as never);
    const list = await listResponse.json();

    expect(listResponse.status).toBe(200);
    expect(list.items).toHaveLength(2);
    expect(list.totalPages).toBe(3);
    expect(categoriesResponse.status).toBe(200);
    expect(await categoriesResponse.json()).toHaveLength(3);
  });

  it('translates a missing resource to a 404 response', async () => {
    const response = await getResource({ params: { slug: 'missing' } } as never);
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({ error: { code: 'not_found' } });
  });
});
