import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { PerfilService } from '../../../core/data-access/perfil.service';
import { RetosAdmin } from '../retos-admin.service';
import { ResultadoAlumnoReto } from '../models/reto-resumen.model';

type ErrorResultados = 'sin-acceso' | 'no-encontrado' | 'generico' | null;

// HU-25 (criterio 2): desglose por alumno de un reto del maestro
@Component({
  selector: 'app-resultados-reto',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './resultados-reto.html',
})
export class ResultadosReto implements OnInit {
  private route = inject(ActivatedRoute);
  private retosAdmin = inject(RetosAdmin);
  private perfilService = inject(PerfilService);

  titulo = signal('');
  resultados = signal<ResultadoAlumnoReto[]>([]);
  nombres = signal<Record<string, string>>({});
  cargando = signal(true);
  error = signal<ErrorResultados>(null);

  totalAprobados = computed(() => this.resultados().filter((r) => r.aprobado).length);

  ngOnInit(): void {
    const retoId = this.route.snapshot.paramMap.get('id');
    if (!retoId) {
      this.error.set('no-encontrado');
      this.cargando.set(false);
      return;
    }

    // El título es solo decorativo: si falla, la pantalla funciona igual
    this.retosAdmin.obtenerCompleto(retoId).subscribe({
      next: (reto) => this.titulo.set(reto.titulo),
      error: () => {},
    });

    this.retosAdmin.resultadosPorAlumno(retoId).subscribe({
      next: (resultados) => {
        this.resultados.set(resultados);
        this.cargando.set(false);
        this.cargarNombres(resultados);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.status === 403 ? 'sin-acceso' : err.status === 404 ? 'no-encontrado' : 'generico');
        this.cargando.set(false);
      },
    });
  }

  nombreDe(resultado: ResultadoAlumnoReto): string {
    return this.nombres()[resultado.usuarioId] ?? `Alumno ${resultado.usuarioId.slice(0, 6)}`;
  }

  // El backend solo devuelve el usuarioId, así que los nombres se piden aparte al perfil
  private cargarNombres(resultados: ResultadoAlumnoReto[]) {
    if (resultados.length === 0) {
      return;
    }
    forkJoin(
      resultados.map((r) =>
        this.perfilService.consultarPerfil(r.usuarioId).pipe(
          map((perfil) => [r.usuarioId, perfil.nombre || null] as const),
          catchError(() => of([r.usuarioId, null] as const)),
        ),
      ),
    ).subscribe((pares) => {
      const nombres: Record<string, string> = {};
      for (const [id, nombre] of pares) {
        if (nombre) {
          nombres[id] = nombre;
        }
      }
      this.nombres.set(nombres);
    });
  }
}
