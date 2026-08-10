<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useConfiguredResourceService } from '@/services/resources';
import type {
  PaginatedResult,
  ResourceCategory,
  ResourceQuery,
  ResourceSummary,
} from '@/services/resources';

interface Props {
  initialPage: PaginatedResult<ResourceSummary>;
  categories: readonly ResourceCategory[];
  initialQuery: ResourceQuery;
}

const props = defineProps<Props>();
const service = useConfiguredResourceService();
const page = ref(props.initialPage);
const search = ref(props.initialQuery.search ?? '');
const category = ref(props.initialQuery.category ?? '');
const sort = ref<ResourceQuery['sort']>(props.initialQuery.sort);
const loading = ref(false);
const error = ref<string | null>(null);
const controller = ref<AbortController | null>(null);
const requestId = ref(0);

const hasPrevious = computed(() => page.value.page > 1);
const hasNext = computed(() => page.value.page < page.value.totalPages);

async function load(nextPage = 1): Promise<void> {
  controller.value?.abort();
  const currentId = ++requestId.value;
  const nextController = new AbortController();
  controller.value = nextController;
  loading.value = true;
  error.value = null;

  const result = await service.list(
    {
      search: search.value || undefined,
      category: category.value || undefined,
      sort: sort.value,
      page: nextPage,
      pageSize: props.initialQuery.pageSize,
    },
    { signal: nextController.signal }
  );
  if (currentId !== requestId.value) return;
  loading.value = false;
  if (!result.ok) {
    if (result.error.code !== 'cancelled') error.value = result.error.message;
    return;
  }
  page.value = result.data;
}

function resetFilters(): void {
  void load(1);
}

function previousPage(): void {
  if (hasPrevious.value) void load(page.value.page - 1);
}

function nextPage(): void {
  if (hasNext.value) void load(page.value.page + 1);
}

watch([category, sort], resetFilters);
onMounted(() => void load(1));
onBeforeUnmount(() => controller.value?.abort());
</script>

<template>
  <section aria-labelledby="catalog-heading">
    <div class="starter-toolbar">
      <label>
        <span class="sr-only">Buscar recursos</span>
        <input
          v-model="search"
          class="starter-field"
          type="search"
          placeholder="Buscar recursos"
          @keyup.enter="resetFilters"
        />
      </label>
      <label>
        <span class="sr-only">Categoría</span>
        <select v-model="category" class="starter-field">
          <option value="">Todas las categorías</option>
          <option v-for="item in categories" :key="item.slug" :value="item.slug">
            {{ item.label }}
          </option>
        </select>
      </label>
      <label>
        <span class="sr-only">Ordenar</span>
        <select v-model="sort" class="starter-field">
          <option value="featured">Destacados</option>
          <option value="recent">Más recientes</option>
          <option value="title-asc">Título A–Z</option>
          <option value="title-desc">Título Z–A</option>
        </select>
      </label>
    </div>

    <div v-if="loading" class="starter-state" role="status">Cargando recursos…</div>
    <p v-else-if="error" class="starter-state starter-error" role="alert">{{ error }}</p>
    <div v-else-if="page.items.length" class="starter-grid" aria-live="polite">
      <a
        v-for="resource in page.items"
        :key="resource.id"
        class="starter-card"
        :href="`/resources/${encodeURIComponent(resource.slug)}`"
      >
        <div class="starter-card__meta">
          <span>{{ resource.category.label }}</span
          ><span v-if="resource.featured">Destacado</span>
        </div>
        <h2>{{ resource.title }}</h2>
        <p>{{ resource.summary }}</p>
        <div class="starter-tags">
          <span v-for="tag in resource.tags" :key="tag" class="starter-tag">{{ tag }}</span>
        </div>
      </a>
    </div>
    <div v-else class="starter-state">No encontramos recursos con esos filtros.</div>

    <div class="starter-pagination" aria-label="Paginación">
      <span
        >{{ page.total }} recursos · página {{ page.page }} de
        {{ Math.max(page.totalPages, 1) }}</span
      >
      <span class="starter-actions">
        <button
          class="starter-button starter-button--secondary"
          type="button"
          :disabled="!hasPrevious"
          @click="previousPage"
        >
          Anterior
        </button>
        <button class="starter-button" type="button" :disabled="!hasNext" @click="nextPage">
          Siguiente
        </button>
      </span>
    </div>
  </section>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
