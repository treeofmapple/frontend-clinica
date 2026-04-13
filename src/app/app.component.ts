import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";

/**
 * Componente raiz da aplicação
 * Responsável por renderizar o router outlet e restaurar sessão do usuário
 */
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
