# @rebirth/rebirth-http
> Java JPA like http lib for Angular2

Thanks [Paldom/angular2-rest](https://github.com/Paldom/angular2-rest) given us the inspiration.

## Install
```bash
npm install rebirth-http --save-dev
```

## How to use?

### Register `REBIRTH_HTTP_PROVIDERS`

```typescript
    import { REBIRTH_HTTP_PROVIDERS } from 'rebirth-http';
    
    bootstrap(AppComponent,[ ...REBIRTH_HTTP_PROVIDERS]);
```
   
### rebirth-http service

```typescript
    import { Injectable } from '@angular/core';
    import { Http } from '@angular/http';
    import { SearchResult } from './SearchResult';
    import { Article } from './article';
    import { Observable } from 'rxjs/Observable';
    import { RebirthHttp, RebirthHttpProvider, BaseUrl, GET, Query, Path } from 'rebirth-http';
    
    @Injectable()
    export class ArticleService extends RebirthHttp {
    
      constructor(http: Http, rebirthHttpProvider: RebirthHttpProvider) {
        super(http, rebirthHttpProvider);
      }
    
      @GET('article')
      getArticles(@Query('pageIndex') pageIndex = 1,
                  @Query('pageSize') pageSize = 10): Observable<SearchResult<Article>> {
        return null; // leave `return null` due to TypeScript Interface isn't visable in runtime
      }
    
      @GET('article/:id')
      getArticleByUrl(@Path('id') articleUrl: string): Observable<Article> {
        return null;
      }
      
      @POST("article")
      createArticle( @Body article: Article): Observable {
        return null; 
      };
      
      @PUT("article/:id")
      updateArticle( @Path("id") id: string, @Body article: Article): Observable {
        return null; 
      };
      
      @DELETE("article/:id")
      deleteArticleById( @Path("id") id: string): Observable {
        return null; 
      };

    }
```

### Global interceptors

```typescript
    import { RebirthHttpProvider } from 'rebirth-http';
    
    @Component({
      selector: 'app',
      pipes: [],
      providers: [],
      directives: [],
      styles: [
        require('./app.scss')
      ],
      template: '<router-outlet></router-outlet>'
    })
    export class AppComponent {
    
      constructor(rebirthHttpProvider: RebirthHttpProvider) {
    
        rebirthHttpProvider
          .baseUrl(config.api.host)
          .json()
          .addInterceptor({
            request: request => {
              console.log('Global interceptors(request)', request);
            },
            response: (stream) => stream.map(response => {
              console.log('Global interceptors(response)', response);
              return response;
            })
          });
      }
    }
```   
    
## API Docs

### rebirth-http

#### Methods:
- `getBaseUrl(): string`: returns the base url of RebirthHttp
- `getDefaultHeaders(): Object`: returns the default headers of RebirthHttp in a key-value pair

### Class decorators:
- `@BaseUrl(url: string)`
- `@DefaultHeaders(headers: Object)`

### Method decorators:
- `@GET(url: String)`
- `@POST(url: String)`
- `@PUT(url: String)`
- `@DELETE(url: String)`
- `@Headers(headers: Object)`

### Parameter decorators:
- `@Path(key: string)`
- `@Query(key: string)`
- `@Header(key: string)`
- `@Body`
