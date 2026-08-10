import type { APIRoute } from 'astro';
import { serviceResultResponse } from '@/services/resources/resource.http';
import { useResourceFixtureService } from '@/services/resources/useResourceFixtureService';

export const GET: APIRoute = async () =>
  serviceResultResponse(await useResourceFixtureService().getCategories());
