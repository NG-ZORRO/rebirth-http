import { NgModule, ModuleWithProviders } from '@angular/core';
import { REBIRTH_HTTP_PROVIDERS } from './rebirth-http';

@NgModule({
    providers: [
        ...REBIRTH_HTTP_PROVIDERS
    ],
})
export class RebirthHttpModule {
}
