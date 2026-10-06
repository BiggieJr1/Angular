import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursosAdmin } from './cursos-admin.service';
import { CursoConMisiones } from './models/curso.model';

@Component({
  selector: 'app-maestro-cursos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cursos.html',
})
export class MaestroCursos implements OnInit {
  private cursosAdmin = inject(CursosAdmin);

  cursos = signal<CursoConMisiones[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.cursosAdmin.listar().subscribe({
      next: (cursos) => {
        this.cursos.set(cursos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
