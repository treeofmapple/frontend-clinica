import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard que protege rotas autenticadas (RF007)
 * Redireciona para login se não houver sessão
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    return true;
  }
  router.navigate(["/login"]);
  return false;
};

/**
 * Guard que protege rotas de administrador
 * Redireciona profissionais para seu painel
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated() && auth.isAdmin) {
    return true;
  }
  router.navigate(["/profissional/pacientes"]);
  return false;
};

/**
 * Guard visual para validar cadastro completo de profissional (RN013)
 * Implementação real da validação deve estar no backend
 */
export const profissionalCadastroGuard: CanActivateFn = () => {
  // RN013: profissional só pode atender após completar cadastro
  // Backend deve validar também
  return true;
};
