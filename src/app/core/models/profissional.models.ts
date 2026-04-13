type Status = "ATIVO" | "INATIVO";

export interface ProfissionalSaudeRequest {
  nome: string;
  username: string;
  password: string;
}

export interface ProfissionalSaudeComplementoRequest {
  especialidade: string;
  conselho: string;
  numeroRegistro: string;
}

export interface ProfissionalSaudeResponse {
  id: string;
  nome: string;
  username: string;
  especialidade: string;
  conselho: string;
  numeroRegistro: string;
  status: Status;
  cadastroCompleto: boolean;
}
