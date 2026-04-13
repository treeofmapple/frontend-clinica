export interface EscolaRequest {
  nome: string;
  ies: string;
  coordenador: string;
}

export interface EscolaResponse {
  id: string;
  nome: string;
  ies: string;
  coordenador: string;
  status: string;
}
