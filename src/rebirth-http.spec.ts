import { Request, RequestMethod } from '@angular/http';
import { RebirthHttp, JSONP, GET, POST, PUT, DELETE, BaseUrl, Query, Path, Body } from './rebirth-http';
import { Observable } from 'rxjs/Rx';
import * as Rx from 'rxjs';

describe('rebirth-http', () => {
    let http, jsonp, mockService;

    @BaseUrl('http://api.greengerong.com')
    class MockService extends RebirthHttp {

        constructor() {
            super({ http, jsonp });
        }

        @GET('article')
        getArticles(@Query('pageIndex') pageIndex = 1,
                    @Query('pageSize') pageSize = 10): Observable<any> {
            return null; // leave `return null` due to TypeScript Interface isn't visable in runtime
        }

        @GET('article/:id')
        getArticleByUrl(@Path('id') articleUrl: string): Observable<any> {
            return null;
        }

        @POST("article")
        createArticle(@Body article: any): Observable {
            return null;
        }

        @PUT("article/:id")
        updateArticle(@Path("id") id: string, @Body article: any): Observable {
            return null;
        }

        @DELETE("article/:id")
        deleteArticleById(@Path("id") id: string): Observable {
            return null;
        }
    }

    beforeEach(() => {
        http = jasmine.createSpyObj('http', ['request']);
        jsonp = jasmine.createSpyObj('jsonp', ['request']);
        mockService = new MockService();
    });

    it('should construct a get request', () => {
        http.request.and.returnValue({});
        mockService.getArticles(1, 10);

        expect(http.request).toHaveBeenCalled();
        let option: Request = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(RequestMethod.Get);
        expect(option.url).toEqual('http://api.greengerong.com/article?pageSize=10&pageIndex=1');
        expect(option.getBody()).toBeNull();
    });

    it('should construct a get request with path', () => {
        http.request.and.returnValue({});
        mockService.getArticleByUrl('green gerong');

        expect(http.request).toHaveBeenCalled();
        let option: Request = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(RequestMethod.Get);
        expect(option.url).toEqual('http://api.greengerong.com/article/green%20gerong');
        expect(option.getBody()).toBeNull();
    });

    it('should construct a post request', () => {
        http.request.and.returnValue({});
        mockService.createArticle({ name: 'greengerong' });

        expect(http.request).toHaveBeenCalled();
        let option: Request = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(RequestMethod.Post);
        expect(option.url).toEqual('http://api.greengerong.com/article');
        expect(option.getBody()).toEqual('{"name":"greengerong"}');
    });

    it('should construct a put request', () => {
        http.request.and.returnValue({});
        mockService.updateArticle('99', { name: 'greengerong' });

        expect(http.request).toHaveBeenCalled();
        let option: Request = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(RequestMethod.Put);
        expect(option.url).toEqual('http://api.greengerong.com/article/99');
        expect(option.getBody()).toEqual('{"name":"greengerong"}');
    });

    it('should construct a delete request', () => {
        http.request.and.returnValue({});
        mockService.deleteArticleById('99');

        expect(http.request).toHaveBeenCalled();
        let option: Request = http.request.calls.mostRecent().args[0];
        expect(option.method).toEqual(RequestMethod.Delete);
        expect(option.url).toEqual('http://api.greengerong.com/article/99');
        expect(option.getBody()).toBeNull();
    });

});
