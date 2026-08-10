import { AUTH_PROVIDER, type AuthProvider } from '@/config/boilerplate.config';

/** Resolves an unknown environment value to a supported authentication mode. */
export function resolveAuthProvider(value: unknown): AuthProvider {
  return value === AUTH_PROVIDER.clerk ? AUTH_PROVIDER.clerk : AUTH_PROVIDER.none;
}

/** Returns whether the optional authentication integration is enabled. */
export function isAuthEnabled(value: unknown): boolean {
  return resolveAuthProvider(value) !== AUTH_PROVIDER.none;
}
