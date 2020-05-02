import { HttpHeaders, HttpParams } from '@angular/common/http';
import { isUndefined } from './utils';
import { RebirthHttpClient } from './client';

export function BaseUrl(url: string) {
  return function <TFunction extends Function>(target: TFunction): TFunction {
    target.prototype.getBaseUrl = function () {
      return url;
    };
    return target;
  };
}

export function DefaultHeaders(headers: any) {
  return function <Ctor extends Function>(target: Ctor): Ctor {
    (target.prototype as any).getDefaultHeaders = function () {
      return headers;
    };
    return target;
  };
}

export function Headers(headersDef: any) {
  return function (
    target: RebirthHttpClient,
    propertyKey: string,
    descriptor: any
  ) {
    descriptor.headers = headersDef;
    return descriptor;
  };
}

export function RequestOptions(options: {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body' | 'response' | string;
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}) {
  return function (
    target: RebirthHttpClient,
    propertyKey: string,
    descriptor: any
  ) {
    options.observe = options.observe || 'body';
    options.reportProgress = isUndefined(options.reportProgress)
      ? false
      : options.reportProgress;
    options.responseType = options.responseType || 'json';
    options.withCredentials = isUndefined(options.withCredentials)
      ? false
      : options.withCredentials;

    descriptor.requestOptions = options;
    return descriptor;
  };
}
