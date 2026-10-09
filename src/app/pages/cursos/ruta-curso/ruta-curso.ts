import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CursosAlumno } from '../cursos-alumno.service';
import { AuthService } from '../../../core/data-access/auth.service';
import { CursoConMisiones, EstadoMision, MisionCurso } from '../models/curso.model';

interface MisionConEstado extends MisionCurso {
  estado: EstadoMision;
}

@Component({
  selector: 'app-ruta-curso',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ruta-curso.html',
})
export class RutaCurso implements OnInit {
  private route = inject(ActivatedRoute);
  private cursosAlumno = inject(CursosAlumno);
  private authService = inject(AuthService);

  curso = signal<CursoConMisiones | undefined>(undefined);
  cargando = signal(true);

  usuarioActual = this.authService.usuarioActual;

  // Inscripción al curso
  inscrito = signal(false);
  inscribiendo = signal(false);
  errorInscripcion = signal('');

  private retosResueltos = signal<Set<string>>(new Set());
  progresoDisponible = signal(false);

  misiones = computed<MisionConEstado[]>(() => {
    const curso = this.curso();
    if (!curso) return [];
    const resueltos = this.retosResueltos();
    return [...curso.misiones]
      .sort((a, b) => a.orden - b.orden)
      .map((mision) => ({
        ...mision,
        estado: resueltos.has(mision.retoId) ? 'resuelta' : 'pendiente',
      }));
  });

  totalResueltas = computed(() => this.misiones().filter((m) => m.estado === 'resuelta').length);
  porcentaje = computed(() => {
    const total = this.misiones().length;
    return total === 0 ? 0 : Math.round((this.totalResueltas() / total) * 100);
  });

  constructor() {
    // Al iniciar/cerrar sesión se actualizan inscripción y progreso
    effect(() => {
      const usuario = this.usuarioActual();
      if (!usuario) {
        this.retosResueltos.set(new Set());
        this.progresoDisponible.set(false);
        this.inscrito.set(false);
        return;
      }

      this.cursosAlumno.obtenerRetosResueltos(usuario.usuarioId).subscribe({
        next: (resueltos) => {
          this.retosResueltos.set(resueltos);
          this.progresoDisponible.set(true);
        },
        error: () => this.progresoDisponible.set(false),
      });

      this.cursosAlumno.obtenerCursosInscritos().subscribe({
        next: (ids) => this.inscrito.set(ids.has(this.route.snapshot.paramMap.get('id') ?? '')),
        error: () => this.inscrito.set(false),
      });
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.cargando.set(false);
      return;
    }

    this.cursosAlumno.obtener(id).subscribe({
      next: (curso) => {
        this.curso.set(curso);
        this.cargando.set(false);
      },
      error: () => {
        this.curso.set(undefined);
        this.cargando.set(false);
      },
    });
  }

  inscribirse() {
    const curso = this.curso();
    if (!curso) return;

    if (!this.usuarioActual()) {
      this.authService.abrirModal(true);
      return;
    }

    this.inscribiendo.set(true);
    this.errorInscripcion.set('');

    this.cursosAlumno.inscribirse(curso.cursoId).subscribe({
      next: () => {
        this.inscrito.set(true);
        this.inscribiendo.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.inscribiendo.set(false);
        // 409 = ya estaba inscrito
        if (e.status === 409) {
          this.inscrito.set(true);
          return;
        }
        this.errorInscripcion.set('No se pudo completar la inscripción. Intenta de nuevo.');
      },
    });
  }

  iniciarSesion() {
    this.authService.abrirModal(true);
  }
}