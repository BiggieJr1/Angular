import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursosAdmin } from '../../../services/cursos-admin';
import { Cursos } from '../../../services/cursos';
import { CursoFormValue, MisionCurso } from '../../../models/curso.model';
import { Curso as RetoResumen } from '../../../models/reto.model';
import { CATEGORIAS_RETO } from '../../../models/reto-admin.model';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './curso-form.html',
  styleUrl: './curso-form.css',
})
export class CursoForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cursosAdmin = inject(CursosAdmin);
  private cursoService = inject(Cursos); // reutiliza el catálogo público de retos (GET /api/retos)

  categorias = CATEGORIAS_RETO;

  // Si hay id en la URL, estamos editando ese curso; si no, estamos creando uno nuevo
  cursoId: string | null = null;

  form: CursoFormValue = {
    titulo: '',
    descripcion: '',
    categoria: CATEGORIAS_RETO[0],
  };

  misiones = signal<MisionCurso[]>([]);
  retosDisponibles = signal<RetoResumen[]>([]);
  retoIdSeleccionado = '';

  private indiceArrastrado: number | null = null;
  indiceSobrevolado: number | null = null;

  cargando = signal(false);
  guardando = signal(false);
  errorGeneral = signal('');
  mensajeExito = signal('');

  ngOnInit(): void {
    this.cursoId = this.route.snapshot.paramMap.get('id');

    // Se necesita para el selector de "agregar misión", tanto al crear como al editar
    this.cursoService.obtenerCursos().subscribe(retos => this.retosDisponibles.set(retos));

    if (!this.cursoId) {
      return;
    }

    this.cargando.set(true);
    this.cursosAdmin.obtener(this.cursoId).subscribe({
      next: curso => {
        this.form = {
          titulo: curso.titulo,
          descripcion: curso.descripcion,
          categoria: curso.categoria,
        };
        this.misiones.set(curso.misiones);
        this.cargando.set(false);
      },
      error: () => {
        this.errorGeneral.set('No se pudo cargar el curso.');
        this.cargando.set(false);
      },
    });
  }

  // Retos que todavía no son misión de este curso, para no ofrecerlos duplicados
  retosParaAgregar() {
    const idsEnCurso = new Set(this.misiones().map(m => m.retoId));
    return this.retosDisponibles().filter(r => !idsEnCurso.has(r.id));
  }

  guardar(): void {
    this.errorGeneral.set('');
    this.guardando.set(true);

    const accion$ = this.cursoId
      ? this.cursosAdmin.actualizar(this.cursoId, this.form)
      : this.cursosAdmin.crear(this.form);

    accion$.subscribe({
      next: curso => {
        this.guardando.set(false);
        if (this.cursoId) {
          this.mensajeExito.set('Cambios guardados.');
        } else {
          // Al crear, pasamos a editar ese mismo curso para poder agregarle misiones
          this.router.navigate(['/maestro/cursos', curso.cursoId, 'editar']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorGeneral.set(this.mensajeDeError(error));
      },
    });
  }

  agregarMision(): void {
    if (!this.cursoId || !this.retoIdSeleccionado) {
      return;
    }

    this.cursosAdmin.agregarMision(this.cursoId, this.retoIdSeleccionado).subscribe({
      next: curso => {
        this.misiones.set(curso.misiones);
        this.retoIdSeleccionado = '';
      },
      error: (error: HttpErrorResponse) => {
        this.errorGeneral.set(this.mensajeDeError(error));
      },
    });
  }

  quitarMision(retoId: string): void {
    if (!this.cursoId) {
      return;
    }

    this.cursosAdmin.quitarMision(this.cursoId, retoId).subscribe({
      next: curso => this.misiones.set(curso.misiones),
      error: () => this.errorGeneral.set('No se pudo quitar esa misión.'),
    });
  }

  arrastrarInicio(indice: number): void {
    this.indiceArrastrado = indice;
  }

  arrastrarSobre(indice: number): void {
    this.indiceSobrevolado = indice;
  }

  arrastrarFin(): void {
    this.indiceArrastrado = null;
    this.indiceSobrevolado = null;
  }

  soltar(indiceDestino: number): void {
    const indiceOrigen = this.indiceArrastrado;
    this.indiceArrastrado = null;
    this.indiceSobrevolado = null;

    if (!this.cursoId || indiceOrigen === null || indiceOrigen === indiceDestino) {
      return;
    }

    const nuevasMisiones = [...this.misiones()];
    const [movida] = nuevasMisiones.splice(indiceOrigen, 1);
    nuevasMisiones.splice(indiceDestino, 0, movida);

    const misionesAnteriores = this.misiones();
    this.misiones.set(nuevasMisiones);

    const retoIds = nuevasMisiones.map(m => m.retoId);
    this.cursosAdmin.reordenarMisiones(this.cursoId, retoIds).subscribe({
      next: curso => this.misiones.set(curso.misiones),
      error: () => {
        this.misiones.set(misionesAnteriores);
        this.errorGeneral.set('No se pudo reordenar las misiones.');
      },
    });
  }

  private mensajeDeError(error: HttpErrorResponse): string {
    if (error.status === 403) {
      return 'No tienes permiso para hacer esto.';
    }
    if (error.status === 404) {
      return 'El curso o el reto ya no existen.';
    }
    if (error.status === 409) {
      return 'Ese reto ya es parte del curso.';
    }
    return 'Ocurrió un error al guardar. Intenta de nuevo.';
  }
}
