export type Status = 'ATIVO' | 'INATIVO';
export type Role = 'ADMINISTRADOR' | 'PROFISSIONAL_SAUDE';

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

export type CategoriasPaciente = 'ALUNO' | 'COLABORADOR_UNIDADE' | 'COLABORADOR_ESCOLA' | 'EXTERNO';

export interface Paciente {
  id: number;
  nome: string;
  categoria: CategoriasPaciente;
  email: string;
  telefone: string;
  status: Status;
  prontuarioId?: number;
}

export type TipoAtendimento = 'URGENCIA' | 'EMERGENCIA' | 'CONSULTA' | 'REVISAO';

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
  conselho: string;
  especialidade: string;
  numeroRegistro: string;
  status: Status;
  // Complemento (RF008)
  formacao?: string;
  disponibilidade?: string;
  cadastroCompleto: boolean;
}

export interface Medicacao {
  id: number;
  nome: string;
  descricao: string;
  estoque: number;
  validade: string;
  status: Status;
}

export type TipoRequisicao = 'URGENTE' | 'CRITICO' | 'PREVENTIVO';

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
