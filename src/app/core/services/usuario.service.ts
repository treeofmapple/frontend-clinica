import { Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { UsuarioResponse } from "../models/usuario.models";

@Injectable({ providedIn: "root" })
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  eu(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`, {
      withCredentials: true,
    });
  }
}
