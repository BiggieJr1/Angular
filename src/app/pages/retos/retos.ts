import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursosService } from '../cursos/cursos.service';
import { Curso } from './models/reto.model';

@Component({
  selector: 'app-retos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './retos.html',
})
export class MaestroRetos implements OnInit {
  private cursoService = inject(CursosService);

  retos = signal<Curso[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.cursoService.obtenerCursos().subscribe({
      next: (retos) => {
        this.retos.set(retos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
