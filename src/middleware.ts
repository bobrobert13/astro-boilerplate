import { defineMiddleware } from 'astro:middleware';
import { clerkMiddleware } from '@clerk/astro/server';
import { APP_ROUTES } from '@/config/index.config';

type AuthProvider = 'none' | 'clerk';

function getAuthProvider(): AuthProvider {
  const value = import.meta.env.AUTH_PROVIDER ?? process.env.AUTH_PROVIDER ?? 'none';
  return value === 'clerk' ? 'clerk' : 'none';
}

function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

const passThrough = defineMiddleware((_context, next) => next());

export const onRequest =
  getAuthProvider() === 'clerk'
    ? clerkMiddleware((auth, context, next) => {
        if (matchesRoute(context.url.pathname, [APP_ROUTES.account]) && !auth().userId) {
          return context.redirect(
            `${APP_ROUTES.signIn}?redirect_url=${encodeURIComponent(context.url.pathname)}`
          );
        }

        return next();
      })
    : passThrough;
