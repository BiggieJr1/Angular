import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../core/data-access/auth.service';
import { InsigniasService } from './insignias.service';
import { DatosInsignias } from './models/insignia.model';

@Component({
  selector: 'app-mis-insignias',
  standalone: true,
  templateUrl: './insignias.html',
})
export class MisInsignias {
  private authService = inject(AuthService);
  private insigniasService = inject(InsigniasService);

  usuarioActual = this.authService.usuarioActual;

  datos = signal<DatosInsignias | null>(null);
  cargando = signal(false);
  error = signal(false);
  // Íconos cuya URL no cargó: se reemplazan por un emoji
  iconosFallidos = signal<ReadonlySet<string>>(new Set());

  obtenidas = computed(() => this.datos()?.obtenidas ?? []);
  porDesbloquear = computed(() => this.datos()?.porDesbloquear ?? []);
  total = computed(() => this.obtenidas().length + this.porDesbloquear().length);

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
      this.insigniasService.cargar(usuario.usuarioId).subscribe({
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

  tieneIcono(insigniaId: string, iconoUrl: string | null): boolean {
    return !!iconoUrl && !this.iconosFallidos().has(insigniaId);
  }

  marcarIconoFallido(insigniaId: string) {
    this.iconosFallidos.update((actuales) => new Set(actuales).add(insigniaId));
  }

  iniciarSesion() {
    this.authService.abrirModal(true);
  }
}
