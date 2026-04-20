import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { delay, map } from "rxjs/operators";
import {
  Escola,
  Unidade,
  Paciente,
  Atendimento,
  Prontuario,
  ProfissionalSaude,
  Medicamento,
  UsoMedicacao,
  Usuario,
  VinculoPaciente,
  RequisicaoMedicacao,
} from "../models/models";
import { LoginResponse } from "../models/models.requests";

/**
 * Serviço central de dados
 * Gerencia CRUD de todas as entidades e implementa as regras de negócio (RN001-RN013)
 *
 * ⚠️ IMPORTANTE: Todos os dados estão em memória (BehaviorSubject)
 * Em produção, substituir por chamadas HTTP para um backend real
 */

// ────────── Mock Data ──────────
const ESCOLAS_MOCK: Escola[] = [
  {
    id: 1,
    nome: "Escola de Medicina",
    coordenador: "Dr. Carlos Mendes",
    ies: "IES Central",
    status: "ATIVO",
  },
  {
    id: 2,
    nome: "Escola de Enfermagem",
    coordenador: "Dra. Ana Lima",
    ies: "IES Central",
    status: "ATIVO",
  },
  {
    id: 3,
    nome: "Escola de Fisioterapia",
    coordenador: "Prof. João Silva",
    ies: "IES Norte",
    status: "INATIVO",
  },
];
const UNIDADES_MOCK: Unidade[] = [
  {
    id: 1,
    nome: "Unidade Central",
    responsavel: "Maria Souza",
    ies: "IES Central",
    status: "ATIVO",
  },
  {
    id: 2,
    nome: "Unidade Norte",
    responsavel: "Pedro Costa",
    ies: "IES Norte",
    status: "ATIVO",
  },
  {
    id: 3,
    nome: "Unidade Sul",
    responsavel: "Lucia Ferreira",
    ies: "IES Sul",
    status: "INATIVO",
  },
];
const PROFISSIONAIS_MOCK: ProfissionalSaude[] = [
  {
    id: 1,
    nome: "Dr. Ricardo Alves",
    username: "ricardo",
    formacao: "Medicina",
    conselho: "CRM",
    especialidade: "Clínica Geral",
    numeroRegistro: "CRM-12345",
    diasAtendimento: "SEG, QUA, SEX",
    turnosAtendimento: "MANHA",
    dataCadastro: "2025-01-10",
    status: "ATIVO",
    cadastroCompleto: true,
  },
  {
    id: 2,
    nome: "Dra. Patrícia Nunes",
    username: "patricia",
    formacao: "Odontologia",
    conselho: "CRO",
    especialidade: "Odontologia",
    numeroRegistro: "CRO-98765",
    diasAtendimento: "TER, QUI",
    turnosAtendimento: "TARDE",
    dataCadastro: "2025-01-15",
    status: "ATIVO",
    cadastroCompleto: true,
  },
  {
    id: 3,
    nome: "Enf. Bruno Rocha",
    username: "bruno",
    formacao: "",
    conselho: "COREN",
    especialidade: "Enfermagem",
    numeroRegistro: "COREN-55432",
    diasAtendimento: "",
    turnosAtendimento: "",
    dataCadastro: "2025-03-01",
    status: "ATIVO",
    cadastroCompleto: false,
  },
];
const USUARIOS_MOCK: Usuario[] = [
  { id: 1, username: "admin", password: "admin123", role: "ADMINISTRADOR" },
  {
    id: 2,
    username: "profissional",
    password: "prof123",
    role: "PROFISSIONAL_SAUDE",
  },
  {
    id: 3,
    username: "ricardo",
    password: "ricardo123",
    role: "PROFISSIONAL_SAUDE",
  },
  {
    id: 4,
    username: "patricia",
    password: "patricia123",
    role: "PROFISSIONAL_SAUDE",
  },
  {
    id: 5,
    username: "bruno",
    password: "bruno123",
    role: "PROFISSIONAL_SAUDE",
  },
];
const PACIENTES_MOCK: Paciente[] = [
  {
    id: 1,
    nome: "Mariana Torres",
    categoria: "ALUNO",
    vinculoTipo: "ESCOLA",
    vinculoNome: "Escola de Medicina",
    escolaId: 1,
    email: "mariana@ies.edu.br",
    telefone: "71 99999-1111",
    status: "ATIVO",
    prontuarioId: 1,
  },
  {
    id: 2,
    nome: "Felipe Andrade",
    categoria: "COLABORADOR_UNIDADE",
    vinculoTipo: "UNIDADE",
    vinculoNome: "Unidade Central",
    unidadeId: 1,
    email: "felipe@ies.edu.br",
    telefone: "71 99999-2222",
    status: "ATIVO",
    prontuarioId: 2,
  },
  {
    id: 3,
    nome: "Carla Moreira",
    categoria: "EXTERNO",
    vinculoTipo: "REITORIA",
    vinculoNome: "Reitoria",
    email: "carla@gmail.com",
    telefone: "71 99999-3333",
    status: "INATIVO",
    prontuarioId: 3,
  },
];
const MEDICACOES_MOCK: Medicamento[] = [
  {
    id: 1,
    nome: "Dipirona 500mg",
    descricao: "Analgésico e antipirético",
    fornecedor: "Laboratorio Alpha",
    armazenamento: "TEMPERATURA_AMBIENTE",
    estoque: 150,
    dataAquisicao: "2025-02-10",
    validade: "2026-06-30",
    status: "ATIVO",
  },
  {
    id: 2,
    nome: "Ibuprofeno 400mg",
    descricao: "Anti-inflamatório",
    fornecedor: "Farmaceutica Beta",
    armazenamento: "TEMPERATURA_AMBIENTE",
    estoque: 80,
    dataAquisicao: "2025-02-18",
    validade: "2025-12-31",
    status: "ATIVO",
  },
  {
    id: 3,
    nome: "Paracetamol 750mg",
    descricao: "Analgésico",
    fornecedor: "Laboratorio Gama",
    armazenamento: "TEMPERATURA_AMBIENTE",
    estoque: 0,
    dataAquisicao: "2025-01-20",
    validade: "2026-03-15",
    status: "ATIVO",
  },
  {
    id: 4,
    nome: "Amoxicilina 500mg",
    descricao: "Antibiótico",
    fornecedor: "Laboratorio Delta",
    armazenamento: "REFRIGERACAO",
    estoque: 45,
    dataAquisicao: "2024-12-05",
    validade: "2024-01-01",
    status: "INATIVO",
  },
];
const ATENDIMENTOS_MOCK: Atendimento[] = [
  {
    id: 1,
    pacienteId: 1,
    pacienteNome: "Mariana Torres",
    profissionalId: 1,
    profissionalNome: "Dr. Ricardo Alves",
    dataInicio: "2025-03-10T09:00",
    dataFim: "2025-03-10T09:45",
    sintomas: "Cefaleia intensa",
    diagnostico: "Enxaqueca",
    tratamento: "Repouso e hidratação",
    tipo: "CONSULTA",
    medicacoesUsadas: [
      {
        medicacaoId: 1,
        medicacaoNome: "Dipirona 500mg",
        quantidade: 2,
        dosagem: "1 comprimido de 8/8h",
      },
    ],
  },
  {
    id: 2,
    pacienteId: 2,
    pacienteNome: "Felipe Andrade",
    profissionalId: 2,
    profissionalNome: "Dra. Patrícia Nunes",
    dataInicio: "2025-03-12T14:00",
    dataFim: "2025-03-12T14:30",
    sintomas: "Dor de dente",
    diagnostico: "Cárie",
    tratamento: "Extração simples",
    tipo: "URGENCIA",
    medicacoesUsadas: [],
  },
];
const PRONTUARIOS_MOCK: Prontuario[] = [
  {
    id: 1,
    pacienteId: 1,
    pacienteNome: "Mariana Torres",
    atendimentos: [ATENDIMENTOS_MOCK[0]],
  },
  {
    id: 2,
    pacienteId: 2,
    pacienteNome: "Felipe Andrade",
    atendimentos: [ATENDIMENTOS_MOCK[1]],
  },
  { id: 3, pacienteId: 3, pacienteNome: "Carla Moreira", atendimentos: [] },
];
const REQUISICOES_MOCK: RequisicaoMedicacao[] = [
  {
    id: 1,
    medicacaoId: 3,
    medicacaoNome: "Paracetamol 750mg",
    quantidade: 100,
    tipo: "URGENTE",
    profissionalId: 1,
    data: "2025-03-15",
    observacao: "Estoque zerado",
  },
  {
    id: 2,
    medicacaoId: 2,
    medicacaoNome: "Ibuprofeno 400mg",
    quantidade: 50,
    tipo: "PREVENTIVO",
    profissionalId: 2,
    data: "2025-03-14",
  },
];

