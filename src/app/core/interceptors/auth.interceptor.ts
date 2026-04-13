// src/app/core/interceptors/auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    request = this.addTokenHeader(request, token);

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !request.url.includes("/auth/")
        ) {
          this.authService.logout();
          this.router.navigate(["/home"]);
        }
        return throwError(() => error);
      }),
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string | null) {
    if (token) {
      return request.clone({
        withCredentials: true,
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return request.clone({ withCredentials: true });
  }
}
