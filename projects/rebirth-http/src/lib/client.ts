import { HttpClient } from '@angular/common/http';

import { THeaders } from './typings';

export abstract class RebirthHttpClient {
  constructor(protected http: HttpClient) {}

  getBaseUrl(): string {
    return '';
  }

  getDefaultHeaders(): THeaders {
    return {};
  }
}
