import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { ProfissionalSaude } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-profissionais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './profissionais.component.html',
  styleUrls: ['./profissionais.component.scss']
})
export class ProfissionaisComponent implements OnInit {
  profissionais: ProfissionalSaude[] = [];
  filtered: ProfissionalSaude[] = [];
  searchTerm = '';
  filterStatus: 'TODOS'|'ATIVO'|'INATIVO' = 'TODOS';
  modalOpen = false;
  editItem: ProfissionalSaude | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  conselhos = ['CRM','CRO','COREN','CREFITO','CRP','CFM','CRN'];

  constructor(private data: DataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.data.getProfissionais().subscribe(list => { this.profissionais = list; this.applyFilter(); });
    this.buildForm();
  }

  buildForm(item?: ProfissionalSaude) {
    this.form = this.fb.group({
      nome:           [item?.nome || '', [Validators.required, Validators.minLength(3)]],
      conselho:       [item?.conselho || '', Validators.required],
      especialidade:  [item?.especialidade || '', Validators.required],
      numeroRegistro: [item?.numeroRegistro || '', Validators.required],
    });
  }

  applyFilter() {
    this.filtered = this.profissionais.filter(p => {
      const ms = this.filterStatus === 'TODOS' || p.status === this.filterStatus;
      const mq = !this.searchTerm || p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || p.especialidade.toLowerCase().includes(this.searchTerm.toLowerCase());
      return ms && mq;
    });
  }

  openModal(item?: ProfissionalSaude) { this.editItem=item||null; this.buildForm(item); this.errorMsg=''; this.modalOpen=true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = { ...this.form.value, id: this.editItem?.id };
    this.data.saveProfissional(payload).subscribe({
      next: () => { this.modalOpen=false; this.saving=false; this.showSuccess('Profissional salvo com sucesso!'); },
      error: (e) => { this.errorMsg=e.message; this.saving=false; }
    });
  }

  toggleStatus(item: ProfissionalSaude) {
    const obs = item.status==='ATIVO' ? this.data.inativarProfissional(item.id) : this.data.ativarProfissional(item.id);
    obs.subscribe(() => this.showSuccess(`Profissional ${item.status==='ATIVO'?'inativado':'ativado'}.`));
  }

  showSuccess(msg: string) { this.successMsg=msg; setTimeout(()=>this.successMsg='',3000); }
  f(field: string) { return this.form.get(field); }
}
