import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/data-access/auth.service';
import { ProgresoService } from './progreso.service';
import { DatosProgreso, RetoProgreso } from './models/progreso.model';

@Component({
  selector: 'app-mi-progreso',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './progreso.html',
  styleUrl: './progreso.css',
})
export class MiProgreso {
  private authService = inject(AuthService);
  private progresoService = inject(ProgresoService);

  usuarioActual = this.authService.usuarioActual;

  datos = signal<DatosProgreso | null>(null);
  cargando = signal(false);
  error = signal(false);

  progreso = computed(() => this.datos()?.progreso ?? null);
  retos = computed<RetoProgreso[]>(() => this.datos()?.retos ?? []);

  // Los que faltan, de más fáciles a más difíciles
  pendientes = computed(() =>
    this.retos()
      .filter((r) => !r.resuelto)
      .sort((a, b) => a.dificultad - b.dificultad || a.titulo.localeCompare(b.titulo)),
  );
  resueltos = computed(() =>
    this.retos()
      .filter((r) => r.resuelto)
      .sort((a, b) => a.titulo.localeCompare(b.titulo)),
  );

  totalRetos = computed(() => this.retos().length);
  porcentaje = computed(() =>
    this.totalRetos() === 0 ? 0 : Math.round((this.resueltos().length / this.totalRetos()) * 100),
  );

  constructor() {
    // Se recarga solo si el usuario inicia o cierra sesión estando en esta pantalla
    effect(() => {
      const usuario = this.usuarioActual();
      this.datos.set(null);
      this.error.set(false);
      if (!usuario) {
        return;
      }
      this.cargando.set(true);
      this.progresoService.cargar(usuario.usuarioId).subscribe({
        next: (datos) => {
          this.datos.set(datos);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set(true);
          this.cargando.set(false);
        },
      });
    });
  }

  iniciarSesion() {
    this.authService.abrirModal(true);
  }
}
