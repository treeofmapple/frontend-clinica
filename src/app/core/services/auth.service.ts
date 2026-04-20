import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  Observable,
  tap,
  throwError,
  catchError,
  of,
} from "rxjs";
import { Role, Usuario } from "../models/models";
import { environment } from "../../../environments/environment";
import { LoginResponse } from "../models/models.requests";

export interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface LoginRequest {
  username: string;
  password: string;
}

/** Decodifica o payload de um JWT sem biblioteca externa */
function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

/**
 * Serviço de autenticação — integrado com o backend real.
 * POST /auth/login → { token }
 * O role é extraído do claim 'role' dentro do payload JWT.
 */
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly loginUrl = `${environment.apiUrl}/auth/sign-in`;

  private state = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  state$ = this.state.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): Usuario | null {
    return this.state.value.user;
  }
  get token(): string | null {
    return this.state.value.token;
  }
  get isAuthenticated(): boolean {
    return this.state.value.isAuthenticated;
  }
  get isAdmin(): boolean {
    return this.currentUser?.role === "ADMINISTRADOR";
  }
  get isProfissional(): boolean {
    return this.currentUser?.role === "PROFISSIONAL_SAUDE";
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.loginUrl, {
        username,
        password,
      } as LoginRequest)
      .pipe(tap((res) => this.handleLoginSuccess(res, username)));
  }

  private handleLoginSuccess(res: LoginResponse, username: string): void {
    const payload = decodeJwt(res.token);
    const role: Role = (payload?.["role"] as Role) ?? "PROFISSIONAL_SAUDE";

    const user: Usuario = {
      id: payload?.["sub"] ? parseInt(payload["sub"]) : 0,
      username: payload?.["username"] ?? username,
      role,
    };

    this.state.next({ user, token: res.token, isAuthenticated: true });
    localStorage.setItem("clinica_token", res.token);
    localStorage.setItem("clinica_user", JSON.stringify(user));
  }

  logout(): void {
    this.state.next({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("clinica_token");
    localStorage.removeItem("clinica_user");
  }

  restoreSession(): void {
    const token = localStorage.getItem("clinica_token");
    const stored = localStorage.getItem("clinica_user");
    if (token && stored) {
      try {
        const user: Usuario = JSON.parse(stored);
        this.state.next({ user, token, isAuthenticated: true });
      } catch {
        this.logout();
      }
    }
  }
}
