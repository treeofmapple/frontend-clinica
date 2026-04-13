import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient } from "@angular/common/http";
import { UnidadeRequest, UnidadeResponse } from "../models/unidade.models";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UnidadeService {
  private readonly apiUrl = `${environment.apiUrl}/unidades`;

  constructor(private http: HttpClient) {}

  cadastrarUnidade(request: UnidadeRequest): Observable<UnidadeResponse> {
    return this.http.post<UnidadeResponse>(`${this.apiUrl}`, request, {
      withCredentials: true,
    });
  }

  buscarUnidadePorId(id: string): Observable<UnidadeResponse> {
    return this.http.get<UnidadeResponse>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  buscarTodasAsUnidades(): Observable<UnidadeResponse[]> {
    return this.http.get<UnidadeResponse[]>(`${this.apiUrl}`, {
      withCredentials: true,
    });
  }

  atualizarUnidade(request: UnidadeRequest): Observable<UnidadeResponse> {
    return this.http.put<UnidadeResponse>(`${this.apiUrl}`, request, {
      withCredentials: true,
    });
  }

  inativarUnidade(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/inativar/${id}`, {
      withCredentials: true,
    });
  }
}
