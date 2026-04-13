import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { Role, Usuario } from "../models/models";

/** Interface que define o estado da autenticação */
export interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}

/** Usuários de teste do sistema */
const MOCK_USERS: Usuario[] = [
  { id: 1, username: "admin", password: "admin123", role: "ADMINISTRADOR" },
  {
    id: 2,
    username: "profissional",
    password: "prof123",
    role: "PROFISSIONAL_SAUDE",
  },
];

/**
 * Serviço responsável pela autenticação do usuário
 * Gerencia login, logout, sessão persistente e estado de autenticação
 *
 * ⚠️ IMPORTANTE: Este é um mock para demonstração
 * Em produção, conectar com backend e implementar JWT/OAuth
 */
@Injectable({ providedIn: "root" })
export class AuthMock {
  /** Estado compartilhado da autenticação (RxJS BehaviorSubject) */
  private state = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  /** Observable do estado - componentes se inscrevem aqui para monitorar mudanças */
  state$ = this.state.asObservable();

  /** Retorna o usuário atual (getter para acesso rápido) */
  get currentUser(): Usuario | null {
    return this.state.value.user;
  }

  /** Verifica se usuário atual é administrador */
  get isAdmin(): boolean {
    return this.currentUser?.role === "ADMINISTRADOR";
  }

  /** Verifica se usuário atual é profissional de saúde */
  get isProfissional(): boolean {
    return this.currentUser?.role === "PROFISSIONAL_SAUDE";
  }

  /** Verifica se há usuário autenticado */
  get isAuthenticated(): boolean {
    return this.state.value.isAuthenticated;
  }

  /**
   * Autentica usuário com username e password
   * @param username nome de usuário
   * @param password senha
   * @returns Observable com dados do usuário autenticado
   */
  login(username: string, password: string): Observable<Usuario> {
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (!user) return throwError(() => new Error("Usuário ou senha inválidos"));
    return of(user).pipe(
      delay(600), // simula latência de rede
      tap((u) => {
        // Salva estado e persiste em localStorage
        this.state.next({
          user: u,
          token: "mock-jwt-token",
          isAuthenticated: true,
        });
        localStorage.setItem("clinica_user", JSON.stringify(u));
      }),
    );
  }

  /** Faz logout e limpa estado e localStorage */
  logout(): void {
    this.state.next({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("clinica_user");
  }

  /** Tenta restaurar sessão do localStorage (chamado ao inicializar app) */
  restoreSession(): void {
    const stored = localStorage.getItem("clinica_user");
    if (stored) {
      const user: Usuario = JSON.parse(stored);
      this.state.next({ user, token: "mock-jwt-token", isAuthenticated: true });
    }
  }
}
