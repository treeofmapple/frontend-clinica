import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DataService } from '../../../core/services/data.service';
import { PageHeaderComponent } from '../../../shared/components/ui.components';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent implements OnInit {
  stats: any = {};
  pacientes: any[]      = [];
  atendimentos: any[]   = [];
  profissionais: any[]  = [];
  medicacoes: any[]     = [];
  requisicoes: any[]    = [];
  escolas: any[]        = [];
  unidades: any[]       = [];
  today = new Date().toISOString().split('T')[0];
  loading = true;

  constructor(private api: ApiService, private data: DataService) {}

  ngOnInit() {
    // Dados com API real
    forkJoin({
      profissionais: this.api.getProfissionais(),
      escolas:       this.api.getEscolas(),
      unidades:      this.api.getUnidades(),
    }).subscribe({
      next: (res) => {
        this.profissionais = res.profissionais;
        this.escolas       = res.escolas;
        this.unidades      = res.unidades;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // Dados ainda via mock (sem API no back)
    this.data.getPacientes().subscribe(list => this.pacientes = list);
    this.data.getAtendimentos().subscribe(list => this.atendimentos = list);
    this.data.getMedicacoes().subscribe(list => this.medicacoes = list);
    this.data.getRequisicoes().subscribe(list => this.requisicoes = list);
    this.stats = this.data.getStats();
  }

  get ativosCount()        { return this.pacientes.filter(p => p.status === 'ATIVO').length; }
  get medicacoesVencidas() { return this.medicacoes.filter(m => m.validade < this.today && m.status === 'ATIVO').length; }
  get profCompletos()      { return this.profissionais.filter(p => p.cadastroCompleto && p.status === 'ATIVO').length; }

  get tipoAtendimentos() {
    const tipos: Record<string, number> = {};
    this.atendimentos.forEach(a => { tipos[a.tipo] = (tipos[a.tipo] || 0) + 1; });
    return Object.entries(tipos).map(([tipo, count]) => ({ tipo, count }));
  }
  get categoriaPacientes() {
    const cats: Record<string, number> = {};
    this.pacientes.forEach(p => { cats[p.categoria] = (cats[p.categoria] || 0) + 1; });
    return Object.entries(cats).map(([cat, count]) => ({ cat, count }));
  }
}
