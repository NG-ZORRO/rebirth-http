import {
  RebirthHttpClient,
  JSONP,
  GET,
  POST,
  PUT,
  DELETE,
  PATCH,
  BaseUrl,
  Query,
  Path,
  Body,
  Any,
} from '../public-api';
import { Observable } from 'rxjs';

describe('rebirth-http', () => {
  let http: any, mockService: any;

  @BaseUrl('http://api.greengerong.com')
  class MockService extends RebirthHttpClient {
    constructor() {
      super(http);
    }

    @GET('article')
    getArticles(
      @Query('pageIndex') pageIndex = 1,
      @Query('pageSize') pageSize = 10
    ): Observable<any> {
      return Any;
    }

    @GET('article')
    getArticlesByIds(@Query('ids') ids: number[]): Observable<any> {
      return Any;
    }

    @GET('article/:id')
    getArticleByUrl(@Path('id') articleUrl: string): Observable<any> {
      return Any;
    }

    @POST('article')
    createArticle(@Body article: any): Observable<any> {
      return Any;
    }

    @PUT('article/:id')
    updateArticle(@Path('id') id: string, @Body article: any): Observable<any> {
      return Any;
    }

    @DELETE('article/:id')
    deleteArticleById(@Path('id') id: string): Observable<any> {
      return Any;
    }

    @JSONP('article/:id')
    getArticleByJsonp(
      @Path('id') id: string,
      @Query('name') name: string
    ): Observable<any> {
      return Any;
    }

    @PATCH('article')
    patchMethod(@Body article: any): Observable<any> {
      return Any;
    }
  }

  beforeEach(() => {
    http = jasmine.createSpyObj('http', ['request']);
    mockService = new MockService();
  });

  it('should construct a get request', () => {
    http.request.and.returnValue({});
    mockService.getArticles(1, 10);

    expect(http.request).toHaveBeenCalled();
    const method = http.request.calls.mostRecent().args[0];
    const url = http.request.calls.mostRecent().args[1];
    const option = http.request.calls.mostRecent().args[2];
    expect(method).toEqual('GET');
    expect(url).toEqual('http://api.greengerong.com/article');
    expect(option.params.get('pageSize')).toEqual('10');
    expect(option.params.get('pageIndex')).toEqual('1');
    expect(option.body).toEqual('');
  });

  it('should construct a get request with array query', () => {
    http.request.and.returnValue({});
    mockService.getArticlesByIds([1, 2, 3, 4, 5]);

    expect(http.request).toHaveBeenCalled();
    const method = http.request.calls.mostRecent().args[0];
    const url = http.request.calls.mostRecent().args[1];
    const option = http.request.calls.mostRecent().args[2];
    expect(method).toEqual('GET');
    expect(url).toEqual('http://api.greengerong.com/article');
    expect(option.params.get('ids')).toEqual('1,2,3,4,5');
    expect(option.body).toEqual('');
  });

  it('should construct a get request with path', () => {
    http.request.and.returnValue({});
    mockService.getArticleByUrl('green gerong');

    expect(http.request).toHaveBeenCalled();

    const method = http.request.calls.mostRecent().args[0];
    const url = http.request.calls.mostRecent().args[1];
    const option = http.request.calls.mostRecent().args[2];
    expect(method).toEqual('GET');
    expect(url).toEqual('http://api.greengerong.com/article/green%20gerong');
    expect(option.body).toEqual('');
  });

  it('should construct a post request', () => {
    http.request.and.returnValue({});
    mockService.createArticle({ name: 'greengerong' });

    expect(http.request).toHaveBeenCalled();
    const method = http.request.calls.mostRecent().args[0];
    const url = http.request.calls.mostRecent().args[1];
    const option = http.request.calls.mostRecent().args[2];
    expect(method).toEqual('POST');
    expect(url).toEqual('http://api.greengerong.com/article');
    expect(option.body.name).toEqual('greengerong');
  });

  it('should construct a put request', () => {
    http.request.and.returnValue({});
    mockService.updateArticle('99', { name: 'greengerong' });

    expect(http.request).toHaveBeenCalled();
    const method = http.request.calls.mostRecent().args[0];
    const url = http.request.calls.mostRecent().args[1];
    const option = http.request.calls.mostRecent().args[2];

    expect(method).toEqual('PUT');
    expect(url).toEqual('http://api.greengerong.com/article/99');
    expect(option.body.name).toEqual('greengerong');
  });

  it('should construct a delete request', () => {
    http.request.and.returnValue({});
    mockService.deleteArticleById('99');

    expect(http.request).toHaveBeenCalled();
    const method = http.request.calls.mostRecent().args[0];
    const url = http.request.calls.mostRecent().args[1];
    const option = http.request.calls.mostRecent().args[2];

    expect(method).toEqual('DELETE');
    expect(url).toEqual('http://api.greengerong.com/article/99');
    expect(option.body).toEqual('');
  });

  it('should construct a jsonp request', () => {
    http.request.and.returnValue({});
    mockService.getArticleByJsonp('99', 'green gerong');

    expect(http.request).toHaveBeenCalled();
    const method = http.request.calls.mostRecent().args[0];
    const url = http.request.calls.mostRecent().args[1];
    const option = http.request.calls.mostRecent().args[2];

    expect(method).toEqual('JSONP');
    expect(url).toEqual('http://api.greengerong.com/article/99');
    expect(option.params.get('name')).toEqual('green gerong');
    expect(option.body).toEqual('');
  });

  it('should construct a patch request', () => {
    http.request.and.returnValue({});
    mockService.patchMethod({ name: 'greengerong' });

    expect(http.request).toHaveBeenCalled();

    const method = http.request.calls.mostRecent().args[0];
    const url = http.request.calls.mostRecent().args[1];
    const option = http.request.calls.mostRecent().args[2];

    expect(method).toEqual('PATCH');
    expect(url).toEqual('http://api.greengerong.com/article');
    expect(option.body.name).toEqual('greengerong');
  });
});
