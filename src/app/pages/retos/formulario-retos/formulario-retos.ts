import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RetosAdmin } from '../retos-admin.service';
import { CasoPruebaAdmin, CATEGORIAS_RETO, RetoFormValue } from '../models/reto-admin.model';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-formulario-retos',
  standalone: true,
  imports: [FormsModule, RouterLink, MonacoEditorModule],
  templateUrl: './formulario-retos.html',
})
export class RetoForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private retosAdmin = inject(RetosAdmin);

  categorias = CATEGORIAS_RETO;
  lenguajesSoportados = [
    { id: 'javascript', nombre: 'JavaScript' },
    { id: 'typescript', nombre: 'TypeScript' },
    { id: 'python', nombre: 'Python' },
    { id: 'csharp', nombre: 'C#' },
    { id: 'java', nombre: 'Java' },
    { id: 'cpp', nombre: 'C++' },
    { id: 'sql', nombre: 'SQL' },
    { id: 'html', nombre: 'HTML' },
    { id: 'css', nombre: 'CSS' }
  ];

  actualizarLenguajeEditor(nuevoLenguaje: string) {
    this.editorOptions = { 
      ...this.editorOptions, 
      language: nuevoLenguaje 
    };
  }

  retoId: string | null = null;

  editorOptions = { 
    theme: 'vs',
    language: 'javascript', 
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    fontSize: 14
  };

  form: RetoFormValue = {
    titulo: '',
    descripcion: '',
    dificultad: 1,
    lenguajeRequerido: '',
    categoria: CATEGORIAS_RETO[0],
    codigoBase: '',
    solucionEsperada: '',
  };

  casosPrueba = signal<CasoPruebaAdmin[]>([]);
  nuevoCaso = { entrada: '', salidaEsperada: '', visible: true };

  cargando = signal(false);
  guardando = signal(false);
  errorGeneral = signal('');
  mensajeExito = signal('');

  ngOnInit(): void {
    this.retoId = this.route.snapshot.paramMap.get('id');
    if (!this.retoId) {
      return;
    }

    this.cargando.set(true);
    this.retosAdmin.obtenerCompleto(this.retoId).subscribe({
      next: (reto) => {
        this.form = {
          titulo: reto.titulo,
          descripcion: reto.descripcion,
          dificultad: reto.dificultad,
          lenguajeRequerido: reto.lenguajeRequerido,
          categoria: reto.categoria,
          codigoBase: reto.codigoBase,
          solucionEsperada: reto.solucionEsperada,
        };
        this.actualizarLenguajeEditor(reto.lenguajeRequerido);
        this.casosPrueba.set(reto.casosPrueba);
        this.cargando.set(false);
      },
      error: () => {
        this.errorGeneral.set('No se pudo cargar el reto.');
        this.cargando.set(false);
      },
    });
  }

  guardar(): void {
    this.errorGeneral.set('');
    this.guardando.set(true);

    const accion$ = this.retoId
      ? this.retosAdmin.actualizar(this.retoId, this.form)
      : this.retosAdmin.crear(this.form);

    accion$.subscribe({
      next: (reto) => {
        this.guardando.set(false);
        if (this.retoId) {
          this.mensajeExito.set('Cambios guardados.');
        } else {
          // Al crear, pasamos a editar ese mismo reto para poder agregarle casos de prueba
          this.router.navigate(['/maestro/retos', reto.retoId, 'editar']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorGeneral.set(this.mensajeDeError(error));
      },
    });
  }

  agregarCaso(): void {
    if (!this.retoId || !this.nuevoCaso.entrada || !this.nuevoCaso.salidaEsperada) {
      return;
    }

    this.retosAdmin.agregarCasoPrueba(this.retoId, { ...this.nuevoCaso }).subscribe({
      next: (caso) => {
        this.casosPrueba.update((lista) => [...lista, caso]);
        this.nuevoCaso = { entrada: '', salidaEsperada: '', visible: true };
      },
      error: () => {
        this.errorGeneral.set('No se pudo agregar el caso de prueba.');
      },
    });
  }

  private mensajeDeError(error: HttpErrorResponse): string {
    if (error.status === 403) {
      return 'No tienes permiso para hacer esto.';
    }
    if (error.status === 404) {
      return 'El reto ya no existe.';
    }
    return 'Ocurrió un error al guardar. Intenta de nuevo.';
  }
}
