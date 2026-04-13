import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { Observable } from "rxjs";
import { EscolaRequest, EscolaResponse } from "../models/escola.models";

@Injectable({ providedIn: "root" })
export class EscolaService {
  private readonly apiUrl = `${environment.apiUrl}/escolas`;

  constructor(private http: HttpClient) {}

  cadastrarEscola(request: EscolaRequest): Observable<EscolaResponse> {
    return this.http.post<EscolaResponse>(`${this.apiUrl}`, request, {
      withCredentials: true,
    });
  }

  buscarEscolaPorId(id: string): Observable<EscolaResponse> {
    return this.http.get<EscolaResponse>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  buscarTodasEscola(): Observable<EscolaResponse[]> {
    return this.http.get<EscolaResponse[]>(`${this.apiUrl}`, {
      withCredentials: true,
    });
  }
}
