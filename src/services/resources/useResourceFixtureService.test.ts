import { describe, expect, it } from 'vitest';
import { useResourceFixtureService } from './useResourceFixtureService';

describe('resource fixture service', () => {
  it('implements list, detail and category contracts', async () => {
    const service = useResourceFixtureService();
    const [list, detail, categories, missing] = await Promise.all([
      service.list({ pageSize: 2 }),
      service.getBySlug('architecture'),
      service.getCategories(),
      service.getBySlug('missing'),
    ]);

    expect(list.ok && list.data.items).toHaveLength(2);
    expect(detail.ok && detail.data.description).toContain('guía');
    expect(categories.ok && categories.data.map((item) => item.slug)).toContain('engineering');
    expect(missing).toMatchObject({ ok: false, error: { code: 'not_found', status: 404 } });
  });

  it('returns a validation result for an invalid page', async () => {
    const result = await useResourceFixtureService().list({ page: 0 });

    expect(result).toMatchObject({ ok: false, error: { code: 'validation', status: 400 } });
  });
});
