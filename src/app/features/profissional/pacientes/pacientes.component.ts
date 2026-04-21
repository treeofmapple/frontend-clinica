import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { ApiService } from "../../../core/services/api.service";
import {
  Escola,
  Unidade,
  Paciente,
  CategoriasPaciente,
  VinculoPaciente,
} from "../../../core/models/models";
import {
  PageHeaderComponent,
  BtnComponent,
  EmptyStateComponent,
} from "../../../shared/components/ui.components";
import { ModalComponent } from "../../../shared/components/modal.component";

@Component({
  selector: "app-pacientes",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PageHeaderComponent,
    BtnComponent,
    EmptyStateComponent,
    ModalComponent,
  ],
  templateUrl: "./pacientes.component.html",
  styleUrls: ["./pacientes.component.scss"],
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  escolas: Escola[] = [];
  unidades: Unidade[] = [];
  filtered: Paciente[] = [];
  searchTerm = "";
  filterStatus: "TODOS" | "ATIVO" | "INATIVO" = "TODOS";
  modalOpen = false;
  editItem: Paciente | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = "";
  successMsg = "";

  categorias: CategoriasPaciente[] = [
    "ALUNO",
    "COLABORADOR_UNIDADE",
    "COLABORADOR_ESCOLA",
    "EXTERNO",
  ];
  vinculos: VinculoPaciente[] = ["ESCOLA", "UNIDADE", "REITORIA"];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.api.getPacientes().subscribe((list) => {
      this.pacientes = list;
      this.applyFilter();
    });

    this.api.getEscolas().subscribe((list) => (this.escolas = list));

    this.api.getUnidades().subscribe({
      next: (list) => (this.unidades = list),
      error: () => (this.unidades = []),
    });

    this.buildForm();
  }

  buildForm(item?: Paciente) {
    const vinculoTipo =
      item?.vinculoTipo ||
      this.defaultVinculoByCategoria(item?.categoria || "ALUNO");
    this.form = this.fb.group({
      nome: [item?.nome || "", [Validators.required, Validators.minLength(3)]],
      categoria: [item?.categoria || "", Validators.required],
      vinculoTipo: [vinculoTipo, Validators.required],
      escolaId: [item?.escolaId ?? ""],
      unidadeId: [item?.unidadeId ?? ""],
      email: [item?.email || "", [Validators.required, Validators.email]],
      telefone: [item?.telefone || "", Validators.required],
    });
    this.applyVinculoRules();
    this.form.get("categoria")?.valueChanges.subscribe((categoria) => {
      const tipo = this.defaultVinculoByCategoria(categoria);
      this.form.patchValue({ vinculoTipo: tipo }, { emitEvent: false });
      this.applyVinculoRules();
    });
    this.form
      .get("vinculoTipo")
      ?.valueChanges.subscribe(() => this.applyVinculoRules());
  }

  applyFilter() {
    this.filtered = this.pacientes.filter((p) => {
      const ms =
        this.filterStatus === "TODOS" || p.status === this.filterStatus;
      const mq =
        !this.searchTerm ||
        p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return ms && mq;
    });
  }

  openModal(item?: Paciente) {
    this.editItem = item || null;
    this.buildForm(item);
    this.errorMsg = "";
    this.modalOpen = true;
  }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.editItem) {
      this.errorMsg =
        "Edição de paciente ainda não foi implementada no backend.";
      return;
    }

    this.saving = true;

    const raw = this.form.value;
    const payload = {
      nome: raw.nome,
      email: raw.email,
      telefone: raw.telefone,
      categoria: raw.categoria,
      vinculoTipo: raw.vinculoTipo,
      escolaId:
        raw.vinculoTipo === "ESCOLA" ? Number(raw.escolaId) || null : null,
      unidadeId:
        raw.vinculoTipo === "UNIDADE" ? Number(raw.unidadeId) || null : null,
    };

    this.api.criarPaciente(payload as any).subscribe({
      next: () => {
        this.api.getPacientes().subscribe((list) => {
          this.pacientes = list;
          this.applyFilter();
        });
        this.modalOpen = false;
        this.saving = false;
        this.showSuccess(
          "Paciente cadastrado! Prontuário criado automaticamente.",
        );
      },
      error: (e) => {
        this.errorMsg = e.error?.message ?? "Erro ao salvar paciente.";
        this.saving = false;
      },
    });
  }

  toggleStatus(item: Paciente) {
    this.api.inativarPaciente(item.id).subscribe({
      next: () => {
        this.api.getPacientes().subscribe((list) => {
          this.pacientes = list;
          this.applyFilter();
        });
        this.showSuccess(
          `Paciente ${item.status === "ATIVO" ? "inativado" : "ativado"}.`,
        );
      },
    });
  }

  labelCategoria(cat: string): string {
    const map: Record<string, string> = {
      ALUNO: "Aluno",
      COLABORADOR_UNIDADE: "Colab. Unidade",
      COLABORADOR_ESCOLA: "Colab. Escola",
      EXTERNO: "Externo",
    };
    return map[cat] || cat;
  }

  labelVinculo(tipo: VinculoPaciente): string {
    return { ESCOLA: "Escola", UNIDADE: "Unidade", REITORIA: "Reitoria" }[tipo];
  }

  private defaultVinculoByCategoria(
    categoria: CategoriasPaciente,
  ): VinculoPaciente {
    if (categoria === "COLABORADOR_UNIDADE") return "UNIDADE";
    if (categoria === "EXTERNO") return "REITORIA";
    return "ESCOLA";
  }

  private applyVinculoRules() {
    const tipo = this.form.get("vinculoTipo")?.value as VinculoPaciente;
    const escolaIdCtrl = this.form.get("escolaId");
    const unidadeIdCtrl = this.form.get("unidadeId");
    escolaIdCtrl?.clearValidators();
    unidadeIdCtrl?.clearValidators();
    if (tipo === "ESCOLA") {
      escolaIdCtrl?.setValidators([Validators.required]);
      unidadeIdCtrl?.setValue("");
    } else if (tipo === "UNIDADE") {
      unidadeIdCtrl?.setValidators([Validators.required]);
      escolaIdCtrl?.setValue("");
    } else {
      escolaIdCtrl?.setValue("");
      unidadeIdCtrl?.setValue("");
    }
    escolaIdCtrl?.updateValueAndValidity({ emitEvent: false });
    unidadeIdCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => (this.successMsg = ""), 4000);
  }
  f(field: string) {
    return this.form.get(field);
  }
}
