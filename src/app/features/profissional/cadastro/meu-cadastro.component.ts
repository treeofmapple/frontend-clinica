import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
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
  loading = false;
  saving = false;
  successMsg = '';
  errorMsg = '';
  editMode = false;

  conselhos = ['CRM', 'CRO', 'COREN', 'CREFITO', 'CRP', 'CFM', 'CRN'];

  constructor(
    private api: ApiService,
    private data: DataService,
    private auth: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.api.getMeuPerfil().subscribe({
      next: (p) => { this.profissional = p; this.buildForm(); this.loading = false; },
      error: () => this.loadFallbackProfile()
    });
  }

  buildForm() {
    this.form = this.fb.group({
      formacao:       [this.profissional?.formacao || '', Validators.required],
      especialidade:  [this.profissional?.especialidade || '', Validators.required],
      conselho:       [this.profissional?.conselho || '', Validators.required],
      numeroRegistro: [this.profissional?.numeroRegistro || '', Validators.required],
      diasAtendimento:[this.profissional?.diasAtendimento || '', Validators.required],
      turnosAtendimento:[this.profissional?.turnosAtendimento || '', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';

    const payload = this.form.value;

    if (this.profissional?.id && this.profissional.id > 0) {
      this.data.completarCadastro(this.profissional.id, payload).subscribe({
        next: (p) => {
          this.profissional = p;
          this.saving = false;
          this.editMode = false;
          this.successMsg = 'Cadastro complementado com sucesso!';
          setTimeout(() => this.successMsg = '', 3000);
        },
        error: (e) => {
          this.errorMsg = e.error?.message ?? 'Erro ao salvar.';
          this.saving = false;
        }
      });
      return;
    }

    this.data.saveProfissional({
      ...payload,
      cadastroCompleto: true,
      username: this.profissional?.username || this.auth.currentUser?.username || 'profissional',
      nome: this.profissional?.nome || this.auth.currentUser?.username || 'Profissional',
    }).subscribe({
      next: (p) => {
        this.profissional = p;
        this.saving = false;
        this.editMode = false;
        this.successMsg = 'Cadastro complementado com sucesso!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (e) => {
        this.errorMsg = e.error?.message ?? 'Erro ao salvar.';
        this.saving = false;
      }
    });
  }

  private loadFallbackProfile() {
    const username = this.auth.currentUser?.username;
    this.data.getProfissionais().subscribe({
      next: (list) => {
        const prof = list.find((p) => p.username === username);
        this.profissional = prof ?? null;
        if (!this.profissional && username) {
          this.profissional = {
            id: 0,
            nome: username,
            username,
            formacao: '',
            conselho: '',
            especialidade: '',
            numeroRegistro: '',
            diasAtendimento: '',
            turnosAtendimento: '',
            dataCadastro: new Date().toISOString().split('T')[0],
            status: 'ATIVO',
            cadastroCompleto: false,
          };
          this.editMode = true;
        }
        this.buildForm();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  f(field: string) { return this.form.get(field); }
}
