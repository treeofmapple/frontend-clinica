import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, switchMap, tap } from "rxjs";
import { LoginRequest, LoginResponse } from "../models/auth.models";
import { UsuarioService } from "./usuario.service";
import { UsuarioResponse } from "../models/usuario.models";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private accessTokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem("access_token"),
  );

  private currentUserSubject = new BehaviorSubject<UsuarioResponse | null>(
    JSON.parse(localStorage.getItem("user_info") || "null"),
  );

  public accessToken$ = this.accessTokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
  ) {}

  login(request: LoginRequest): Observable<UsuarioResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/sign-in`, request, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => this.saveAccessToken(res.token!)),
        switchMap(() => this.usuarioService.eu()),
        tap((user) => {
          localStorage.setItem("user_info", JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    this.clearSession();
  }

  private saveAccessToken(token: string): void {
    localStorage.setItem("access_token", token);
    this.accessTokenSubject.next(token);
  }

  private clearSession(): void {
    localStorage.removeItem("access_token");
    this.accessTokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.accessTokenSubject.value;
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === "ADMINISTRADOR";
  }
}
