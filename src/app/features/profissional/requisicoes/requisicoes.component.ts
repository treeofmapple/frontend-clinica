import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { RequisicaoMedicacao, Medicamento, TipoRequisicao } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-requisicoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './requisicoes.component.html',
  styleUrls: ['./requisicoes.component.scss']
})
export class RequisicoesComponent implements OnInit {
  requisicoes: RequisicaoMedicacao[] = [];
  medicacoes: Medicamento[] = [];
  searchTerm = '';
  filterTipo: string = 'TODOS';
  modalOpen = false;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  tipos: TipoRequisicao[] = ['URGENTE', 'CRITICO', 'PREVENTIVO'];

  get filtered() {
    return this.requisicoes.filter(r => {
      const mt = this.filterTipo === 'TODOS' || r.tipo === this.filterTipo;
      const mq = !this.searchTerm || (r.medicacaoNome || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      return mt && mq;
    });
  }

  get medicacoesAtivas() { return this.medicacoes.filter(m => m.status === 'ATIVO'); }

  constructor(private api: ApiService, private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.api.getRequisicoes().subscribe(list => this.requisicoes = list);
    this.api.getMedicamentos().subscribe(list => this.medicacoes = list);
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      medicacaoId: ['', Validators.required],
      quantidade:  [1, [Validators.required, Validators.min(1)]],
      tipo:        ['PREVENTIVO', Validators.required],
      observacao:  [''],
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const raw = this.form.value;
    const med = this.medicacoes.find(m => m.id === Number(raw.medicacaoId));
    const payload = {
      ...raw,
      medicacaoId: Number(raw.medicacaoId),
      medicacaoNome: med?.nome || '',
      profissionalId: this.auth.currentUser?.id ?? 0,
      quantidade: Number(raw.quantidade),
    };
    // Nota: backend só tem GET /requisicoes, sem POST ainda
    // Quando o endpoint POST for implementado, trocar pela chamada abaixo:
    // this.api.criarRequisicao(payload).subscribe(...)
    console.warn('POST /requisicoes ainda não implementado no backend', payload);
    this.modalOpen = false; this.saving = false; this.buildForm();
    this.showSuccess('Requisição enviada ao administrador!');
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = { URGENTE: '🔴 Urgente', CRITICO: '🟡 Crítico', PREVENTIVO: '🟢 Preventivo' };
    return map[tipo] || tipo;
  }

  showSuccess(msg: string) { this.successMsg = msg; setTimeout(() => this.successMsg = '', 4000); }
  f(field: string) { return this.form.get(field); }
}
