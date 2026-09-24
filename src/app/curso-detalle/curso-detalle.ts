import { Component, OnInit } from '@angular/core';
import { inject, signal } from '@angular/core';
import { Cursos } from '../services/cursos';
import { Curso } from '../models/reto.model';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-curso-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './curso-detalle.html',
  styleUrl: './curso-detalle.css',
})
export class CursoDetalle implements OnInit {
  // Inyectamos las herramientas necesarias
  private route = inject(ActivatedRoute);
  private cursoService = inject(Cursos);

  // Variable para guardar el curso encontrado
  curso = signal<Curso | undefined>(undefined);

  mostrarToast = signal(false);

  ngOnInit(): void {
    // 1. Extraemos el 'id' de la URL (ej: /curso/3fa8...) - los retos usan GUID, no un número
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.curso.set(undefined);
      return;
    }

    // 2. Buscamos el curso utilizando el servicio; si el backend responde 404, no existe
    this.cursoService.obtenerCursoPorId(idParam).subscribe({
      next: curso => this.curso.set(curso),
      error: () => this.curso.set(undefined),
    });
  }

  inscribirse() {
    this.mostrarToast.set(true);

    // 3. El setTimeout oculta el Toast automáticamente después de 3.5 segundos
    setTimeout(() => {
      this.mostrarToast.set(false);
    }, 3500);
  }
}
