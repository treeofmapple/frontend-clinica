import { ApplicationConfig } from "@angular/core";
import { provideRouter, withViewTransitions } from "@angular/router";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { routes } from "./app.routes";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
