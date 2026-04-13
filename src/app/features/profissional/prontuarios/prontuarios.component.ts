import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Prontuario, Paciente } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-prontuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './prontuarios.component.html',
  styleUrls: ['./prontuarios.component.scss']
})
export class ProntuariosComponent implements OnInit {
  prontuarios: Prontuario[] = [];
  pacientes: Paciente[] = [];
  searchTerm = '';
  detalheOpen = false;
  selectedProntuario: Prontuario | null = null;

  get filtered() {
    if (!this.searchTerm) return this.prontuarios;
    const t = this.searchTerm.toLowerCase();
    return this.prontuarios.filter(p =>
      (p.pacienteNome || '').toLowerCase().includes(t)
    );
  }

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getProntuarios().subscribe(list => this.prontuarios = list);
    this.data.getPacientes().subscribe(list => this.pacientes = list);
  }

  getPacienteCategoria(pacienteId: number): string {
    const p = this.pacientes.find(p => p.id === pacienteId);
    return p?.categoria || '';
  }

  getPacienteStatus(pacienteId: number): string {
    const p = this.pacientes.find(p => p.id === pacienteId);
    return p?.status || '';
  }

  verProntuario(p: Prontuario) {
    this.selectedProntuario = p;
    this.detalheOpen = true;
  }

  tipoColor(tipo: string): string {
    const map: Record<string, string> = {
      URGENCIA: 'danger', EMERGENCIA: 'warning', CONSULTA: 'primary', REVISAO: 'info'
    };
    return map[tipo] || 'primary';
  }
}
