import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../core/data-access/auth.service';
import { ClasificacionService } from './clasificacion.service';
import { ClasificacionEntrada, ClasificacionPagina } from './models/clasificacion.model';

@Component({
  selector: 'app-clasificacion',
  standalone: true,
  templateUrl: './clasificacion.html',
  styleUrl: './clasificacion.css',
})
export class Clasificacion {
  private authService = inject(AuthService);
  private clasificacionService = inject(ClasificacionService);

  usuarioActual = this.authService.usuarioActual;

  pagina = signal(1);
  // Se incrementa para volver a pedir la misma página (botón "Reintentar")
  private recarga = signal(0);
  datos = signal<ClasificacionPagina | null>(null);
  nombres = signal<Record<string, string>>({});
  cargando = signal(false);
  error = signal(false);

  // Evita que una respuesta lenta pise a una más reciente (por ejemplo al cambiar de página rápido)
  private solicitud = 0;

  totalPaginas = computed(() => {
    const d = this.datos();
    return d ? Math.max(1, Math.ceil(d.totalRegistros / d.tamanoPagina)) : 1;
  });
  hayAnterior = computed(() => this.pagina() > 1);
  haySiguiente = computed(() => this.pagina() < this.totalPaginas());

  constructor() {
    // Se recarga al cambiar de página o si el usuario inicia/cierra sesión
    effect(() => {
      const usuario = this.usuarioActual();
      const pagina = this.pagina();
      this.recarga();
      if (!usuario) {
        this.datos.set(null);
        this.nombres.set({});
        this.error.set(false);
        this.cargando.set(false);
        return;
      }

      const solicitud = ++this.solicitud;
      this.cargando.set(true);
      this.error.set(false);
      this.clasificacionService.consultarGlobal(pagina).subscribe({
        next: (respuesta) => {
          if (solicitud !== this.solicitud) return;
          this.datos.set(respuesta);
          this.cargando.set(false);
          this.clasificacionService.nombresDe(respuesta.entradas.map((e) => e.usuarioId)).subscribe((nombres) => {
            if (solicitud !== this.solicitud) return;
            this.nombres.update((actuales) => ({ ...actuales, ...nombres }));
          });
        },
        error: () => {
          if (solicitud !== this.solicitud) return;
          this.error.set(true);
          this.cargando.set(false);
        },
      });
    });
  }

  esUsuarioActual(entrada: ClasificacionEntrada): boolean {
    return entrada.usuarioId.toLowerCase() === this.usuarioActual()?.usuarioId.toLowerCase();
  }

  nombreDe(entrada: ClasificacionEntrada): string {
    const delPerfil = this.nombres()[entrada.usuarioId];
    const delaSesion = this.esUsuarioActual(entrada) ? this.usuarioActual()?.nombre : undefined;
    return delPerfil ?? delaSesion ?? `Alumno ${entrada.usuarioId.slice(0, 6)}`;
  }

  medalla(posicion: number): string | null {
    return posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : posicion === 3 ? '🥉' : null;
  }

  anterior() {
    if (this.hayAnterior()) {
      this.pagina.update((p) => p - 1);
    }
  }

  siguiente() {
    if (this.haySiguiente()) {
      this.pagina.update((p) => p + 1);
    }
  }

  reintentar() {
    this.recarga.update((n) => n + 1);
  }

  iniciarSesion() {
    this.authService.abrirModal(true);
  }
}
