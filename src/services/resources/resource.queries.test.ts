import { describe, expect, it } from 'vitest';
import { normalizeResourceQuery, selectResourcePage } from './resource.queries';
import { RESOURCES } from '@/data/resources/resources.fixture';
import type { ResourceQuery } from './resource.types';

describe('resource query contract', () => {
  it('normalizes defaults and returns a deterministic first page', () => {
    const query = normalizeResourceQuery({});

    expect(query).toEqual({
      ok: true,
      data: { page: 1, pageSize: 12, sort: 'featured' },
    });
    if (query.ok) {
      expect(selectResourcePage(RESOURCES, query.data).items[0]?.slug).toBe('architecture');
    }
  });

  it.each([
    [{ page: 0 }, 'validation'],
    [{ pageSize: 49 }, 'validation'],
    [{ sort: 'unknown' }, 'validation'],
    [{ search: 'x'.repeat(101) }, 'validation'],
  ])('rejects invalid input %j', (input, code) => {
    const result = normalizeResourceQuery(input as Partial<ResourceQuery>);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe(code);
  });

  it('filters by category and search and supports empty pages', () => {
    const result = normalizeResourceQuery({
      category: 'product',
      search: 'accesibilidad',
      pageSize: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const page = selectResourcePage(RESOURCES, result.data);
    expect(page.items.map((item) => item.slug)).toEqual(['accessibility']);
    expect(selectResourcePage(RESOURCES, { ...result.data, page: 9 }).items).toEqual([]);
  });
});
