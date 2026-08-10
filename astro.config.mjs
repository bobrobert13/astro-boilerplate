// @ts-check
import { defineConfig, envField } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import clerk from '@clerk/astro';
import { APP_CONFIG, APP_ROUTES } from './src/config/boilerplate.config.ts';
import { HTTP_CONFIG } from './src/config/http.config.ts';

export default defineConfig({
  site: APP_CONFIG.url,
  // Clerk stays registered so its virtual component modules resolve at build time.
  // AUTH_PROVIDER=none still disables middleware protection and all auth routes.
  integrations: [
    vue(),
    clerk({
      signInUrl: APP_ROUTES.signIn,
      signUpUrl: APP_ROUTES.signUp,
      signInFallbackRedirectUrl: APP_ROUTES.account,
      signUpFallbackRedirectUrl: APP_ROUTES.account,
      afterSignOutUrl: APP_ROUTES.home,
      prefetchUI: false,
    }),
  ],
  output: 'server',
  i18n: {
    defaultLocale: APP_CONFIG.locale,
    locales: [APP_CONFIG.locale],
    routing: { prefixDefaultLocale: false },
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  env: {
    schema: {
      PUBLIC_API_BASE_URL: envField.string({
        context: 'client',
        access: 'public',
        default: HTTP_CONFIG.defaultBaseUrl,
      }),
      PUBLIC_API_TIMEOUT_MS: envField.number({
        context: 'client',
        access: 'public',
        default: HTTP_CONFIG.defaultTimeoutMs,
      }),
      AUTH_PROVIDER: envField.enum({
        context: 'server',
        access: 'public',
        values: ['none', 'clerk'],
        default: 'none',
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({ mode: 'standalone' }),
  server: { host: true, port: 4321 },
  devToolbar: { enabled: true },
});
