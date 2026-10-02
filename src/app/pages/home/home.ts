import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursosService } from '../cursos/cursos.service';
import { Curso } from '../retos/models/reto.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Categoria } from './models';
import { EmptyStateComponent } from '../../core/components';
import { CursoCardComponent } from './curso-card/curso-card.component';
import { SelectorCategoriasComponent } from './selector-categorias/selector-categorias.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SelectorCategoriasComponent, CursoCardComponent, EmptyStateComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly cursosService = inject(CursosService);

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
    return categoria
      ? this.cursos().filter((curso) => curso.categoria === categoria)
      : this.cursos();
  });

  // Clic en la categoría ya activa = quitar el filtro
  protected alternarCategoria(nombre: string): void {
    this.categoriaSeleccionada.update((actual) => (actual === nombre ? '' : nombre));
  }
}
