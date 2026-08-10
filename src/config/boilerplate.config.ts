/** Stable, domain-neutral defaults used by the extracted starter. */
export const APP_CONFIG = {
  name: 'Astro Starter',
  description: 'Una base SSR para construir aplicaciones web de alcance medio y alto.',
  locale: 'es-419',
  url: 'http://localhost:4321',
  author: 'Astro Starter',
} as const;

export const APP_ROUTES = {
  home: '/',
  catalog: '/catalog',
  resource: (slug: string) => `/resources/${encodeURIComponent(slug)}`,
  account: '/account',
  signIn: '/sign-in',
  signUp: '/sign-up',
  notFound: '/404',
} as const;

export const DATA_CONFIG = {
  source: {
    fixture: 'fixture',
    api: 'api',
  },
  defaultPage: 1,
  defaultPageSize: 12,
  maxPageSize: 48,
  maxSearchLength: 100,
} as const;

export type DataSource = (typeof DATA_CONFIG.source)[keyof typeof DATA_CONFIG.source];

export const AUTH_PROVIDER = {
  none: 'none',
  clerk: 'clerk',
} as const;

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