@Injectable({ providedIn: "root" })
export class DataService {
  // BehaviorSubjects para cada entidade - permite reatividade em tempo real
  private escolas$ = new BehaviorSubject<Escola[]>([...ESCOLAS_MOCK]);
  private unidades$ = new BehaviorSubject<Unidade[]>([...UNIDADES_MOCK]);
  private profissionais$ = new BehaviorSubject<ProfissionalSaude[]>([
    ...PROFISSIONAIS_MOCK,
  ]);
  private pacientes$ = new BehaviorSubject<Paciente[]>([...PACIENTES_MOCK]);
  private medicacoes$ = new BehaviorSubject<Medicamento[]>([
    ...MEDICACOES_MOCK,
  ]);
  private atendimentos$ = new BehaviorSubject<Atendimento[]>([
    ...ATENDIMENTOS_MOCK,
  ]);
  private prontuarios$ = new BehaviorSubject<Prontuario[]>([
    ...PRONTUARIOS_MOCK,
  ]);
  private requisicoes$ = new BehaviorSubject<RequisicaoMedicacao[]>([
    ...REQUISICOES_MOCK,
  ]);
  private currentUser$ = new BehaviorSubject<Usuario | null>(null);

  // Rastreador de IDs para cada entidade (para novas criações)
  private nextIds: Record<string, number> = {
    escola: 4,
    unidade: 4,
    profissional: 4,
    paciente: 4,
    medicacao: 5,
    atendimento: 3,
    prontuario: 4,
    requisicao: 3,
  };

