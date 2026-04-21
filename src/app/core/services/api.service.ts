import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  Escola,
  Unidade,
  ProfissionalSaude,
  Atendimento,
  Medicamento,
  Paciente,
  Prontuario,
  StatusDashboard,
  RequisicaoMedicacao,
} from "../models/models";
import {
  EscolaRequest,
  UnidadeRequest,
  ProfissionalCadastroRequest,
  ProfissionalComplementoRequest,
  AtendimentoRequest,
  MedicamentoRequest,
  PacienteRequest,
  MedicamentoUpdate,
  AtendimentoUpdate,
} from "../models/models.requests";

@Injectable({ providedIn: "root" })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── ESCOLAS ────────────────────────────────────────────────────────────────

  getEscolas(): Observable<Escola[]> {
    return this.http.get<Escola[]>(`${this.base}/escolas`);
  }

  getEscolaById(id: number): Observable<Escola> {
    return this.http.get<Escola>(`${this.base}/escolas/${id}`);
  }

  criarEscola(data: EscolaRequest): Observable<Escola> {
    return this.http.post<Escola>(`${this.base}/escolas`, data);
  }

  // ── UNIDADES ───────────────────────────────────────────────────────────────

  getUnidades(): Observable<Unidade[]> {
    return this.http.get<Unidade[]>(`${this.base}/unidades`);
  }

  getUnidadeById(id: number): Observable<Unidade> {
    return this.http.get<Unidade>(`${this.base}/unidades/${id}`);
  }

  criarUnidade(data: UnidadeRequest): Observable<Unidade> {
    return this.http.post<Unidade>(`${this.base}/unidades`, data);
  }

  atualizarUnidade(id: number, data: UnidadeRequest): Observable<Unidade> {
    return this.http.put<Unidade>(`${this.base}/unidades/${id}`, data);
  }

  // toggle
  inativarUnidade(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/unidades/inativar/${id}`, {});
  }

  // ── PROFISSIONAIS (admin) ──────────────────────────────────────────────────

  getProfissionais(): Observable<ProfissionalSaude[]> {
    return this.http.get<ProfissionalSaude[]>(`${this.base}/profissionais`);
  }

  getProfissionalById(id: number): Observable<ProfissionalSaude> {
    return this.http.get<ProfissionalSaude>(`${this.base}/profissionais/${id}`);
  }

  criarProfissional(
    data: ProfissionalCadastroRequest,
  ): Observable<ProfissionalSaude> {
    return this.http.post<ProfissionalSaude>(
      `${this.base}/profissionais`,
      data,
    );
  }

  inativarProfissional(id: number): Observable<void> {
   return this.http.post<void>(`${this.base}/profissionais/inativar/${id}`, {});
  }

  // ── PROFISSIONAIS (self — perfil próprio) ──────────────────────────────────

  getMeuPerfil(): Observable<ProfissionalSaude> {
    return this.http.get<ProfissionalSaude>(
      `${this.base}/profissionais/meu-perfil`,
    );
  }

  // POST
  completarCadastro(
    data: ProfissionalComplementoRequest,
  ): Observable<ProfissionalSaude> {
    return this.http.post<ProfissionalSaude>(
      `${this.base}/profissionais/complemento`,
      data,
    );
  }

  // ── MEDICAMENTOS ───────────────────────────────────────────────────────────

  getMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${this.base}/medicamento`);
  }

  criarMedicamento(data: MedicamentoRequest): Observable<Medicamento> {
    return this.http.post<Medicamento>(`${this.base}/medicamento`, data);
  }

  atualizarMedicamento(data: MedicamentoUpdate): Observable<Medicamento> {
    return this.http.put<Medicamento>(`${this.base}/medicamento`, data);
  }

  toggleMedicamento(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/medicamento/inativar/${id}`, {});
  }

  // Feito

  // ── ATENDIMENTOS ───────────────────────────────────────────────────────────

  getAtendimentos(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.base}/atendimento`);
  }

  criarAtendimento(data: AtendimentoRequest): Observable<Atendimento> {
    return this.http.post<Atendimento>(`${this.base}/atendimento`, data);
  }

  atualizarAtendimento(data: AtendimentoUpdate): Observable<Atendimento> {
    return this.http.put<Atendimento>(`${this.base}/atendimento`, data);
  }

  // Feito

  // ── PRONTUÁRIOS ────────────────────────────────────────────────────────────

  getProntuarios(): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(`${this.base}/prontuario`);
  }

  getProntuarioById(id: number): Observable<Prontuario> {
    return this.http.get<Prontuario>(`${this.base}/prontuario/${id}`);
  }

  getProntuarioByPacienteId(id: number): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(
      `${this.base}/prontuario/paciente/${id}`,
    );
  }

  // Feito

  // ── REQUISIÇÕES ────────────────────────────────────────────────────────────

  getRequisicoes(): Observable<RequisicaoMedicacao[]> {
    return this.http.get<RequisicaoMedicacao[]>(`${this.base}/requisicoes`);
  }

  // ── DASHBOARD / STATUS ─────────────────────────────────────────────────────

  getStatus(): Observable<StatusDashboard> {
    return this.http.get<StatusDashboard>(`${this.base}/status`);
  }

  // Feito

  // ── PACIENTES ──────────────────────────────────────────────────────────────

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.base}/paciente`);
  }

  criarPaciente(data: PacienteRequest): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.base}/paciente`, data);
  }

  // toggle
  inativarPaciente(id: number): Observable<void> {
    return this.http.put<void>(`${this.base}/paciente/inativar/${id}`, {});
  }

  // Feito
}
