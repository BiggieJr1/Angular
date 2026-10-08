import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CursosService } from '../cursos/cursos.service';
import { CursosAlumno } from '../cursos/cursos-alumno.service';
import { Curso } from '../retos/models/reto.model';
import { Categoria } from './models';
import { EmptyStateComponent } from '../../core/components';
import { CursoCardComponent } from './curso-card/curso-card.component';
import { SelectorCategoriasComponent } from './selector-categorias/selector-categorias.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SelectorCategoriasComponent, CursoCardComponent, EmptyStateComponent, RouterLink],
  templateUrl: './home.html',
})
export class Home {
  private readonly cursosService = inject(CursosService);
  private readonly cursosAlumno = inject(CursosAlumno);

  protected readonly categorias: Categoria[] = [
    { nombre: 'Frontend', icono: '💻' },
    { nombre: 'Backend', icono: '⚙️' },
    { nombre: 'DevOps', icono: '🚀' },
    { nombre: 'Bases de Datos', icono: '🗄️' },
    { nombre: 'Ciberseguridad', icono: '🛡️' },
    { nombre: 'Diseño UI/UX', icono: '🎨' },
    { nombre: 'Cloud', icono: '☁️' },
  ];

  // Catálogo público: cursos reales primero, luego los retos individuales.
  // Si una de las dos peticiones falla, se muestra la otra.
  private readonly cursos = toSignal(
    forkJoin({
      cursos: this.cursosAlumno.listarTarjetas().pipe(catchError(() => of([] as Curso[]))),
      retos: this.cursosService.obtenerCursos().pipe(catchError(() => of([] as Curso[]))),
    }).pipe(map(({ cursos, retos }) => [...cursos, ...retos])),
    { initialValue: [] as Curso[] },
  );

  protected readonly categoriaSeleccionada = signal('');

  protected readonly cursoSeleccionado = signal<Curso | undefined>(undefined);

  protected readonly conteoPorCategoria = computed(() => {
    const conteo: Record<string, number> = {};
    for (const curso of this.cursos()) {
      conteo[curso.categoria] = (conteo[curso.categoria] ?? 0) + 1;
    }
    return conteo;
  });

  protected readonly cursosFiltrados = computed(() => {
    const categoria = this.categoriaSeleccionada();
    return categoria ? this.cursos().filter((curso) => curso.categoria === categoria) : this.cursos();
  });

  protected alternarCategoria(nombre: string): void {
    this.categoriaSeleccionada.update((actual) => (actual === nombre ? '' : nombre));
    this.cursoSeleccionado.set(undefined);
  }

  protected seleccionarCurso(curso: Curso) {
    this.cursoSeleccionado.set(curso);
  }

  protected cerrarDetalles() {
    this.cursoSeleccionado.set(undefined);
  }
}