import {
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

export const Any = null as any;

export type ParamType = 'Path' | 'Query' | 'Body' | 'Header';

export type MethodType =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'JSONP'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export interface ParamMetadata {
  key: string;
  paramIndex: number;
}

export type THeaders = string | { [name: string]: string | undefined };

export interface RebirthHttpInterceptor {
  request?: (option: HttpRequest<any>) => HttpRequest<any> | void;
  response?: (
    response: HttpEvent<any> | HttpErrorResponse,
    request?: HttpRequest<any>
  ) => HttpEvent<any> | void;
}
