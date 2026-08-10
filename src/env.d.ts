/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly AUTH_PROVIDER?: 'none' | 'clerk';
  readonly PUBLIC_DATA_SOURCE?: 'fixture' | 'api';
  readonly PUBLIC_API_BASE_URL?: string;
  readonly PUBLIC_API_TIMEOUT_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    auth?: () => { userId: string | null };
  }
}
