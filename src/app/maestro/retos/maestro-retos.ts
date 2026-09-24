import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cursos } from '../../services/cursos';
import { Curso } from '../../models/reto.model';

@Component({
  selector: 'app-maestro-retos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './maestro-retos.html',
  styleUrl: './maestro-retos.css',
})
export class MaestroRetos implements OnInit {
  private cursoService = inject(Cursos);

  retos = signal<Curso[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.cursoService.obtenerCursos().subscribe({
      next: retos => {
        this.retos.set(retos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
