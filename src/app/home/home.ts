import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { inject, signal } from '@angular/core';
import { Cursos } from '../services/cursos';
import { Curso } from '../models/reto.model';
import { RouterLink } from '@angular/router';

// 1. Definimos la interfaz para las categorías
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

  // 2. Iniciamos el arreglo vacío. Ya no tiene datos quemados aquí.
  cursos = signal<Curso[]>([]);

  // Arreglo dinámico que cambiará según lo que el usuario seleccione
  cursosFiltrados = signal<Curso[]>([]);

  // Variable para saber qué botón debe verse "activo"
  categoriaSeleccionada: string = 'Todos';

  categorias: Categoria[] = [
    { nombre: 'Frontend', icono: '💻' },
    { nombre: 'Backend', icono: '⚙️' },
    { nombre: 'DevOps', icono: '🚀' },
    { nombre: 'Bases de Datos', icono: '🗄️' },
    { nombre: 'Ciberseguridad', icono: '🛡️' },
    { nombre: 'Diseño UI/UX', icono: '🎨' },
    { nombre: 'Cloud', icono: '☁️' },
  ];

  // 3. Cuando el componente carga, le pedimos los datos al servicio (catálogo público, sin login)
  ngOnInit(): void {
    this.cursoService.obtenerCursos().subscribe(cursos => {
      this.cursos.set(cursos);
      // Al iniciar, mostramos todos los cursos por defecto
      this.cursosFiltrados.set(cursos);
    });
  }
  filtrarPorCategoria(nombreCategoria: string) {
    this.categoriaSeleccionada = nombreCategoria;

    if (nombreCategoria === 'Todos') {
      this.cursosFiltrados.set(this.cursos()); // Si elige 'Todos', restauramos la lista completa
    } else {
      // Si elige otra cosa, filtramos el arreglo original
      this.cursosFiltrados.set(this.cursos().filter(curso => curso.categoria === nombreCategoria));
    }
  }
}
