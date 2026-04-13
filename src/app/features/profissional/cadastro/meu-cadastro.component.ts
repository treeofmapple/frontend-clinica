import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfissionalSaude } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent } from '../../../shared/components/ui.components';

@Component({
  selector: 'app-meu-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, BtnComponent],
  templateUrl: './meu-cadastro.component.html',
  styleUrls: ['./meu-cadastro.component.scss']
})
export class MeuCadastroComponent implements OnInit {
  profissional: ProfissionalSaude | null = null;
  form!: FormGroup;
  saving = false;
  successMsg = '';
  errorMsg = '';
  editMode = false;

  constructor(
    private data: DataService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Simula carregar o profissional logado (id=2 para o usuário 'profissional')
    this.data.getProfissionais().subscribe(list => {
      this.profissional = list.find(p => p.id === 2) || null;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.fb.group({
      formacao:        [this.profissional?.formacao || '', Validators.required],
      especialidade:   [this.profissional?.especialidade || '', Validators.required],
      disponibilidade: [this.profissional?.disponibilidade || '', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.data.completarCadastro(this.profissional!.id, this.form.value).subscribe({
      next: (p) => {
        this.profissional = p;
        this.saving = false;
        this.editMode = false;
        this.successMsg = 'Cadastro complementado com sucesso!';
        setTimeout(() => this.successMsg = '', 3000);
      }
    });
  }

  f(field: string) { return this.form.get(field); }
}
