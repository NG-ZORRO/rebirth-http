import {
  HttpEventType,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RebirthHttpProvider } from './service';

@Injectable()
export class RebirthHttpInterceptors implements HttpInterceptor {
  constructor(private rebirthHttpProvider: RebirthHttpProvider) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    const httpRequest = this.rebirthHttpProvider.handleRequest(req);
    return next.handle(httpRequest).pipe(
      map((response) => {
        if (
          [HttpEventType.Response, HttpEventType.ResponseHeader].indexOf(
            response.type
          ) !== -1
        ) {
          return (
            this.rebirthHttpProvider.handleResponse(response, httpRequest) ||
            response
          );
        }
        return response;
      }),
      catchError((error) =>
        throwError(
          this.rebirthHttpProvider.handleResponse(error, httpRequest) || error
        )
      )
    );
  }
}
