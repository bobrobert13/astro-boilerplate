# Autenticación opcional

El boilerplate funciona sin proveedor de identidad. Esa es la configuración segura para demos y proyectos que todavía no han elegido auth.

## Sin autenticación

```dotenv
AUTH_PROVIDER=none
```

El middleware solo continúa la request. Las rutas `/account`, `/sign-in` y `/sign-up` responden 404 para no exponer una UI que no puede funcionar. Clerk está presente como integración de build para resolver sus componentes virtuales, pero no procesa sesiones. Los servicios no capturan tokens en scope de módulo.

## Clerk

```dotenv
AUTH_PROVIDER=clerk
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Al reiniciar Astro se registra `@clerk/astro`. El middleware protege `/account` y redirige a `/sign-in?redirect_url=...`. Las páginas de auth usan los componentes oficiales `SignIn` y `SignUp`.

No guardes claves en el repositorio, no las envíes al navegador salvo la publishable key y no uses `Astro.locals.auth()` sin verificar que el proveedor esté habilitado. Para otro proveedor, implementa un adaptador junto a `src/services/auth/auth-provider.ts`, mantén `AuthProvider` pequeño y replica los escenarios de 404, redirect y sesión.
