import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Medicamento } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-medicacoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './medicacoes.component.html',
  styleUrls: ['./medicacoes.component.scss']
})
export class MedicacoesComponent implements OnInit {
  medicacoes: Medicamento[] = [];
  filtered: Medicamento[] = [];
  searchTerm = '';
  filterStatus: 'TODOS'|'ATIVO'|'INATIVO' = 'TODOS';
  modalOpen = false;
  editItem: Medicamento | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';
  today = new Date().toISOString().split('T')[0];

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.api.getMedicamentos().subscribe(list => { this.medicacoes = list; this.applyFilter(); });
    this.buildForm();
  }

  buildForm(item?: Medicamento) {
    this.form = this.fb.group({
      nome:          [item?.nome || '', Validators.required],
      descricao:     [item?.descricao || '', Validators.required],
      fornecedor:    [item?.fornecedor || '', Validators.required],
      armazenamento: [item?.armazenamento || 'TEMPERATURA_AMBIENTE', Validators.required],
      estoque:       [item?.estoque ?? 0, [Validators.required, Validators.min(0)]],
      dataAquisicao: [item?.dataAquisicao || '', Validators.required],
      validade:      [item?.validade || '', Validators.required],
    });
  }

  applyFilter() {
    this.filtered = this.medicacoes.filter(m => {
      const ms = this.filterStatus === 'TODOS' || m.status === this.filterStatus;
      const mq = !this.searchTerm || m.nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      return ms && mq;
    });
  }

  openModal(item?: Medicamento) { this.editItem = item || null; this.buildForm(item); this.errorMsg = ''; this.modalOpen = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = { ...this.form.value, id: this.editItem?.id, estoque: Number(this.form.value.estoque) };
    const obs = this.editItem
      ? this.api.atualizarMedicamento(payload)
      : this.api.criarMedicamento(payload);
    obs.subscribe({
      next: () => {
        this.api.getMedicamentos().subscribe(list => { this.medicacoes = list; this.applyFilter(); });
        this.modalOpen = false; this.saving = false;
        this.showSuccess('Medicação salva com sucesso!');
      },
      error: (e) => { this.errorMsg = e.error?.message ?? 'Erro ao salvar.'; this.saving = false; }
    });
  }

  toggleStatus(item: Medicamento) {
    this.api.toggleMedicamento(item.id).subscribe({
      next: () => {
        this.api.getMedicamentos().subscribe(list => { this.medicacoes = list; this.applyFilter(); });
        this.showSuccess(`Medicação ${item.status === 'ATIVO' ? 'inativada' : 'ativada'}.`);
      }
    });
  }

  isVencida(validade: string): boolean { return validade < this.today; }
  isEstoqueBaixo(estoque: number): boolean { return estoque < 20 && estoque > 0; }
  isEstoqueZero(estoque: number): boolean { return estoque === 0; }
  showSuccess(msg: string) { this.successMsg = msg; setTimeout(() => this.successMsg = '', 3000); }
  f(field: string) { return this.form.get(field); }
}
