import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursosAlumno } from '../cursos-alumno.service';
import { CursoConMisiones } from '../models/curso.model';

@Component({
  selector: 'app-catalogo-cursos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalogo-cursos.html',
})
export class CatalogoCursos implements OnInit {
  private cursosAlumno = inject(CursosAlumno);

  cursos = signal<CursoConMisiones[]>([]);
  cargando = signal(true);
  error = signal(false);

  ngOnInit(): void {
    // El listado de cursos es público: no requiere sesión
    this.cursosAlumno.listar().subscribe({
      next: (cursos) => {
        this.cursos.set(cursos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}
