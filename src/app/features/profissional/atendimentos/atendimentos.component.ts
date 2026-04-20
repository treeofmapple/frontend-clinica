import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { Atendimento, Paciente, Medicamento, TipoAtendimento } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './atendimentos.component.html',
  styleUrls: ['./atendimentos.component.scss']
})
export class AtendimentosComponent implements OnInit {
  atendimentos: Atendimento[] = [];
  pacientes: Paciente[] = [];
  medicacoes: Medicamento[] = [];
  searchTerm = '';
  modalOpen = false;
  detalheOpen = false;
  selectedAtendimento: Atendimento | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';
  cadastroCompleto = true;

  tipos: TipoAtendimento[] = ['URGENCIA', 'EMERGENCIA', 'CONSULTA', 'REVISAO'];
  today = new Date().toISOString().split('T')[0];

  get filtered() {
    if (!this.searchTerm) return this.atendimentos;
    const t = this.searchTerm.toLowerCase();
    return this.atendimentos.filter(a =>
      (a.pacienteNome || '').toLowerCase().includes(t) ||
      (a.profissionalNome || '').toLowerCase().includes(t) ||
      a.tipo.toLowerCase().includes(t)
    );
  }

  get medicacoesArray(): FormArray { return this.form.get('medicacoesUsadas') as FormArray; }
  get medicacoesAtivas(): Medicamento[] { return this.medicacoes.filter(m => m.status === 'ATIVO'); }

  constructor(private api: ApiService, private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.api.getAtendimentos().subscribe(list => this.atendimentos = list);
    this.api.getPacientes().subscribe(list => this.pacientes = list.filter(p => p.status === 'ATIVO'));
    this.api.getMedicamentos().subscribe(list => this.medicacoes = list);
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      pacienteId:       ['', Validators.required],
      dataInicio:       ['', Validators.required],
      dataFim:          [''],
      sintomas:         ['', Validators.required],
      diagnostico:      ['', Validators.required],
      tratamento:       ['', Validators.required],
      tipo:             ['CONSULTA', Validators.required],
      medicacoesUsadas: this.fb.array([]),
    });
  }

  addMedicacao() {
    this.medicacoesArray.push(this.fb.group({
      medicacaoId: ['', Validators.required],
      quantidade:  [1, [Validators.required, Validators.min(1)]],
      dosagem:     ['', Validators.required],
    }));
  }

  removeMedicacao(i: number) { this.medicacoesArray.removeAt(i); }

  getMedNome(id: string): string {
    const m = this.medicacoes.find(m => m.id === Number(id));
    return m ? `${m.nome} (estoque: ${m.estoque})` : '';
  }

  openModal() {
    if (!this.cadastroCompleto) { this.errorMsg = 'Complete seu cadastro antes de registrar atendimentos (RN013).'; return; }
    this.buildForm(); this.errorMsg = ''; this.modalOpen = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.errorMsg = '';
    const raw = this.form.value;
    const payload = {
      ...raw,
      pacienteId: Number(raw.pacienteId),
      pacienteNome: this.pacientes.find(p => p.id === Number(raw.pacienteId))?.nome,
      profissionalId: this.auth.currentUser?.id ?? 0,
      profissionalNome: this.auth.currentUser?.username ?? '',
      medicacoesUsadas: raw.medicacoesUsadas.map((m: any) => ({
        medicacaoId: Number(m.medicacaoId),
        medicacaoNome: this.medicacoes.find(med => med.id === Number(m.medicacaoId))?.nome,
        quantidade: Number(m.quantidade),
        dosagem: m.dosagem,
      })),
    };
    this.api.criarAtendimento(payload).subscribe({
      next: (novo) => { this.atendimentos = [...this.atendimentos, novo]; this.modalOpen = false; this.saving = false; this.showSuccess('Atendimento registrado com sucesso!'); },
      error: (e) => { this.errorMsg = e.error?.message ?? 'Erro ao salvar.'; this.saving = false; }
    });
  }

  verDetalhes(a: Atendimento) { this.selectedAtendimento = a; this.detalheOpen = true; }
  tipoColor(tipo: string): string {
    const map: Record<string, string> = { URGENCIA: 'danger', EMERGENCIA: 'warning', CONSULTA: 'primary', REVISAO: 'info' };
    return map[tipo] || 'primary';
  }
  showSuccess(msg: string) { this.successMsg = msg; setTimeout(() => this.successMsg = '', 4000); }
  f(field: string) { return this.form.get(field); }
  fm(i: number, field: string) { return this.medicacoesArray.at(i).get(field); }
}
