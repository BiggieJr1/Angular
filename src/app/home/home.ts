import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cursos } from '../services/cursos';
import { Curso } from '../models/reto.model';

// Definimos la interfaz para las categorías
interface Categoria {
  nombre: string;
  icono: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private cursoService = inject(Cursos);

  // Todos los cursos que llegan del servicio
  cursos = signal<Curso[]>([]);

  // Cursos que se muestran según la categoría seleccionada
  cursosFiltrados = signal<Curso[]>([]);

  // Categoría activa. Vacío = sin filtro (se muestran todos)
  categoriaSeleccionada: string = '';

  categorias: Categoria[] = [
    { nombre: 'Frontend', icono: '💻' },
    { nombre: 'Backend', icono: '⚙️' },
    { nombre: 'DevOps', icono: '🚀' },
    { nombre: 'Bases de Datos', icono: '🗄️' },
    { nombre: 'Ciberseguridad', icono: '🛡️' },
    { nombre: 'Diseño UI/UX', icono: '🎨' },
    { nombre: 'Cloud', icono: '☁️' },
  ];

  // Cuando el componente carga, le pedimos los datos al servicio (catálogo público, sin login)
  ngOnInit(): void {
    this.cursoService.obtenerCursos().subscribe(cursos => {
      this.cursos.set(cursos);
      // Al iniciar, mostramos todos los cursos por defecto
      this.cursosFiltrados.set(cursos);
    });
  }

  // Cuántos cursos hay en una categoría (para el contador de cada tarjeta)
  contarCursos(categoria: string): number {
    return this.cursos().filter(c => c.categoria === categoria).length;
  }

  filtrarPorCategoria(nombreCategoria: string) {
    // Si haces clic en la que ya estaba seleccionada, se quita el filtro
    this.categoriaSeleccionada =
      this.categoriaSeleccionada === nombreCategoria ? '' : nombreCategoria;

    if (this.categoriaSeleccionada === '') {
      this.cursosFiltrados.set(this.cursos());
    } else {
      this.cursosFiltrados.set(
        this.cursos().filter(curso => curso.categoria === this.categoriaSeleccionada)
      );
    }
  }
}