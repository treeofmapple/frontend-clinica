import { Status, Usuario } from "./models";

// ── DTOs que espelham exatamente os records do backend ──────────────────────
export interface EscolaRequest {
  nome: string;
  ies: string;
  coordenador: string;
}

export interface UnidadeRequest {
  nome: string;
  ies: string;
  responsavel: string;
}

export interface ProfissionalCadastroRequest {
  nome: string;
  username: string;
  password: string;
}

export interface ProfissionalComplementoRequest {
  especialidade: string;
  conselho: string;
  numeroRegistro: string;
  formacao?: string;
  diasAtendimento?: string;
  turnosAtendimento?: string;
}

export interface MedicamentoRequest {
  nome: string;
  descricao?: string;
  quantidade: number;
  unidadeMedida?: string;
  ativo?: boolean;
}

export interface MedicamentoUpdate {
  id: string;
  nome?: string;
  descricao?: string;
  quantidade?: number;
  unidadeMedida?: string;
  ativo?: boolean;
}

export interface AtendimentoRequest {
  pacienteId: number;
  profissionalId?: number;
  descricao?: string;
  observacoes?: string;
  dataAtendimento?: string;
  status?: Status;
}

export interface AtendimentoUpdate {
  id: string;
  pacienteId: number;
  profissionalId?: number;
  descricao?: string;
  observacoes?: string;
  dataAtendimento?: string;
  status?: Status;
}

export interface PacienteRequest {
  nome: string;
  cpf?: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  responsavel?: string;
  ativo?: boolean;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
