import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {
    HttpClient, HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaderResponse,
    HttpHeaders,
    HttpInterceptor,
    HttpParams,
    HttpProgressEvent,
    HttpRequest,
    HttpResponse,
    HttpSentEvent,
    HttpUserEvent
} from '@angular/common/http';

function isObject(value): boolean {
    return value !== null && typeof value === 'object';
}

function isUndefined(value) {
    return typeof value === 'undefined';
}

function isEmpty(value) {
    return typeof value === 'undefined' || value === null;
}


export interface RebirthHttpInterceptor {
    request?: (option: HttpRequest<any>) => HttpRequest<any> | void;
    response?: (response: HttpEvent<any> | HttpErrorResponse, request?: HttpRequest<any>) => HttpEvent<any> | void;
}

@Injectable()
export class RebirthHttpProvider {
    private interceptors: RebirthHttpInterceptor[];

    constructor() {
        this.interceptors = [];
    }

    getInterceptors() {
        return this.interceptors;
    }

    addInterceptor(interceptor: RebirthHttpInterceptor): RebirthHttpProvider {
        this.interceptors.push(interceptor);
        return this;
    }

    addRequestInterceptor(interceptor: (res: HttpRequest<any>) => HttpRequest<any>): RebirthHttpProvider {
        return this.addInterceptor({
            request: (request: HttpRequest<any>): HttpRequest<any> => {
                return interceptor(request) || request;
            }
        });
    }

    addResponseInterceptor(interceptor: (res: any, request?: HttpRequest<any>) => any): RebirthHttpProvider {
        return this.addInterceptor({
            response: (response: HttpEvent<any>, request?: HttpRequest<any>): HttpEvent<any> | void => {
                return interceptor(response, request) || response;
            }
        });
    }

    addResponseErrorInterceptor(interceptor: (res: any, request?: HttpRequest<any>) => any): RebirthHttpProvider {
        return this.addInterceptor({
            response: (response: HttpEvent<any> | HttpErrorResponse, request?: HttpRequest<any>): HttpEvent<any> | void => {
                if (response instanceof HttpErrorResponse) {
                    return interceptor(response, request) || response;
                }
            }
        });
    }


    handleRequest(req: HttpRequest<any>): HttpRequest<any> {
        return this.interceptors
            .filter(item => !!item.request)
            .reduce((httpEvent, item) => {
                return (item.request(httpEvent) || httpEvent);
            }, req);
    }

    handleResponse(response: HttpEvent<any>, request?: HttpRequest<any>): HttpEvent<any> {
        return this.interceptors
            .filter(item => !!item.response)
            .reverse()
            .reduce((httpEvent, item) => {
                return item.response(httpEvent, request) || response;
            }, response);
    }

    baseUrl(host: string, excludes: RegExp[] = []): RebirthHttpProvider {
        this.interceptors.push({
            request: (request: HttpRequest<any>): HttpRequest<any> => {
                if (/^https?:/.test(request.url)) {
                    return request;
                }

                let excludeUrl = excludes.some(t => t.test(request.url));
                if (excludeUrl) {
                    return request;
                }

                host = host.replace(/\/$/, "");
                const url = request.url.replace(/^\//, "");
                return request.clone({ url: `${host}/${url}` });
            }
        });

        return this;
    }

    headers(headers: { [name: string]: string | string[]; } = {}): RebirthHttpProvider {
        return this.addInterceptor({
            request: (request: HttpRequest<any>): HttpRequest<any> => {
                return request.clone({ setHeaders: headers });
            }
        });
    }
}

@Injectable()
export class RebirthHttpInterceptors implements HttpInterceptor {
    constructor(private rebirthHttpProvider: RebirthHttpProvider) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        const httpRequest = this.rebirthHttpProvider.handleRequest(req);
        return next.handle(httpRequest)
            .map(response => this.rebirthHttpProvider.handleResponse(response, httpRequest) || response)
            .catch(error => Observable.throw(this.rebirthHttpProvider.handleResponse(error, httpRequest) || error));
    }

}

export class RebirthHttp {

    constructor(protected http: HttpClient) {

    }

    protected getBaseUrl(): string {
        return '';
    }

    protected getDefaultHeaders(): Object {
        return null;
    }
}

export function BaseUrl(url: string) {
    return function <TFunction extends Function>(target: TFunction): TFunction {
        target.prototype.getBaseUrl = function () {
            return url;
        };
        return target;
    };
}

export function DefaultHeaders(headers: any) {
    return function <TFunction extends Function>(target: TFunction): TFunction {
        target.prototype.getDefaultHeaders = function () {
            return headers;
        };
        return target;
    };
}

function paramBuilder(paramName: string, optional = false) {
    return function (key?: string) {
        if (!optional && !key) {
            throw new Error(`${paramName} Key is required!`);
        }
        return function (target: RebirthHttp, propertyKey: string | symbol, parameterIndex: number) {
            let metadataKey = `${propertyKey}_${paramName}_parameters`;
            let paramObj: any = {
                key: key,
                parameterIndex: parameterIndex
            };
            if (Array.isArray(target[metadataKey])) {
                target[metadataKey].push(paramObj);
            } else {
                target[metadataKey] = [paramObj];
            }
        };
    };
}

