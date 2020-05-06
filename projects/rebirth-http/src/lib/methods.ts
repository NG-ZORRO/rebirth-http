import { HttpHeaders, HttpParams } from '@angular/common/http';

import { RebirthHttpClient } from './client';
import { MethodType } from './typings';
import { getMetadata, isNil, isObject, isUndefined } from './utils';

function methodBuilder(method: MethodType) {
  return function (url: string) {
    return function (
      target: RebirthHttpClient,
      paramName: string,
      descriptor: any
    ) {
      const pPath = getMetadata(target, paramName, 'Path');
      const pQuery = getMetadata(target, paramName, 'Query');
      const pBody = getMetadata(target, paramName, 'Body');
      const pHeader = getMetadata(target, paramName, 'Header');

      // TODO: we have to do something with the original method...
      // const originalMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        // body
        let body = '';
        if (pBody) {
          body = args[pBody[0].paramIndex];
        }

        // path
        let resUrl: string = url;
        if (pPath) {
          for (const k in pPath) {
            if (pPath.hasOwnProperty(k)) {
              resUrl = resUrl.replace(
                `:${pPath[k].key}`,
                encodeURIComponent(args[pPath[k].paramIndex])
              );
            }
          }
        }

        // query
        let params = new HttpParams();
        if (pQuery) {
          params = pQuery
            .filter((p) => !isUndefined(args[p.paramIndex]))
            .reduce((ps, p) => {
              const key = p.key;
              const value = args[p.paramIndex];
              let result = ps;

              if (value instanceof Date) {
                result = result.set(key, (<Date>value).getTime().toString());
              } else if (Array.isArray(value)) {
                result = result.set(key, value.map((item) => item).join(','));
              } else if (isObject(value)) {
                for (const k in value) {
                  if (value.hasOwnProperty(k) && !isUndefined(value[k])) {
                    result = result.set(k, value[k]);
                  }
                }
              } else if (!isNil(value)) {
                result = result.set(key, value.toString());
              } else {
                result = result.set(key, '');
              }

              return result;
            }, params);
        }

        // header
        let headers = new HttpHeaders(target.getDefaultHeaders() as string);
        console.log(descriptor);

        for (const k in descriptor.headers) {
          if (descriptor.headers.hasOwnProperty(k)) {
            headers = headers.append(k, descriptor.headers[k]);
          }
        }
        if (pHeader) {
          for (const k in pHeader) {
            if (pHeader.hasOwnProperty(k)) {
              headers = headers.append(
                pHeader[k].key,
                args[pHeader[k].paramIndex]
              );
            }
          }
        }

        const baseUrl = this.getBaseUrl();
        const host = baseUrl ? baseUrl.replace(/\/$/, '') + '/' : '';
        const requestUrl = `${host}${resUrl.replace(/^\//, '')}`;

        const defaultOptions = descriptor.requestOptions;
        if (defaultOptions) {
          const headerKeys = defaultOptions.headers
            ? defaultOptions.headers.keys()
            : [];
          for (let i = 0; i < headerKeys.length; i++) {
            const k = headerKeys[i];
            headers = headers.append(k, defaultOptions.headers.get(k));
          }

          const paramKeys = defaultOptions.params
            ? defaultOptions.params.keys()
            : [];
          for (let i = 0; i < paramKeys.length; i++) {
            const k = paramKeys[i];
            params = params.append(k, defaultOptions.params.get(k));
          }
        }

        const options = {
          body,
          headers,
          params,
          observe: defaultOptions ? defaultOptions.observe : 'body',
          reportProgress: defaultOptions
            ? defaultOptions.reportProgress
            : false,
          responseType: defaultOptions ? defaultOptions.responseType : 'json',
          withCredentials: defaultOptions
            ? defaultOptions.withCredentials
            : false,
        };

        return this.http.request(method, requestUrl, options);
      };

      return descriptor;
    };
  };
}

export const DELETE = methodBuilder('DELETE');
export const GET = methodBuilder('GET');
export const HEAD = methodBuilder('HEAD');
export const JSONP = methodBuilder('JSONP');
export const OPTIONS = methodBuilder('OPTIONS');
export const PATCH = methodBuilder('PATCH');
export const POST = methodBuilder('POST');
export const PUT = methodBuilder('PUT');
