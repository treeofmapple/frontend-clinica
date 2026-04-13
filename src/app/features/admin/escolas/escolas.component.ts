import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Escola } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';
import { EscolaService } from '../../../core/services/escola.service';
import { EscolaResponse } from '../../../core/models/escola.models';

@Component({
  selector: 'app-escolas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './escolas.component.html',
  styleUrls: ['./escolas.component.scss']
})
export class EscolasComponent implements OnInit {
  escolas: EscolaResponse[] = [];
  filtered: EscolaResponse[] = [];
  searchTerm = '';
  filterStatus: 'TODOS'|'ATIVO'|'INATIVO' = 'TODOS';

  modalOpen = false;
  editItem: EscolaResponse | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  constructor(private escolaService: EscolaService, private fb: FormBuilder) {}

  ngOnInit() {
    this.escolaService.buscarTodasEscola().subscribe(list => {
      this.escolas = list;
      this.applyFilter();
    });
    this.buildForm();
  }

  buildForm(item?: Escola) {
    this.form = this.fb.group({
      nome:        [item?.nome || '', [Validators.required, Validators.minLength(3)]],
      coordenador: [item?.coordenador || '', Validators.required],
      ies:         [item?.ies || '', Validators.required],
    });
  }

  applyFilter() {
    this.filtered = this.escolas.filter(e => {
      const matchStatus = this.filterStatus === 'TODOS' || e.status === this.filterStatus;
      const matchSearch = !this.searchTerm || e.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || e.coordenador.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  openModal(item?: EscolaResponse) {
    this.editItem = item || null;
    this.buildForm(item);
    this.errorMsg = '';
    this.modalOpen = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.errorMsg = '';
    const payload = { ...this.form.value, id: this.editItem?.id, status: this.editItem?.status || 'ATIVO' };
    this.escolaService.saveEscola(payload).subscribe({
      next: () => { this.modalOpen = false; this.saving = false; this.showSuccess('Escola salva com sucesso!'); },
      error: (e) => { this.errorMsg = e.message; this.saving = false; }
    });
  }

  toggleStatus(item: Escola) {
    const obs = item.status === 'ATIVO' ? this.escolaService.inativarEscola(item.id) : this.data.ativarEscola(item.id);
    obs.subscribe(() => this.showSuccess(`Escola ${item.status === 'ATIVO' ? 'inativada' : 'ativada'} com sucesso.`));
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = '', 3000);
  }

  getFormField(field: string) { return this.form.get(field); }
}
