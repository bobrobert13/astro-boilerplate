export const HTTP_CONFIG = {
  defaultBaseUrl: '/api',
  defaultTimeoutMs: 10_000,
  dataSource: {
    fixture: 'fixture',
    api: 'api',
  },
  cacheControl: {
    publicCatalog: 'public, max-age=60, stale-while-revalidate=300',
    private: 'private, no-store',
    ogImage: 'public, max-age=3600, stale-while-revalidate=86400',
  },
} as const;
