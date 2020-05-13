import {
  HttpClientJsonpModule,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgModule } from '@angular/core';

import { RebirthHttpInterceptors } from './interceptor';
import { REBIRTH_HTTP_PROVIDERS } from './service';

@NgModule({
  imports: [HttpClientModule, HttpClientJsonpModule],
  providers: [
    ...REBIRTH_HTTP_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RebirthHttpInterceptors,
      multi: true,
    },
  ],
})
export class RebirthHttpModule {}
