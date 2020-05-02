# @rebirth/rebirth-http

[![Build Status](https://travis-ci.org/greengerong/rebirth-http.svg?branch=master)](https://travis-ci.org/greengerong/rebirth-http)
[![dependcy](https://david-dm.org/greengerong/rebirth-http.svg)](https://david-dm.org/greengerong/rebirth-http)
[![dev dependcy](https://david-dm.org/greengerong/rebirth-http/dev-status.svg)](https://david-dm.org/greengerong/rebirth-http?type=dev)
[![npm version](https://img.shields.io/npm/v/rebirth-http.svg)](https://www.npmjs.com/package/rebirth-http)

> Java JPA like http lib for Angular `HttpClient`

===============================

Thanks [Paldom/angular2-rest](https://github.com/Paldom/angular2-rest) given us the inspiration.

## Install

```bash
npm install rebirth-http --save
```

## Usage

### Step 1, Register `RebirthHttpModule`

```typescript
import { RebirthHttpModule } from '@ng-zorro/rebirth-http';

@NgModule({
  imports: [BrowserModule, RebirthHttpModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Step 2, Create REST Clients

```ts
import {
  Any,
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
} from 'rebirth-http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ArticleService extends RebirthHttpClient {
  constructor(http: HttpClient) {
    super(http);
  }

  @GET('article')
  getArticles(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10
  ): Observable<SearchResult<Article>> {
    return Any; // return Any as a placeholder
  }

  @GET('article/:id')
  getArticleByUrl(@Path('id') articleUrl: string): Observable<Article> {
    return Any;
  }

  @POST('article')
  createArticle(@Body article: Article): Observable {
    return Any;
  }

  @PUT('article/:id')
  updateArticle(
    @Path('id') id: string,
    @Body article: Article
  ): Observable<Article> {
    return Any;
  }

  @DELETE('article/:id')
  deleteArticleById(@Path('id') id: string): Observable<Article> {
    return Any;
  }

  @JSONP('article/:id')
  getArticleByJsonp(
    @Path('id') id: string,
    @Query('name') name: string
  ): Observable<Article> {
    return Any;
  }

  @POST('file/upload')
  upload(@Body formData: FormData): Observable<any> {
    return Any;
  }
}
```

### Interceptor

<!-- TODO: provide a factory injection token... This is not elegant. -->

```typescript
import { config } from '@/config';
import { RebirthHttpProvider } from '@ng-zorro/rebirth-http';

@Component({
  selector: 'app-root',
})
export class AppComponent {
  constructor(rebirthHttpProvider: RebirthHttpProvider) {
    rebirthHttpProvider.baseUrl(config.api.host).addInterceptor({
      request: (request) =>
        console.log('Global interceptors(request)', request),
      response: (response) =>
        console.log('Global interceptors(response)', response),
    });
  }
}
```

## API

### RebirthHttpClient

- `getBaseUrl(): string`: returns the base url of the RebirthHttp client
- `getDefaultHeaders(): { [name: string]: string }`: returns the default headers of RebirthHttp in a key-value pair

### Class Decorators

These decorators should be used on classes that inherit `RebirthHttpClient`.

- `@BaseUrl(url: string)`: change the base url of a RebirthHttpClient
- `@DefaultHeaders(headers: Object)`: change the default header of a RebirthHttpClient

### Method Decorators

#### HTTP Method Decorators

- `@GET(url: string)`
- `@POST(url: string)`
- `@PUT(url: string)`
- `@DELETE(url: string)`
- `@JSONP(url: string)`
- `@PATCH(url: string)`
- `@HEAD(url: string)`
- `@OPTIONS(url: String)`

* `@Headers(headers: any)`
* `@RequestOptions(headers: any)`
* `@Extra(headers: any)`

### Parameter Decorators

- `@Path(key: string)`
- `@Query(key: string)`
- `@Header(key: string)`
- `@Body`

## License

MIT
