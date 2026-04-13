type Roles = "ADMINISTRADOR" | "PROFISSIONAL_SAUDE";

export interface UsuarioResponse {
  username: string;
  role: Roles;
}
