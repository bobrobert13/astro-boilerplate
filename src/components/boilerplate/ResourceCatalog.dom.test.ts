import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ResourceCatalog from './ResourceCatalog.vue';
import { RESOURCE_CATEGORIES } from '@/data/resources/categories.fixture';
import { RESOURCES } from '@/data/resources/resources.fixture';
import { selectResourcePage } from '@/services/resources/resource.queries';

const initialQuery = { page: 1, pageSize: 12, sort: 'featured' as const };
const initialPage = selectResourcePage(RESOURCES, initialQuery);

describe('ResourceCatalog', () => {
  it('renders resources and applies a category filter through the service contract', async () => {
    const wrapper = mount(ResourceCatalog, {
      props: { initialPage, categories: RESOURCE_CATEGORIES, initialQuery },
    });

    await flushPromises();
    expect(wrapper.text()).toContain('Arquitectura que se puede explicar');

    await wrapper.find('select').setValue('product');
    await flushPromises();
    expect(wrapper.text()).toContain('Descubrimiento sin ruido');
    expect(wrapper.text()).not.toContain('Contratos antes que adaptadores');
  });

  it('shows an empty state for a query with no matches', async () => {
    const wrapper = mount(ResourceCatalog, {
      props: { initialPage, categories: RESOURCE_CATEGORIES, initialQuery },
    });

    await flushPromises();
    const input = wrapper.find('input[type="search"]');
    await input.setValue('no existe');
    await input.trigger('keyup.enter');
    await flushPromises();

    expect(wrapper.text()).toContain('No encontramos recursos con esos filtros.');
  });
});
