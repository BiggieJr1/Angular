import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Cursos } from '../services/cursos';
import { Curso } from '../cursos.mock';

// 1. Definimos la interfaz para las categorías
interface Categoria {
  nombre: string;
  icono: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private cursoService = inject(Cursos);

  // 2. Iniciamos el arreglo vacío. Ya no tiene datos quemados aquí.
  cursos: Curso[] = [];

  categorias: Categoria[] = [
    { nombre: 'Frontend', icono: '💻' },
    { nombre: 'Backend', icono: '⚙️' },
    { nombre: 'DevOps', icono: '🚀' },
    { nombre: 'Bases de Datos', icono: '🗄️' },
    { nombre: 'Ciberseguridad', icono: '🛡️' },
    { nombre: 'Diseño UI/UX', icono: '🎨' },
    { nombre: 'Cloud', icono: '☁️' }
  ];

  // 3. Cuando el componente carga, le pedimos los datos al servicio
  ngOnInit(): void {
    this.cursos = this.cursoService.obtenerCursos();
  }
}
