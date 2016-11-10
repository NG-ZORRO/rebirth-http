# @rebirth/rebirth-http([![Build Status](https://travis-ci.org/greengerong/rebirth-http.svg?branch=master)](https://travis-ci.org/greengerong/rebirth-http))
> Java JPA like http lib for Angular2

Thanks [Paldom/angular2-rest](https://github.com/Paldom/angular2-rest) given us the inspiration.

## Install
```bash
npm install rebirth-http --save
```

## How to use?

### Register `RebirthHttpModuleS`

```typescript
    import { RebirthHttpModule } from 'rebirth-http';
    
    @NgModule({
      imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        RebirthHttpModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        ...ENV_PROVIDERS,
        ...APP_PROVIDERS
      ],
      bootstrap: [
        AppComponent
      ]
    })
    export class AppModule {
    }


    platformBrowserDynamic().bootstrapModule(AppModule)
```
   
### rebirth-http service

```typescript
    import { Injectable } from '@angular/core';
    import { Http, Jsonp } from '@angular/http';
    import { SearchResult } from './SearchResult';
    import { Article } from './article';
    import { Observable } from 'rxjs/Observable';
    import { RebirthHttp, RebirthHttpProvider, BaseUrl, GET, POST, PUT, DELETE, JSONP, Query, Path, Body } from  'rebirth-http';
    
    @Injectable()
    export class ArticleService extends RebirthHttp {
    
      constructor(http: Http, rebirthHttpProvider: RebirthHttpProvider, jsonp: Jsonp) {
        super({ http, jsonp, rebirthHttpProvider});
      }
    
      @GET("article")
      getArticles(@Query("pageIndex") pageIndex = 1,
                  @Query("pageSize") pageSize = 10): Observable<SearchResult<Article>> {
        return null; // leave `return null` due to TypeScript Interface isn't visable in runtime
      }
    
      @GET("article/:id")
      getArticleByUrl(@Path("id") articleUrl: string): Observable<Article> {
        return null;
      }
      
      @POST("article")
      createArticle( @Body article: Article): Observable {
        return null; 
      }
      
      @PUT("article/:id")
      updateArticle( @Path("id") id: string, @Body article: Article): Observable<Article> {
        return null; 
      }
      
      @DELETE("article/:id")
      deleteArticleById( @Path("id") id: string): Observable<Article> {
        return null; 
      }
       
      @JSONP("article/:id")
      getArticleByJsonp(@Path("id") id: string, @Query("name") name: string): Observable<any> {
           return null;
      }
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

### setup `jwt` token and unauthorization http error 

```typescript
    import { Component } from '@angular/core';
    import { BlogFooterComponent } from '../blog-footer';
    import { BlogHeaderComponent } from '../blog-header';
    import { AuthorizationService } from 'rebirth-permission';
    import { RebirthHttpProvider } from 'rebirth-http';
    import { CurrentUser } from '../login/CurrentUser';
    import { Response } from '@angular/http';
    import { Observable } from 'rxjs/Observable';
    import { Router } from '@angular/router';
    
    @Component({
      selector: 'manage-app',
      pipes: [],
      providers: [],
      directives: [BlogHeaderComponent, BlogFooterComponent],
      styles: [
        require('./manage-app.scss')
      ],
      template: require('./manage-app.html')
    })
    export class ManageAppComponent {
      constructor(authorizationService: AuthorizationService,
                  router: Router,
                  rebirthHttpProvider: RebirthHttpProvider) {
        // setup jwt token
        const currentUser = <CurrentUser>authorizationService.getCurrentUser();
        if (currentUser && currentUser.token) {
          rebirthHttpProvider.headers({ Authorization: currentUser.token }); 
        }
        
        // setup unauthorization response error interceptor
        rebirthHttpProvider.addResponseErrorInterceptor((err: Response) => {
          if (err.status === 401 && (err.url.indexOf('/manage/login') === -1)) {
            router.navigateByUrl('/manage/login');
            return Observable.empty();
          }
    
          return Observable.throw(err);
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
- `@JSONP(url: String)`
- `@PATCH(url: String)`
- `@HEAD(url: String)`
- `@Headers(headers: Object)`

### Parameter decorators:
- `@Path(key: string)`
- `@Query(key: string)`
- `@Header(key: string)`
- `@Body`