  private resolveVinculoPaciente(data: Partial<Paciente>): {
    vinculoTipo: VinculoPaciente;
    vinculoNome: string;
    escolaId?: number;
    unidadeId?: number;
  } {
    if (data.vinculoTipo === "ESCOLA") {
      const escolaId = data.escolaId ?? this.escolas$.value[0]?.id;
      const escola = this.escolas$.value.find((e) => e.id === escolaId);
      return {
        vinculoTipo: "ESCOLA",
        vinculoNome: escola?.nome ?? "Escola vinculada",
        escolaId,
      };
    }

    if (data.vinculoTipo === "UNIDADE") {
      const unidadeId = data.unidadeId ?? this.unidades$.value[0]?.id;
      const unidade = this.unidades$.value.find((u) => u.id === unidadeId);
      return {
        vinculoTipo: "UNIDADE",
        vinculoNome: unidade?.nome ?? "Unidade vinculada",
        unidadeId,
      };
    }

    return {
      vinculoTipo: "REITORIA",
      vinculoNome: "Reitoria",
    };
  }

  // ── ESCOLAS ── (RN001, RN003)
  getEscolas(): Observable<Escola[]> {
    return this.escolas$.asObservable();
  }

  saveEscola(data: Partial<Escola>): Observable<Escola> {
    const list = this.escolas$.value;
    // RN003: Validar coordenador único por escola
    const dupl = list.find(
      (e) => e.coordenador === data.coordenador && e.id !== data.id,
    );
    if (dupl)
      return throwError(
        () => new Error("Cada escola deve ter apenas um coordenador."),
      );
    if (data.id) {
      // Editar existente
      const updated = list.map((e) =>
        e.id === data.id ? ({ ...e, ...data } as Escola) : e,
      );
      this.escolas$.next(updated);
      return of(updated.find((e) => e.id === data.id)!).pipe(delay(300));
    }
    // Criar novo
    const nova: Escola = {
      id: this.nextIds["escola"]++,
      status: "ATIVO",
      ...data,
    } as Escola;
    this.escolas$.next([...list, nova]);
    return of(nova).pipe(delay(300));
  }

