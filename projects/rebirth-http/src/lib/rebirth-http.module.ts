import { NgModule } from '@angular/core';
import { REBIRTH_HTTP_PROVIDERS, RebirthHttpInterceptors } from './rebirth-http';
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        HttpClientModule,
        HttpClientJsonpModule,
    ],
    providers: [
        ...REBIRTH_HTTP_PROVIDERS,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RebirthHttpInterceptors,
            multi: true,
        }
    ],
})
export class RebirthHttpModule {
}
