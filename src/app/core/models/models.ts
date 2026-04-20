export type Status = "ATIVO" | "INATIVO";
export type Role = "ADMINISTRADOR" | "PROFISSIONAL_SAUDE";
export type VinculoPaciente = "ESCOLA" | "UNIDADE" | "REITORIA";
export type ArmazenamentoMedicacao = "REFRIGERACAO" | "TEMPERATURA_AMBIENTE";
export type TipoRequisicao = "URGENTE" | "CRITICO" | "PREVENTIVO";
export type CategoriasPaciente =
  | "ALUNO"
  | "COLABORADOR_UNIDADE"
  | "COLABORADOR_ESCOLA"
  | "EXTERNO";

export type TipoAtendimento =
  | "URGENCIA"
  | "EMERGENCIA"
  | "CONSULTA"
  | "REVISAO";

export interface Usuario {
  id: number;
  username: string;
  password?: string;
  role: Role;
}

export interface Escola {
  id: number;
  nome: string;
  coordenador: string;
  ies: string;
  status: Status;
}

export interface Unidade {
  id: number;
  nome: string;
  responsavel: string;
  ies: string;
  status: Status;
}

export interface Paciente {
  id: number;
  nome: string;
  categoria: CategoriasPaciente;
  vinculoTipo: VinculoPaciente;
  vinculoNome: string;
  escolaId?: number;
  unidadeId?: number;
  email: string;
  telefone: string;
  status: Status;
  prontuarioId?: number;
}

export interface Atendimento {
  id: number;
  pacienteId: number;
  pacienteNome?: string;
  profissionalId: number;
  profissionalNome?: string;
  dataInicio: string;
  dataFim?: string;
  sintomas: string;
  diagnostico: string;
  tratamento: string;
  tipo: TipoAtendimento;
  medicacoesUsadas?: UsoMedicacao[];
}

export interface UsoMedicacao {
  medicacaoId: number;
  medicacaoNome?: string;
  quantidade: number;
  dosagem: string;
}

export interface Prontuario {
  id: number;
  pacienteId: number;
  pacienteNome?: string;
  atendimentos: Atendimento[];
}

export interface ProfissionalSaude {
  id: number;
  nome: string;
  username: string;
  usuarioId?: number;
  formacao: string;
  conselho: string;
  especialidade: string;
  numeroRegistro: string;
  diasAtendimento: string;
  turnosAtendimento: string;
  dataCadastro: string;
  status: Status;
  cadastroCompleto: boolean;
}

export interface Medicamento {
  id: number;
  nome: string;
  descricao: string;
  fornecedor: string;
  armazenamento: ArmazenamentoMedicacao;
  estoque: number;
  dataAquisicao: string;
  validade: string;
  status: Status;
}

export interface RequisicaoMedicacao {
  id: number;
  medicacaoId: number;
  medicacaoNome?: string;
  quantidade: number;
  tipo: TipoRequisicao;
  profissionalId: number;
  data: string;
  observacao?: string;
}

export interface StatusDashboard {
  totalPacientes: number;
  totalAtendimentos: number;
  totalProfissionais: number;
  totalMedicacoes: number;
  totalRequisicoes: number;
}
