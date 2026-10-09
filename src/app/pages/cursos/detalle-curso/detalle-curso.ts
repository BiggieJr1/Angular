import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursosService } from '../cursos.service';
import { AuthService } from '../../../core/data-access/auth.service';
import { Curso } from '../../retos/models/reto.model';

@Component({
  selector: 'app-detalle-curso',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle-curso.html',
})
export class CursoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cursoService = inject(CursosService);
  private authService = inject(AuthService);

  // Aquí "curso" es en realidad un reto
  curso = signal<Curso | undefined>(undefined);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.curso.set(undefined);
      return;
    }

    this.cursoService.obtenerCursoPorId(idParam).subscribe({
      next: (curso) => this.curso.set(curso),
      error: () => this.curso.set(undefined),
    });
  }

  empezar() {
    const curso = this.curso();
    if (!curso) return;

    // Resolver un reto requiere sesión
    if (!this.authService.obtenerUsuarioActual()) {
      this.authService.abrirModal(true);
      return;
    }

    this.router.navigate(['/leccion', curso.id]);
  }
}