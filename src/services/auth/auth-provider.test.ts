import { describe, expect, it } from 'vitest';
import { isAuthEnabled, resolveAuthProvider } from './auth-provider';

describe('auth provider configuration', () => {
  it('defaults unknown values to the disabled mode', () => {
    expect(resolveAuthProvider(undefined)).toBe('none');
    expect(resolveAuthProvider('supabase')).toBe('none');
    expect(isAuthEnabled(undefined)).toBe(false);
  });

  it('enables the Clerk adapter explicitly', () => {
    expect(resolveAuthProvider('clerk')).toBe('clerk');
    expect(isAuthEnabled('clerk')).toBe(true);
  });
});
