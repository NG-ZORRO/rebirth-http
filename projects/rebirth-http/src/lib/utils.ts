import { ParamType, ParamMetadata } from './typings';

export function isObject(value: any): value is Object {
  return value !== null && typeof value === 'object';
}

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

export function isNil(value: any): value is undefined | null {
  return typeof value === 'undefined' || value === null;
}

export function getMetadataKey(
  paramName: string | symbol,
  paramType: ParamType
): string {
  return `${paramName
    .toString()
    .toLowerCase()}_${paramType.toLowerCase()}_parameters`;
}

export function setMetadata(
  target: any,
  metadataKey: string,
  paramObj: ParamMetadata
): void {
  if (Array.isArray(target[metadataKey])) {
    target[metadataKey].push(paramObj);
  } else {
    target[metadataKey] = [paramObj];
  }
}

export function getMetadata(
  target: any,
  paramName: string,
  paramType: ParamType
): ParamMetadata[] {
  return target[getMetadataKey(paramName, paramType)];
}
