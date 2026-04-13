import { Routes } from "@angular/router";
import { authGuard, adminGuard } from "./core/guards/auth.guard";

/**
 * Rotas principais da aplicação
 *
 * Estrutura:
 * - /login: Tela pública de autenticação
 * - /admin: Painel administrativo (protegido por authGuard + adminGuard)
 * - /profissional: Painel do profissional de saúde (protegido por authGuard)
 *
 * Lazy Loading: Componentes carregados sob demanda para performance
 */
export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },

  // ── Login (público) ──
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login.component").then((m) => m.LoginComponent),
  },

  // ── Painel do Administrador (protegido) ──
  {
    path: "admin",
    loadComponent: () =>
      import("./shared/components/shell.component").then(
        (m) => m.ShellComponent,
      ),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/admin/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: "escolas",
        loadComponent: () =>
          import("./features/admin/escolas/escolas.component").then(
            (m) => m.EscolasComponent,
          ),
      },
      {
        path: "unidades",
        loadComponent: () =>
          import("./features/admin/unidades/unidades.component").then(
            (m) => m.UnidadesComponent,
          ),
      },
      {
        path: "profissionais",
        loadComponent: () =>
          import("./features/admin/profissionais/profissionais.component").then(
            (m) => m.ProfissionaisComponent,
          ),
      },
      {
        path: "medicacoes",
        loadComponent: () =>
          import("./features/admin/medicacoes/medicacoes.component").then(
            (m) => m.MedicacoesComponent,
          ),
      },
      {
        path: "relatorios",
        loadComponent: () =>
          import("./features/admin/relatorios/relatorios.component").then(
            (m) => m.RelatoriosComponent,
          ),
      },
    ],
  },

  // ── Painel do Profissional de Saúde (protegido) ──
  {
    path: "profissional",
    loadComponent: () =>
      import("./shared/components/shell.component").then(
        (m) => m.ShellComponent,
      ),
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "pacientes", pathMatch: "full" },
      {
        path: "cadastro",
        loadComponent: () =>
          import("./features/profissional/cadastro/meu-cadastro.component").then(
            (m) => m.MeuCadastroComponent,
          ),
      },
      {
        path: "pacientes",
        loadComponent: () =>
          import("./features/profissional/pacientes/pacientes.component").then(
            (m) => m.PacientesComponent,
          ),
      },
      {
        path: "atendimentos",
        loadComponent: () =>
          import("./features/profissional/atendimentos/atendimentos.component").then(
            (m) => m.AtendimentosComponent,
          ),
      },
      {
        path: "prontuarios",
        loadComponent: () =>
          import("./features/profissional/prontuarios/prontuarios.component").then(
            (m) => m.ProntuariosComponent,
          ),
      },
      {
        path: "requisicoes",
        loadComponent: () =>
          import("./features/profissional/requisicoes/requisicoes.component").then(
            (m) => m.RequisicoesComponent,
          ),
      },
    ],
  },

  // ── Rota curinga (redireciona para login) ──
  { path: "**", redirectTo: "/login" },
];
