import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  pacientes: any[] = [];
  atendimentos: any[] = [];
  profissionais: any[] = [];
  medicacoes: any[] = [];
  requisicoes: any[] = [];
  today = new Date().toISOString().split('T')[0];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.stats = this.data.getStats();
    this.data.getPacientes().subscribe(list => this.pacientes = list);
    this.data.getAtendimentos().subscribe(list => this.atendimentos = list);
    this.data.getProfissionais().subscribe(list => this.profissionais = list);
    this.data.getMedicacoes().subscribe(list => this.medicacoes = list);
    this.data.getRequisicoes().subscribe(list => this.requisicoes = list);
  }

  get ativosCount() { return this.pacientes.filter(p => p.status==='ATIVO').length; }
  get medicacoesVencidas() { return this.medicacoes.filter(m => m.validade < this.today && m.status==='ATIVO').length; }
  get profCompletos() { return this.profissionais.filter(p => p.cadastroCompleto && p.status==='ATIVO').length; }
  get tipoAtendimentos() {
    const tipos: Record<string,number> = {};
    this.atendimentos.forEach(a => { tipos[a.tipo] = (tipos[a.tipo]||0)+1; });
    return Object.entries(tipos).map(([tipo,count]) => ({ tipo, count }));
  }
  get categoriaPacientes() {
    const cats: Record<string,number> = {};
    this.pacientes.forEach(p => { cats[p.categoria] = (cats[p.categoria]||0)+1; });
    return Object.entries(cats).map(([cat,count]) => ({ cat, count }));
  }
}
