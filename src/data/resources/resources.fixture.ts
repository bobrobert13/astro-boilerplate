import type { ResourceDetail } from '@/services/resources/resource.types';
import { RESOURCE_CATEGORIES } from './categories.fixture';

const category = (slug: string) => {
  const result = RESOURCE_CATEGORIES.find((item) => item.slug === slug);
  if (!result) throw new Error(`Unknown resource category: ${slug}`);
  return result;
};

export const RESOURCES: readonly ResourceDetail[] = [
  {
    id: 'resource-architecture',
    slug: 'architecture',
    title: 'Arquitectura que se puede explicar',
    summary: 'Decisiones pequeñas, límites claros y un camino sencillo hacia el crecimiento.',
    description:
      'Una guía práctica para separar transporte, dominio y presentación sin convertir una aplicación en un conjunto de capas ceremoniales.',
    category: category('engineering'),
    tags: ['SSR', 'diseño', 'mantenibilidad'],
    updatedAt: '2026-07-20T12:00:00.000Z',
    featured: true,
    popularity: 98,
  },
  {
    id: 'resource-contracts',
    slug: 'contracts',
    title: 'Contratos antes que adaptadores',
    summary: 'Cómo hacer intercambiables fixtures, APIs externas y futuras fuentes de datos.',
    description:
      'Un contrato compartido permite probar el comportamiento público una vez y cambiar la fuente sin mover la interfaz.',
    category: category('engineering'),
    tags: ['HTTP', 'tests', 'contratos'],
    updatedAt: '2026-07-12T12:00:00.000Z',
    featured: true,
    popularity: 92,
  },
  {
    id: 'resource-delivery',
    slug: 'delivery',
    title: 'Entrega en unidades revisables',
    summary: 'Un método para dividir cambios grandes sin perder el hilo de producto.',
    description:
      'Los commits cuentan una historia: cada unidad tiene una conducta, sus pruebas y un límite de rollback claro.',
    category: category('operations'),
    tags: ['git', 'review', 'flujo'],
    updatedAt: '2026-06-28T12:00:00.000Z',
    featured: false,
    popularity: 87,
  },
  {
    id: 'resource-discovery',
    slug: 'discovery',
    title: 'Descubrimiento sin ruido',
    summary: 'Filtros y búsquedas que ayudan a encontrar una decisión, no solo un resultado.',
    description:
      'Un catálogo útil conserva el contexto de la consulta y hace visibles sus estados de carga, vacío y error.',
    category: category('product'),
    tags: ['UX', 'búsqueda', 'producto'],
    updatedAt: '2026-06-14T12:00:00.000Z',
    featured: false,
    popularity: 80,
  },
  {
    id: 'resource-observability',
    slug: 'observability',
    title: 'Errores que se pueden clasificar',
    summary: 'Mensajes seguros para la interfaz y señales suficientes para operar el sistema.',
    description:
      'Los fallos esperables tienen códigos estables, mientras que los detalles internos permanecen fuera del navegador.',
    category: category('operations'),
    tags: ['errores', 'operación', 'seguridad'],
    updatedAt: '2026-05-30T12:00:00.000Z',
    featured: false,
    popularity: 76,
  },
  {
    id: 'resource-accessibility',
    slug: 'accessibility',
    title: 'Accesibilidad como contrato',
    summary: 'Estados y acciones que se pueden percibir, comprender y operar con teclado.',
    description:
      'Los componentes hacen explícitos sus nombres accesibles, foco, estados y mensajes sin depender solo de estilos.',
    category: category('product'),
    tags: ['a11y', 'UI', 'teclado'],
    updatedAt: '2026-05-10T12:00:00.000Z',
    featured: false,
    popularity: 73,
  },
];
