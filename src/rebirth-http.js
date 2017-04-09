"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
function isObject(value) {
    return value !== null && typeof value === 'object';
}
function isUndefined(value) {
    return typeof value === 'undefined';
}
var RebirthHttpProvider = (function () {
    function RebirthHttpProvider() {
        this.interceptors = [];
    }
    RebirthHttpProvider.prototype.getInterceptors = function () {
        return this.interceptors;
    };
    RebirthHttpProvider.prototype.addInterceptor = function (interceptor) {
        this.interceptors.push(interceptor);
        return this;
    };
    RebirthHttpProvider.prototype.addRequestInterceptor = function (interceptor) {
        return this.addInterceptor({
            request: function (request) {
                return interceptor(request) || request;
            }
        });
    };
    RebirthHttpProvider.prototype.addResponseInterceptor = function (interceptor) {
        return this.addInterceptor({
            response: function (response) {
                return response.map(function (res) {
                    return interceptor(res) || res;
                });
            }
        });
    };
    RebirthHttpProvider.prototype.addResponseErrorInterceptor = function (interceptor) {
        return this.addInterceptor({
            response: function (response) {
                return response.catch(function (res) {
                    return interceptor(res) || res;
                });
            }
        });
    };
    RebirthHttpProvider.prototype.handleRequest = function (req) {
        return this.interceptors
            .filter(function (item) { return !!item.request; })
            .reduce(function (req, item) {
            return (item.request(req) || req);
        }, req);
    };
    RebirthHttpProvider.prototype.handleResponse = function (res, request) {
        return this.interceptors
            .filter(function (item) { return !!item.response; })
            .reverse()
            .reduce(function (stream, item) {
            return (item.response(stream, request) || res);
        }, res);
    };
    RebirthHttpProvider.prototype.baseUrl = function (host, excludes) {
        if (excludes === void 0) { excludes = []; }
        this.interceptors.push({
            request: function (request) {
                if (/^https?:/.test(request.url)) {
                    return request;
                }
                var excludeUrl = excludes.some(function (t) { return t.test(request.url); });
                if (excludeUrl) {
                    return request;
                }
                host = host.replace(/\/$/, "");
                var url = request.url.replace(/^\//, "");
                request.url = host + "/" + url;
                return request;
            }
        });
        return this;
    };
    RebirthHttpProvider.prototype.headers = function (headers) {
        if (headers === void 0) { headers = {}; }
        return this.addInterceptor({
            request: function (request) {
                request.headers = request.headers || new http_1.Headers();
                for (var key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        request.headers.set(key, headers[key]);
                    }
                }
            }
        });
    };
    RebirthHttpProvider.prototype.json = function () {
        this.interceptors.push({
            request: function (request) {
                request.headers = request.headers || new http_1.Headers();
                request.headers.set('Content-Type', 'application/json');
                request.headers.set('Accept', 'application/json, text/javascript, */*;');
                if (request.body) {
                    request.body = JSON.stringify(request.body);
                }
            },
            response: function (response) {
                return response.map(function (res) {
                    var type = res.headers.get('Content-Type') || res.headers.get('content-type');
                    if (type && type.indexOf('json') !== -1) {
                        return res.json && res.json();
                    }
                });
            }
        });
        return this;
    };
    return RebirthHttpProvider;
}());
RebirthHttpProvider = __decorate([
    core_1.Injectable()
], RebirthHttpProvider);
exports.RebirthHttpProvider = RebirthHttpProvider;
var RebirthHttp = (function () {
    function RebirthHttp(option) {
        if (option) {
            this.http = option.http;
            this.jsonp = option.jsonp;
            this.rebirthHttpProvider = option.rebirthHttpProvider;
        }
    }
    RebirthHttp.prototype.getBaseUrl = function () {
        return '';
    };
    RebirthHttp.prototype.getDefaultHeaders = function () {
        return null;
    };
    RebirthHttp.prototype.requestInterceptor = function (req) {
        if (this.rebirthHttpProvider) {
            return this.rebirthHttpProvider.handleRequest(req);
        }
        return req;
    };
    RebirthHttp.prototype.responseInterceptor = function (res, request) {
        if (this.rebirthHttpProvider) {
            return this.rebirthHttpProvider.handleResponse(res, request);
        }
        return res;
    };
    return RebirthHttp;
}());
exports.RebirthHttp = RebirthHttp;
var RebirthHttpService = (function () {
    function RebirthHttpService(http, rebirthHttpProvider) {
        this.http = http;
        this.rebirthHttpProvider = rebirthHttpProvider;
    }
    RebirthHttpService.prototype.request = function (url, options) {
        var requestOptions = new http_1.RequestOptions(options);
        if (!(url instanceof http_1.Request)) {
            requestOptions.url = url;
        }
        return this.handleRequest(requestOptions);
    };
    RebirthHttpService.prototype.get = function (url, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Get;
        return this.request(url, options);
    };
    RebirthHttpService.prototype.post = function (url, body, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Post;
        options.body = body;
        return this.request(url, options);
    };
    RebirthHttpService.prototype.put = function (url, body, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Put;
        options.body = body;
        return this.request(url, options);
    };
    RebirthHttpService.prototype.delete = function (url, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Delete;
        return this.request(url, options);
    };
    RebirthHttpService.prototype.patch = function (url, body, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Patch;
        options.body = body;
        return this.request(url, options);
    };
    RebirthHttpService.prototype.head = function (url, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Head;
        return this.request(url, options);
    };
    RebirthHttpService.prototype.options = function (url, options) {
        options = options || {};
        options.method = http_1.RequestMethod.Options;
        return this.request(url, options);
    };
    RebirthHttpService.prototype.requestInterceptor = function (req) {
        if (this.rebirthHttpProvider) {
            return this.rebirthHttpProvider.handleRequest(req);
        }
        return req;
    };
    RebirthHttpService.prototype.responseInterceptor = function (res, request) {
        if (this.rebirthHttpProvider) {
            return this.rebirthHttpProvider.handleResponse(res, request);
        }
        return res;
    };
    RebirthHttpService.prototype.handleRequest = function (requestOptions) {
        requestOptions = this.requestInterceptor(requestOptions) || requestOptions;
        var observable = this.http.request(new http_1.Request(requestOptions));
        if (this.enableJson) {
            observable = observable.map(function (res) { return res.json(); });
        }
        return this.responseInterceptor(observable, requestOptions) || observable;
    };
    return RebirthHttpService;
}());
RebirthHttpService = __decorate([
    __param(1, core_1.Optional())
], RebirthHttpService);
exports.RebirthHttpService = RebirthHttpService;
function BaseUrl(url) {
    return function (target) {
        target.prototype.getBaseUrl = function () {
            return url;
        };
        return target;
    };
}
exports.BaseUrl = BaseUrl;
function DefaultHeaders(headers) {
    return function (target) {
        target.prototype.getDefaultHeaders = function () {
            return headers;
        };
        return target;
    };
}
exports.DefaultHeaders = DefaultHeaders;
function paramBuilder(paramName, optional) {
    if (optional === void 0) { optional = false; }
    return function (key) {
        if (!optional && !key) {
            throw new Error(paramName + " Key is required!");
        }
        return function (target, propertyKey, parameterIndex) {
            var metadataKey = propertyKey + "_" + paramName + "_parameters";
            var paramObj = {
                key: key,
                parameterIndex: parameterIndex
            };
            if (Array.isArray(target[metadataKey])) {
                target[metadataKey].push(paramObj);
            }
            else {
                target[metadataKey] = [paramObj];
            }
        };
    };
}
exports.Path = paramBuilder("Path");
exports.Query = paramBuilder("Query", true);
exports.Body = paramBuilder("Body")("Body");
exports.Header = paramBuilder("Header");
function Headers(headersDef) {
    return function (target, propertyKey, descriptor) {
        descriptor.headers = headersDef;
        return descriptor;
    };
}
exports.Headers = Headers;
function Produces(producesDef) {
    return function (target, propertyKey, descriptor) {
        descriptor.enableJson = producesDef.toLocaleLowerCase() === 'json';
        return descriptor;
    };
}
exports.Produces = Produces;
function methodBuilder(method, isJsonp) {
    if (isJsonp === void 0) { isJsonp = false; }
    return function (url) {
        return function (target, propertyKey, descriptor) {
            var pPath = target[propertyKey + "_Path_parameters"];
            var pQuery = target[propertyKey + "_Query_parameters"];
            var pBody = target[propertyKey + "_Body_parameters"];
            var pHeader = target[propertyKey + "_Header_parameters"];
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // Body
                var body = "";
                if (pBody) {
                    var reqBody = args[pBody[0].parameterIndex];
                    body = descriptor.enableJson ? JSON.stringify(reqBody) : reqBody;
                }
                // Path
                var resUrl = url;
                if (pPath) {
                    for (var k in pPath) {
                        if (pPath.hasOwnProperty(k)) {
                            resUrl = resUrl.replace(":" + pPath[k].key, encodeURIComponent(args[pPath[k].parameterIndex]));
                        }
                    }
                }
                // Query
                var search = new http_1.URLSearchParams();
                if (pQuery) {
                    pQuery
                        .filter(function (p) { return !isUndefined(args[p.parameterIndex]); })
                        .forEach(function (p) {
                        var key = p.key;
                        var value = args[p.parameterIndex];
                        if (value instanceof Date) {
                            search.set(encodeURIComponent(key), encodeURIComponent(value.getTime().toString()));
                        }
                        else if (isObject(value)) {
                            for (var k in value) {
                                if (value.hasOwnProperty(k)) {
                                    search.set(encodeURIComponent(k), encodeURIComponent(value[k]));
                                }
                            }
                        }
                        else {
                            search.set(encodeURIComponent(key), encodeURIComponent((value || '').toString()));
                        }
                    });
                }
                // Headers
                // set class default headers
                var headers = new http_1.Headers(this.getDefaultHeaders());
                // set method specific headers
                for (var k in descriptor.headers) {
                    if (descriptor.headers.hasOwnProperty(k)) {
                        headers.append(k, descriptor.headers[k]);
                    }
                }
                if (pHeader) {
                    for (var k in pHeader) {
                        if (pHeader.hasOwnProperty(k)) {
                            headers.append(pHeader[k].key, args[pHeader[k].parameterIndex]);
                        }
                    }
                }
                var baseUrl = this.getBaseUrl();
                var host = baseUrl ? baseUrl.replace(/\/$/, "") + '/' : '';
                var options = new http_1.RequestOptions({
                    method: method,
                    url: "" + host + resUrl.replace(/^\//, ""),
                    headers: headers,
                    body: body,
                    search: search
                });
                options = this.requestInterceptor(options) || options;
                var httpRequest = isJsonp ? this.jsonp : this.http;
                if (!httpRequest) {
                    throw 'Http or jsonp should at less passs one of them!';
                }
                var observable = httpRequest.request(new http_1.Request(options));
                // @Produces
                if (descriptor.enableJson) {
                    observable = observable.map(function (res) { return res.json(); });
                }
                return this.responseInterceptor(observable, options) || observable;
            };
            return descriptor;
        };
    };
}
exports.GET = methodBuilder(http_1.RequestMethod.Get);
exports.JSONP = methodBuilder(http_1.RequestMethod.Get, true);
exports.POST = methodBuilder(http_1.RequestMethod.Post);
exports.PUT = methodBuilder(http_1.RequestMethod.Put);
exports.DELETE = methodBuilder(http_1.RequestMethod.Delete);
exports.HEAD = methodBuilder(http_1.RequestMethod.Head);
exports.PATCH = methodBuilder(http_1.RequestMethod.Patch);
exports.REBIRTH_HTTP_PROVIDERS = [
    RebirthHttpProvider
];
