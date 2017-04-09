"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var http_1 = require("@angular/http");
var rebirth_http_1 = require("./rebirth-http");
describe('rebirth-http', function () {
    var http, jsonp, mockService;
    var MockService = (function (_super) {
        __extends(MockService, _super);
        function MockService() {
            return _super.call(this, { http: http, jsonp: jsonp }) || this;
        }
        MockService.prototype.getArticles = function (pageIndex, pageSize) {
            if (pageIndex === void 0) { pageIndex = 1; }
            if (pageSize === void 0) { pageSize = 10; }
            return null; // leave `return null` due to TypeScript Interface isn't visable in runtime
        };
        MockService.prototype.getArticleByUrl = function (articleUrl) {
            return null;
        };
        MockService.prototype.createArticle = function (article) {
            return null;
        };
        MockService.prototype.updateArticle = function (id, article) {
            return null;
        };
        MockService.prototype.deleteArticleById = function (id) {
            return null;
        };
        MockService.prototype.getArticleByJsonp = function (id, name) {
            return null;
        };
        MockService.prototype.patchMethod = function (article) {
            return null;
        };
        return MockService;
    }(rebirth_http_1.RebirthHttp));
    __decorate([
        rebirth_http_1.GET('article'),
        __param(0, rebirth_http_1.Query('pageIndex')),
        __param(1, rebirth_http_1.Query('pageSize'))
    ], MockService.prototype, "getArticles", null);
    __decorate([
        rebirth_http_1.GET('article/:id'),
        __param(0, rebirth_http_1.Path('id'))
    ], MockService.prototype, "getArticleByUrl", null);
    __decorate([
        rebirth_http_1.POST("article"),
        __param(0, rebirth_http_1.Body)
    ], MockService.prototype, "createArticle", null);
    __decorate([
        rebirth_http_1.PUT("article/:id"),
        __param(0, rebirth_http_1.Path("id")), __param(1, rebirth_http_1.Body)
    ], MockService.prototype, "updateArticle", null);
    __decorate([
        rebirth_http_1.DELETE("article/:id"),
        __param(0, rebirth_http_1.Path("id"))
    ], MockService.prototype, "deleteArticleById", null);
    __decorate([
        rebirth_http_1.JSONP("article/:id"),
        __param(0, rebirth_http_1.Path("id")), __param(1, rebirth_http_1.Query('name'))
    ], MockService.prototype, "getArticleByJsonp", null);
    __decorate([
        rebirth_http_1.PATCH("article"),
        __param(0, rebirth_http_1.Body)
    ], MockService.prototype, "patchMethod", null);
    MockService = __decorate([
        rebirth_http_1.BaseUrl('http://api.greengerong.com')
    ], MockService);
    beforeEach(function () {
        http = jasmine.createSpyObj('http', ['request']);
        jsonp = jasmine.createSpyObj('jsonp', ['request']);
        mockService = new MockService();
    });
    it('should construct a get request', function () {
        http.request.and.returnValue({});
        mockService.getArticles(1, 10);
        expect(http.request).toHaveBeenCalled();
        var option = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(http_1.RequestMethod.Get);
        expect(option.url).toEqual('http://api.greengerong.com/article?pageSize=10&pageIndex=1');
        expect(option.getBody()).toEqual('');
    });
    it('should construct a get request with path', function () {
        http.request.and.returnValue({});
        mockService.getArticleByUrl('green gerong');
        expect(http.request).toHaveBeenCalled();
        var option = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(http_1.RequestMethod.Get);
        expect(option.url).toEqual('http://api.greengerong.com/article/green%20gerong');
        expect(option.getBody()).toEqual('');
    });
    it('should construct a post request', function () {
        http.request.and.returnValue({});
        mockService.createArticle({ name: 'greengerong' });
        expect(http.request).toHaveBeenCalled();
        var option = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(http_1.RequestMethod.Post);
        expect(option.url).toEqual('http://api.greengerong.com/article');
        expect(JSON.parse(option.getBody()).name).toEqual('greengerong');
    });
    it('should construct a put request', function () {
        http.request.and.returnValue({});
        mockService.updateArticle('99', { name: 'greengerong' });
        expect(http.request).toHaveBeenCalled();
        var option = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(http_1.RequestMethod.Put);
        expect(option.url).toEqual('http://api.greengerong.com/article/99');
        expect(JSON.parse(option.getBody()).name).toEqual('greengerong');
    });
    it('should construct a delete request', function () {
        http.request.and.returnValue({});
        mockService.deleteArticleById('99');
        expect(http.request).toHaveBeenCalled();
        var option = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(http_1.RequestMethod.Delete);
        expect(option.url).toEqual('http://api.greengerong.com/article/99');
        expect(option.getBody()).toEqual('');
    });
    it('should construct a jsonp request', function () {
        jsonp.request.and.returnValue({});
        mockService.getArticleByJsonp('99', 'green gerong');
        expect(jsonp.request).toHaveBeenCalled();
        var option = jsonp.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(http_1.RequestMethod.Get);
        expect(option.url).toEqual('http://api.greengerong.com/article/99?name=green%2520gerong');
        expect(option.getBody()).toEqual('');
    });
    it('should construct a patch request', function () {
        http.request.and.returnValue({});
        mockService.patchMethod({ name: 'greengerong' });
        expect(http.request).toHaveBeenCalled();
        var option = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(http_1.RequestMethod.Patch);
        expect(option.url).toEqual('http://api.greengerong.com/article');
        expect(JSON.parse(option.getBody()).name).toEqual('greengerong');
    });
});
