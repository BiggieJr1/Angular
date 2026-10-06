import { Component, computed, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/data-access/auth.service';
import { PuntuacionService } from './puntuacion.service';
import { Puntuacion } from './models/puntuacion.model';

// Regla del backend (PuntuacionDomainService): nivel = (experiencia / 100) + 1
const XP_POR_NIVEL = 100;

@Component({
  selector: 'app-mi-puntuacion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './puntuacion.html',
})
export class MiPuntuacion {
  private authService = inject(AuthService);
  private puntuacionService = inject(PuntuacionService);

  usuarioActual = this.authService.usuarioActual;

  puntuacion = signal<Puntuacion | null>(null);
  cargando = signal(false);
  error = signal(false);
  // El backend responde 404 si el usuario todavía no tiene puntuación
  sinPuntuacion = signal(false);

  // Categorías de más a menos puntos
  categorias = computed(() => [...(this.puntuacion()?.puntosPorCategoria ?? [])].sort((a, b) => b.puntos - a.puntos || a.categoria.localeCompare(b.categoria)));

  // Para calcular el ancho de las barras (la categoría con más puntos ocupa el 100%)
  maxPuntosCategoria = computed(() => Math.max(0, ...this.categorias().map((c) => c.puntos)));

  xpEnNivel = computed(() => (this.puntuacion()?.experiencia ?? 0) % XP_POR_NIVEL);
  xpParaSiguiente = computed(() => XP_POR_NIVEL - this.xpEnNivel());
  porcentajeNivel = computed(() => Math.round((this.xpEnNivel() / XP_POR_NIVEL) * 100));

  constructor() {
    // Se recarga solo si el usuario inicia o cierra sesión estando en esta pantalla
    effect(() => {
      const usuario = this.usuarioActual();
      this.puntuacion.set(null);
      this.error.set(false);
      this.sinPuntuacion.set(false);
      if (!usuario) {
        return;
      }
      this.cargando.set(true);
      this.puntuacionService.consultar(usuario.usuarioId).subscribe({
        next: (puntuacion) => {
          this.puntuacion.set(puntuacion);
          this.cargando.set(false);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.sinPuntuacion.set(true);
          } else {
            this.error.set(true);
          }
          this.cargando.set(false);
        },
      });
    });
  }

  ancho(puntos: number): number {
    const max = this.maxPuntosCategoria();
    return max === 0 ? 0 : Math.round((puntos / max) * 100);
  }

  iniciarSesion() {
    this.authService.abrirModal(true);
  }
}
