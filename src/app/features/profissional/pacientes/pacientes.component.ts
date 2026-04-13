import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Paciente, CategoriasPaciente } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  filtered: Paciente[] = [];
  searchTerm = '';
  filterStatus: 'TODOS' | 'ATIVO' | 'INATIVO' = 'TODOS';
  modalOpen = false;
  editItem: Paciente | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  categorias: CategoriasPaciente[] = ['ALUNO', 'COLABORADOR_UNIDADE', 'COLABORADOR_ESCOLA', 'EXTERNO'];

  constructor(private data: DataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.data.getPacientes().subscribe(list => {
      this.pacientes = list;
      this.applyFilter();
    });
    this.buildForm();
  }

  buildForm(item?: Paciente) {
    this.form = this.fb.group({
      nome:      [item?.nome || '', [Validators.required, Validators.minLength(3)]],
      categoria: [item?.categoria || '', Validators.required],
      email:     [item?.email || '', [Validators.required, Validators.email]],
      telefone:  [item?.telefone || '', Validators.required],
    });
  }

  applyFilter() {
    this.filtered = this.pacientes.filter(p => {
      const ms = this.filterStatus === 'TODOS' || p.status === this.filterStatus;
      const mq = !this.searchTerm ||
        p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return ms && mq;
    });
  }

  openModal(item?: Paciente) {
    this.editItem = item || null;
    this.buildForm(item);
    this.errorMsg = '';
    this.modalOpen = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = { ...this.form.value, id: this.editItem?.id };
    this.data.savePaciente(payload).subscribe({
      next: () => {
        this.modalOpen = false;
        this.saving = false;
        this.showSuccess(this.editItem ? 'Paciente atualizado!' : 'Paciente cadastrado! Prontuário criado automaticamente.');
      },
      error: (e) => { this.errorMsg = e.message; this.saving = false; }
    });
  }

  toggleStatus(item: Paciente) {
    const obs = item.status === 'ATIVO'
      ? this.data.inativarPaciente(item.id)
      : this.data.ativarPaciente(item.id);
    obs.subscribe(() => this.showSuccess(`Paciente ${item.status === 'ATIVO' ? 'inativado' : 'ativado'}.`));
  }

  labelCategoria(cat: string): string {
    const map: Record<string, string> = {
      ALUNO: 'Aluno',
      COLABORADOR_UNIDADE: 'Colab. Unidade',
      COLABORADOR_ESCOLA: 'Colab. Escola',
      EXTERNO: 'Externo',
    };
    return map[cat] || cat;
  }

  showSuccess(msg: string) { this.successMsg = msg; setTimeout(() => this.successMsg = '', 4000); }
  f(field: string) { return this.form.get(field); }
}
