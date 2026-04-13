import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Unidade } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.scss']
})
export class UnidadesComponent implements OnInit {
  unidades: Unidade[] = [];
  filtered: Unidade[] = [];
  searchTerm = '';
  filterStatus: 'TODOS'|'ATIVO'|'INATIVO' = 'TODOS';
  modalOpen = false;
  editItem: Unidade | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  constructor(private data: DataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.data.getUnidades().subscribe(list => { this.unidades = list; this.applyFilter(); });
    this.buildForm();
  }

  buildForm(item?: Unidade) {
    this.form = this.fb.group({
      nome:        [item?.nome || '', [Validators.required, Validators.minLength(3)]],
      responsavel: [item?.responsavel || '', Validators.required],
      ies:         [item?.ies || '', Validators.required],
    });
  }

  applyFilter() {
    this.filtered = this.unidades.filter(u => {
      const ms = this.filterStatus === 'TODOS' || u.status === this.filterStatus;
      const mq = !this.searchTerm || u.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || u.responsavel.toLowerCase().includes(this.searchTerm.toLowerCase());
      return ms && mq;
    });
  }

  openModal(item?: Unidade) { this.editItem = item||null; this.buildForm(item); this.errorMsg=''; this.modalOpen=true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.errorMsg = '';
    const payload = { ...this.form.value, id: this.editItem?.id, status: this.editItem?.status || 'ATIVO' };
    this.data.saveUnidade(payload).subscribe({
      next: () => { this.modalOpen=false; this.saving=false; this.showSuccess('Unidade salva com sucesso!'); },
      error: (e) => { this.errorMsg=e.message; this.saving=false; }
    });
  }

  toggleStatus(item: Unidade) {
    const obs = item.status==='ATIVO' ? this.data.inativarUnidade(item.id) : this.data.ativarUnidade(item.id);
    obs.subscribe(() => this.showSuccess(`Unidade ${item.status==='ATIVO'?'inativada':'ativada'} com sucesso.`));
  }

  showSuccess(msg: string) { this.successMsg=msg; setTimeout(()=>this.successMsg='',3000); }
  f(field: string) { return this.form.get(field); }
}
