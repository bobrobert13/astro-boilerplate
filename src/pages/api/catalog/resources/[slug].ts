import type { APIRoute } from 'astro';
import { serviceResultResponse } from '@/services/resources/resource.http';
import { useResourceFixtureService } from '@/services/resources/useResourceFixtureService';

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) {
    return serviceResultResponse({
      ok: false,
      error: {
        code: 'validation',
        message: 'El slug es obligatorio.',
        status: 400,
        retryable: false,
      },
    });
  }
  return serviceResultResponse(await useResourceFixtureService().getBySlug(slug));
};
