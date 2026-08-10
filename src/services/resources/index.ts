import { DATA_CONFIG, HTTP_CONFIG, type DataSource } from '@/config/index.config';
import type { ResourceService } from './resource-service.contract';
import { useResourceFixtureService } from './useResourceFixtureService';
import { useResourceService, type ResourceServiceOptions } from './useResourceService';

function readSource(): DataSource {
  return import.meta.env.PUBLIC_DATA_SOURCE === DATA_CONFIG.source.api
    ? DATA_CONFIG.source.api
    : DATA_CONFIG.source.fixture;
}

export function useConfiguredResourceService(
  options: ResourceServiceOptions = {}
): ResourceService {
  return readSource() === HTTP_CONFIG.dataSource.api
    ? useResourceService(options)
    : useResourceFixtureService();
}

export type { ResourceService } from './resource-service.contract';
export type * from './resource.types';
