import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursosService } from '../cursos/cursos.service';
import { Curso } from '../retos/models/reto.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Categoria } from './models';
import { EmptyStateComponent } from '../../core/components';
import { CursoCardComponent } from './curso-card/curso-card.component';
import { SelectorCategoriasComponent } from './selector-categorias/selector-categorias.component';
import { AuthService } from '../../core/data-access/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SelectorCategoriasComponent, CursoCardComponent, EmptyStateComponent, RouterLink],
  templateUrl: './home.html',
})
export class Home {
  private readonly cursosService = inject(CursosService);
  private readonly authService = inject(AuthService);

  protected readonly categorias: Categoria[] = [
    { nombre: 'Frontend', icono: '💻' },
    { nombre: 'Backend', icono: '⚙️' },
    { nombre: 'DevOps', icono: '🚀' },
    { nombre: 'Bases de Datos', icono: '🗄️' },
    { nombre: 'Ciberseguridad', icono: '🛡️' },
    { nombre: 'Diseño UI/UX', icono: '🎨' },
    { nombre: 'Cloud', icono: '☁️' },
  ];

  // Catálogo público (sin login): todos los cursos que llegan del servicio
  private readonly cursos = toSignal(this.cursosService.obtenerCursos(), {
    initialValue: [] as Curso[],
  });

  // Categoría activa. Vacío = sin filtro (se muestran todos)
  protected readonly categoriaSeleccionada = signal('');

  protected readonly cursoSeleccionado = signal<Curso | undefined>(undefined);

  protected readonly mostrarToast = signal(false);

  // Cuántos cursos hay por categoría (contador de cada tarjeta)
  protected readonly conteoPorCategoria = computed(() => {
    const conteo: Record<string, number> = {};
    for (const curso of this.cursos()) {
      conteo[curso.categoria] = (conteo[curso.categoria] ?? 0) + 1;
    }
    return conteo;
  });

  // Cursos visibles según la categoría activa
  protected readonly cursosFiltrados = computed(() => {
    const categoria = this.categoriaSeleccionada();
    return categoria ? this.cursos().filter((curso) => curso.categoria === categoria) : this.cursos();
  });

  // Clic en la categoría ya activa = quitar el filtro
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

  protected inscribirse() {
    if (!this.authService.obtenerUsuarioActual()) {
      this.authService.abrirModal(true);
      return;
    }

    this.mostrarToast.set(true);
    setTimeout(() => {
      this.mostrarToast.set(false);
    }, 3500);
  }
}