  /** RN001: Inativar (não excluir) */
  inativarEscola(id: number): Observable<void> {
    this.escolas$.next(
      this.escolas$.value.map((e) =>
        e.id === id ? { ...e, status: "INATIVO" } : e,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  ativarEscola(id: number): Observable<void> {
    this.escolas$.next(
      this.escolas$.value.map((e) =>
        e.id === id ? { ...e, status: "ATIVO" } : e,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  // ── UNIDADES ── (RN002, RN004)
  getUnidades(): Observable<Unidade[]> {
    return this.unidades$.asObservable();
  }

  saveUnidade(data: Partial<Unidade>): Observable<Unidade> {
    const list = this.unidades$.value;
    // RN004: Validar responsável único por unidade
    const dupl = list.find(
      (u) => u.responsavel === data.responsavel && u.id !== data.id,
    );
    if (dupl)
      return throwError(
        () => new Error("Cada unidade deve ter apenas um responsável."),
      );
    if (data.id) {
      const updated = list.map((u) =>
        u.id === data.id ? ({ ...u, ...data } as Unidade) : u,
      );
      this.unidades$.next(updated);
      return of(updated.find((u) => u.id === data.id)!).pipe(delay(300));
    }
    const nova: Unidade = {
      id: this.nextIds["unidade"]++,
      status: "ATIVO",
      ...data,
    } as Unidade;
    this.unidades$.next([...list, nova]);
    return of(nova).pipe(delay(300));
  }

  /** RN002: Inativar (não excluir) */
  inativarUnidade(id: number): Observable<void> {
    this.unidades$.next(
      this.unidades$.value.map((u) =>
        u.id === id ? { ...u, status: "INATIVO" } : u,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  ativarUnidade(id: number): Observable<void> {
    this.unidades$.next(
      this.unidades$.value.map((u) =>
        u.id === id ? { ...u, status: "ATIVO" } : u,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  // ── PROFISSIONAIS ── (RN005, RN013)
  getProfissionais(): Observable<ProfissionalSaude[]> {
    return this.profissionais$.asObservable();
  }

  saveProfissional(
    data: Partial<ProfissionalSaude>,
  ): Observable<ProfissionalSaude> {
    const list = this.profissionais$.value;
    if (data.id) {
      const updated = list.map((p) =>
        p.id === data.id ? ({ ...p, ...data } as ProfissionalSaude) : p,
      );
      this.profissionais$.next(updated);
      return of(updated.find((p) => p.id === data.id)!).pipe(delay(300));
    }
    const hoje = new Date().toISOString().split("T")[0];
    const novo: ProfissionalSaude = {
      id: this.nextIds["profissional"]++,
      status: "ATIVO",
      cadastroCompleto: false,
      formacao: "",
      diasAtendimento: "",
      turnosAtendimento: "",
      dataCadastro: hoje,
      ...data,
    } as ProfissionalSaude;
    this.profissionais$.next([...list, novo]);
    return of(novo).pipe(delay(300));
  }

  /** RN013: Completar cadastro para poder atender */
  completarCadastro(
    id: number,
    data: Partial<ProfissionalSaude>,
  ): Observable<ProfissionalSaude> {
    const list = this.profissionais$.value;
    const updated = list.map((p) =>
      p.id === id
        ? ({ ...p, ...data, cadastroCompleto: true } as ProfissionalSaude)
        : p,
    );
    this.profissionais$.next(updated);
    return of(updated.find((p) => p.id === id)!).pipe(delay(300));
  }

  /** RN005: Inativar (não excluir) */
  inativarProfissional(id: number): Observable<void> {
    this.profissionais$.next(
      this.profissionais$.value.map((p) =>
        p.id === id ? { ...p, status: "INATIVO" } : p,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  ativarProfissional(id: number): Observable<void> {
    this.profissionais$.next(
      this.profissionais$.value.map((p) =>
        p.id === id ? { ...p, status: "ATIVO" } : p,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  // ── PACIENTES ── (RN006, RN007, RN008)
  getPacientes(): Observable<Paciente[]> {
    return this.pacientes$.asObservable();
  }

  savePaciente(data: Partial<Paciente>): Observable<Paciente> {
    const list = this.pacientes$.value;
    if (data.id) {
      const current = list.find((p) => p.id === data.id);
      const vinculo = this.resolveVinculoPaciente({ ...current, ...data });
      const updated = list.map((p) =>
        p.id === data.id ? ({ ...p, ...data, ...vinculo } as Paciente) : p,
      );
      this.pacientes$.next(updated);
      return of(updated.find((p) => p.id === data.id)!).pipe(delay(300));
    }
    // RN007: Criar prontuário automaticamente
    const prontuarioId = this.nextIds["prontuario"];
    const vinculo = this.resolveVinculoPaciente(data);
    const novo: Paciente = {
      id: this.nextIds["paciente"]++,
      status: "ATIVO",
      prontuarioId,
      ...vinculo,
      ...data,
    } as Paciente;
    // RN008: Prontuário vinculado ao paciente
    const prontuario: Prontuario = {
      id: this.nextIds["prontuario"]++,
      pacienteId: novo.id,
      pacienteNome: novo.nome,
      atendimentos: [],
    };
    this.pacientes$.next([...list, novo]);
    this.prontuarios$.next([...this.prontuarios$.value, prontuario]);
    return of(novo).pipe(delay(300));
  }

  /** RN006: Inativar (não excluir) */
  inativarPaciente(id: number): Observable<void> {
    this.pacientes$.next(
      this.pacientes$.value.map((p) =>
        p.id === id ? { ...p, status: "INATIVO" } : p,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  ativarPaciente(id: number): Observable<void> {
    this.pacientes$.next(
      this.pacientes$.value.map((p) =>
        p.id === id ? { ...p, status: "ATIVO" } : p,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  // ── MEDICAÇÕES ── (RN009)
  getMedicacoes(): Observable<Medicamento[]> {
    return this.medicacoes$.asObservable();
  }

  saveMedicacao(data: Partial<Medicamento>): Observable<Medicamento> {
    const list = this.medicacoes$.value;
    if (data.id) {
      const updated = list.map((m) =>
        m.id === data.id ? ({ ...m, ...data } as Medicamento) : m,
      );
      this.medicacoes$.next(updated);
      return of(updated.find((m) => m.id === data.id)!).pipe(delay(300));
    }
    const nova: Medicamento = {
      id: this.nextIds["medicacao"]++,
      status: "ATIVO",
      fornecedor: "",
      armazenamento: "TEMPERATURA_AMBIENTE",
      dataAquisicao: new Date().toISOString().split("T")[0],
      ...data,
    } as Medicamento;
    this.medicacoes$.next([...list, nova]);
    return of(nova).pipe(delay(300));
  }

  /** RN009: Inativar (não excluir) */
  inativarMedicacao(id: number): Observable<void> {
    this.medicacoes$.next(
      this.medicacoes$.value.map((m) =>
        m.id === id ? { ...m, status: "INATIVO" } : m,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  ativarMedicacao(id: number): Observable<void> {
    this.medicacoes$.next(
      this.medicacoes$.value.map((m) =>
        m.id === id ? { ...m, status: "ATIVO" } : m,
      ),
    );
    return of(void 0).pipe(delay(200));
  }

  // ── ATENDIMENTOS ── (RN010, RN011, RN012)
  getAtendimentos(): Observable<Atendimento[]> {
    return this.atendimentos$.asObservable();
  }

  saveAtendimento(
    data: Partial<Atendimento>,
  ): Observable<Atendimento | string> {
    // RN012: Validar que fim > inicio
    if (
      data.dataFim &&
      data.dataInicio &&
      new Date(data.dataFim) <= new Date(data.dataInicio)
    ) {
      return throwError(
        () =>
          new Error(
            "O horário de encerramento deve ser posterior ao horário de início.",
          ),
      );
    }

    // RN010: Validar medicações (ativa, válida, com estoque)
    const meds = this.medicacoes$.value;
    const today = new Date().toISOString().split("T")[0];
    for (const uso of data.medicacoesUsadas || []) {
      const med = meds.find((m) => m.id === uso.medicacaoId);
      if (!med) return throwError(() => new Error(`Medicação não encontrada.`));
      if (med.status !== "ATIVO")
        return throwError(() => new Error(`${med.nome} está inativa.`));
      if (med.validade < today)
        return throwError(() => new Error(`${med.nome} está vencida.`));
      if (med.estoque < uso.quantidade)
        return throwError(
          () => new Error(`Estoque insuficiente de ${med.nome}.`),
        );
    }

    // RN013: Validar que profissional tem cadastro completo
    if (data.profissionalId) {
      const prof = this.profissionais$.value.find(
        (p) => p.id === data.profissionalId,
      );
      if (prof && !prof.cadastroCompleto) {
        return throwError(
          () =>
            new Error(
              "Profissional deve completar cadastro antes de registrar atendimentos.",
            ),
        );
      }
    }

    const list = this.atendimentos$.value;
    let atendimento: Atendimento;
    if (data.id) {
      const updated = list.map((a) =>
        a.id === data.id ? ({ ...a, ...data } as Atendimento) : a,
      );
      this.atendimentos$.next(updated);
      atendimento = updated.find((a) => a.id === data.id)!;
    } else {
      atendimento = {
        id: this.nextIds["atendimento"]++,
        ...data,
      } as Atendimento;
      this.atendimentos$.next([...list, atendimento]);

      // RN011: Atualizar estoque automaticamente
      this.atualizarEstoque(data.medicacoesUsadas || []);

      // Adicionar atendimento ao prontuário do paciente
      const pronts = this.prontuarios$.value;
      const pront = pronts.find((p) => p.pacienteId === data.pacienteId);
      if (pront) {
        const updatedPronts = pronts.map((p) =>
          p.pacienteId === data.pacienteId
            ? { ...p, atendimentos: [...p.atendimentos, atendimento] }
            : p,
        );
        this.prontuarios$.next(updatedPronts);
      }
    }
    return of(atendimento).pipe(delay(300));
  }

  /** RN011: Decrementa estoque de medicações usadas */
  private atualizarEstoque(usos: UsoMedicacao[]): void {
    const meds = this.medicacoes$.value;
    const updated = meds.map((m) => {
      const uso = usos.find((u) => u.medicacaoId === m.id);
      return uso ? { ...m, estoque: m.estoque - uso.quantidade } : m;
    });
    this.medicacoes$.next(updated);
  }

  // ── PRONTUÁRIOS ──
  getProntuarios(): Observable<Prontuario[]> {
    return this.prontuarios$.asObservable();
  }

  getProntuarioByPaciente(
    pacienteId: number,
  ): Observable<Prontuario | undefined> {
    return this.prontuarios$.pipe(
      map((list) => list.find((p) => p.pacienteId === pacienteId)),
    );
  }

  // ── REQUISIÇÕES ──
  getRequisicoes(): Observable<RequisicaoMedicacao[]> {
    return this.requisicoes$.asObservable();
  }

  saveRequisicao(
    data: Partial<RequisicaoMedicacao>,
  ): Observable<RequisicaoMedicacao> {
    const nova: RequisicaoMedicacao = {
      id: this.nextIds["requisicao"]++,
      data: new Date().toISOString().split("T")[0],
      ...data,
    } as RequisicaoMedicacao;
    this.requisicoes$.next([...this.requisicoes$.value, nova]);
    return of(nova).pipe(delay(300));
  }

  // ── ESTATÍSTICAS ──
  /** Retorna estatísticas para o dashboard */
  getStats() {
    return {
      escolas: this.escolas$.value.filter((e) => e.status === "ATIVO").length,
      unidades: this.unidades$.value.filter((u) => u.status === "ATIVO").length,
      profissionais: this.profissionais$.value.filter(
        (p) => p.status === "ATIVO",
      ).length,
      pacientes: this.pacientes$.value.filter((p) => p.status === "ATIVO")
        .length,
      atendimentos: this.atendimentos$.value.length,
      medicacoesAtivas: this.medicacoes$.value.filter(
        (m) => m.status === "ATIVO",
      ).length,
      medicacoesEstoqueBaixo: this.medicacoes$.value.filter(
        (m) => m.status === "ATIVO" && m.estoque < 20,
      ).length,
      requisicoesPendentes: this.requisicoes$.value.length,
    };
  }

  loginMock(username: string, password: string): Observable<LoginResponse> {
    const usuario = USUARIOS_MOCK.find(
      (u) => u.username === username && u.password === password,
    );

    if (!usuario) {
      return throwError(() => new Error("Usuário ou senha inválidos."));
    }

    const token = this.createMockJwt(usuario);
    this.currentUser$.next(usuario);
    return of({ token, usuario }).pipe(delay(500));
  }

  private createMockJwt(usuario: Usuario): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const payload = btoa(
      JSON.stringify({
        sub: usuario.id.toString(),
        username: usuario.username,
        role: usuario.role,
        iat: now,
        exp: now + 3600, // 1 hora
      }),
    );
    return `${header}.${payload}.mock-signature`;
  }

  getCurrentUser(): Observable<Usuario | null> {
    return this.currentUser$.asObservable();
  }

  getProfissionalLogado(): ProfissionalSaude | undefined {
    const usuario = this.currentUser$.value;
    if (!usuario || usuario.role !== "PROFISSIONAL_SAUDE") return undefined;
    return this.profissionais$.value.find(
      (p) => p.username === usuario.username,
    );
  }

  logout(): void {
    this.currentUser$.next(null);
  }
}
