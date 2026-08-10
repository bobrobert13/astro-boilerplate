import type { APIRoute } from 'astro';
import { serviceResultResponse, parseResourceQuery } from '@/services/resources/resource.http';
import { useResourceFixtureService } from '@/services/resources/useResourceFixtureService';

export const GET: APIRoute = async ({ request }) => {
  const parsed = parseResourceQuery(new URL(request.url));
  if (!parsed.ok) return serviceResultResponse(parsed);
  return serviceResultResponse(await useResourceFixtureService().list(parsed.data));
};
