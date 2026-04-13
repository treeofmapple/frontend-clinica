import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { LoginRequest } from "../../core/models/auth.models";

/**
 * Componente de Login (RF007: Autenticar profissional)
 *
 * Características:
 * - Validação de formulário reativa
 * - Hints de credenciais para teste (facilita demonstração)
 * - Toggle de visibilidade de senha
 * - Feedback visual de carregamento e erro
 * - Redirecionamento automático por role (Admin vs Profissional)
 */
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = "";
  showPassword = false;

  hints = [
    { role: "Administrador", user: "admin", pass: "admin123" },
    { role: "Profissional", user: "profissional", pass: "prof123" },
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Criar formulário com validações
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    if (this.auth.isAuthenticated()) this.redirect();
  }

  /** Preenche o formulário com credenciais de teste */
  fillHint(user: string, pass: string) {
    this.form.patchValue({ username: user, password: pass });
  }

  /** Submete o formulário para autenticação */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = "";
    const { username, password } = this.form.value;

    const request: LoginRequest = {
      username: username!,
      password: password!,
    }

    this.auth.login(request).subscribe({
      next: () => this.redirect(),
      error: (e) => {
        this.error = e.message;
        this.loading = false;
      },
    });
  }

  /** Redireciona conforme o role do usuário */
  private redirect() {
    this.router.navigate(
      this.auth.isAdmin ? ["/admin/dashboard"] : ["/profissional/pacientes"],
    );
  }
}
