import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient } from "@angular/common/http";
import {
  ProfissionalSaudeComplementoRequest,
  ProfissionalSaudeRequest,
  ProfissionalSaudeResponse,
} from "../models/profissional.models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfissionalService {
  private readonly apiUrl = `${environment.apiUrl}/profissionais`;

  constructor(private http: HttpClient) {}

  cadastrarProfissional(
    request: ProfissionalSaudeRequest,
  ): Observable<ProfissionalSaudeResponse> {
    return this.http.post<ProfissionalSaudeResponse>(
      `${this.apiUrl}`,
      request,
      {
        withCredentials: true,
      },
    );
  }

  completarCadastroProfissional(
    request: ProfissionalSaudeComplementoRequest,
  ): Observable<ProfissionalSaudeResponse> {
    return this.http.post<ProfissionalSaudeResponse>(
      `${this.apiUrl}`,
      request,
      {
        withCredentials: true,
      },
    );
  }

  consultarPerfilProfissional(): Observable<ProfissionalSaudeResponse> {
    return this.http.get<ProfissionalSaudeResponse>(`${this.apiUrl}`, {
      withCredentials: true,
    });
  }

  listarTodosOsProfissionais(): Observable<ProfissionalSaudeResponse[]> {
    return this.http.get<ProfissionalSaudeResponse[]>(`${this.apiUrl}`, {
      withCredentials: true,
    });
  }

  buscarProfissionalPorId(id: string): Observable<ProfissionalSaudeResponse> {
    return this.http.get<ProfissionalSaudeResponse>(`${this.apiUrl}`, {
      withCredentials: true,
    });
  }

  inativarUnidade(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/inativar/${id}`, {
      withCredentials: true,
    });
  }
}
