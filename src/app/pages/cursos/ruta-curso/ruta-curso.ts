import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';
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
  styleUrl: './ruta-curso.css',
})
export class RutaCurso implements OnInit {
  private route = inject(ActivatedRoute);
  private cursosAlumno = inject(CursosAlumno);
  private authService = inject(AuthService);

  curso = signal<CursoConMisiones | undefined>(undefined);
  cargando = signal(true);

  usuarioActual = this.authService.usuarioActual;

  // Retos que el alumno ya aprobó. Solo se conoce si hay sesión y el historial cargó bien;
  // si no, no mostramos estados para no afirmar "pendiente" sin saberlo.
  private retosResueltos = signal<Set<string>>(new Set());
  progresoDisponible = signal(false);

  // Misiones en el orden definido por el Maestro, cada una con su estado
  misiones = computed<MisionConEstado[]>(() => {
    const curso = this.curso();
    if (!curso) return [];
    const resueltos = this.retosResueltos();
    return [...curso.misiones]
      .sort((a, b) => a.orden - b.orden)
      .map(mision => ({
        ...mision,
        estado: resueltos.has(mision.retoId) ? 'resuelta' : 'pendiente',
      }));
  });

  totalResueltas = computed(() => this.misiones().filter(m => m.estado === 'resuelta').length);
  porcentaje = computed(() => {
    const total = this.misiones().length;
    return total === 0 ? 0 : Math.round((this.totalResueltas() / total) * 100);
  });

  constructor() {
    // Si el alumno inicia o cierra sesión estando en esta pantalla, el progreso se actualiza solo
    effect(() => {
      const usuario = this.usuarioActual();
      if (!usuario) {
        this.retosResueltos.set(new Set());
        this.progresoDisponible.set(false);
        return;
      }
      this.cursosAlumno.obtenerRetosResueltos(usuario.usuarioId).subscribe({
        next: resueltos => {
          this.retosResueltos.set(resueltos);
          this.progresoDisponible.set(true);
        },
        error: () => this.progresoDisponible.set(false),
      });
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.cargando.set(false);
      return;
    }

    // Detalle público; si el backend responde 404 (o el id no es válido) mostramos "no encontrado"
    this.cursosAlumno.obtener(id).subscribe({
      next: curso => {
        this.curso.set(curso);
        this.cargando.set(false);
      },
      error: () => {
        this.curso.set(undefined);
        this.cargando.set(false);
      },
    });
  }

  iniciarSesion() {
    this.authService.abrirModal(true);
  }
}