export const Path = paramBuilder("Path");

export const Query = paramBuilder("Query", true);

export const Body = paramBuilder("Body")("Body");

export const Header = paramBuilder("Header");

export function Headers(headersDef: any) {
    return function (target: RebirthHttp, propertyKey: string, descriptor: any) {
        descriptor.headers = headersDef;
        return descriptor;
    };
}

export function Extra(extra: any) {
    return function (target: RebirthHttp, propertyKey: string, descriptor: any) {
        descriptor.extra = extra;
        return descriptor;
    };
}

export function RequestOptions(options: {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body' | 'response' | string,
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean,
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text',
    withCredentials?: boolean
}) {
    return function (target: RebirthHttp, propertyKey: string, descriptor: any) {
        options.headers = options.headers || {};
        options.params = options.params || {};
        options.observe = options.observe || 'body';
        options.reportProgress = isUndefined(options.reportProgress) ? false : options.reportProgress;
        options.responseType = options.responseType || 'json';
        options.withCredentials = isUndefined(options.withCredentials) ? false : options.withCredentials;

        descriptor.requestOptions = options;
        return descriptor;
    };
}


function methodBuilder(method: string) {
    return function (url: string) {
        return function (target: RebirthHttp, propertyKey: string, descriptor: any) {

            let pPath = target[`${propertyKey}_Path_parameters`];
            let pQuery = target[`${propertyKey}_Query_parameters`];
            let pBody = target[`${propertyKey}_Body_parameters`];
            let pHeader = target[`${propertyKey}_Header_parameters`];

            const oldDescriptor = descriptor.value;

            descriptor.value = function (...args: any[]) {

                // call method for test coverage
                try {
                    oldDescriptor.apply(this, args);
                } catch (e) {
                }

                // Body
                let body = "";
                if (pBody) {
                    body = args[pBody[0].parameterIndex];
                }

                // Path
                let resUrl: string = url;
                if (pPath) {
                    for (let k in pPath) {
                        if (pPath.hasOwnProperty(k)) {
                            resUrl = resUrl.replace(`:${pPath[k].key}`, encodeURIComponent(args[pPath[k].parameterIndex]));
                        }
                    }
                }

                // Query
                let params = new HttpParams();
                if (pQuery) {
                    params = pQuery
                        .filter(p => !isUndefined(args[p.parameterIndex]))
                        .reduce((ps, p) => {
                            let key = p.key;
                            let value = args[p.parameterIndex];
                            let result = ps;

                            if (value instanceof Date) {
                                result = result.set(key, (<Date>value).getTime().toString());
                            } else if (Array.isArray(value)) {
                                result = result.set(key, value.map((item) => item).join(','));
                            } else if (isObject(value)) {
                                for (let k in value) {
                                    if (value.hasOwnProperty(k)) {
                                        result = result.set(k, value[k]);
                                    }
                                }
                            } else if (!isEmpty(value)) {
                                result = result.set(key, value.toString());
                            } else {
                                result = result.set(key, '');
                            }

                            return result;
                        }, params);
                }

                // Headers
                // set class default headers
                let headers = new HttpHeaders(this.getDefaultHeaders());
                // set method specific headers
                for (let k in descriptor.headers) {
                    if (descriptor.headers.hasOwnProperty(k)) {
                        headers = headers.append(k, descriptor.headers[k]);
                    }
                }

                if (pHeader) {
                    for (let k in pHeader) {
                        if (pHeader.hasOwnProperty(k)) {
                            headers = headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
                        }
                    }
                }

                let baseUrl = this.getBaseUrl();
                let host = baseUrl ? baseUrl.replace(/\/$/, "") + '/' : '';
                const requestUrl = `${host}${resUrl.replace(/^\//, "")}`;

                let defaultOptions = descriptor.requestOptions;
                if (defaultOptions) {
                    for (let k in defaultOptions.headers) {
                        if (defaultOptions.headers.hasOwnProperty(k)) {
                            headers = headers.append(k, defaultOptions.headers[k]);
                        }
                    }

                    for (let k in defaultOptions.params) {
                        if (defaultOptions.params.hasOwnProperty(k)) {
                            params = params.append(k, defaultOptions.params[k]);
                        }
                    }
                }

                let options = {
                    body,
                    headers,
                    params,
                    observe: defaultOptions ? defaultOptions.observe : 'body',
                    reportProgress: defaultOptions ? defaultOptions.reportProgress : false,
                    responseType: defaultOptions ? defaultOptions.responseType : 'json',
                    withCredentials: defaultOptions ? defaultOptions.withCredentials : false
                };

                (options as any).extra = descriptor.extra;
                return this.http.request(method, requestUrl, options);
            };

            return descriptor;
        };
    };
}

export const GET = methodBuilder('GET');

export const JSONP = methodBuilder('JSONP');

export const POST = methodBuilder('POST');

export const PUT = methodBuilder('PUT');

export const DELETE = methodBuilder('DELETE');

export const HEAD = methodBuilder('HEAD');

export const PATCH = methodBuilder('PATCH');

export const OPTIONS = methodBuilder('OPTIONS');


export const REBIRTH_HTTP_PROVIDERS: any[] = [
    RebirthHttpProvider
];

