import { Component, inject, output, signal } from '@angular/core';
import { AuthService } from '../../../core/data-access/auth.service';
import { AmistadService } from '../../../core/data-access/amistad.service';
import { AmigoResponse } from '../../../core/models/amistad.model';

@Component({
  selector: 'app-lista-amigos',
  imports: [],
  templateUrl: './lista-amigos.component.html',
})
export class ListaAmigosComponent {
  private auth = inject(AuthService);
  private amistadService = inject(AmistadService);

  totalCambiado = output<number>();

  cargando = signal(true);
  error = signal(false);
  amigos = signal<AmigoResponse[]>([]);
  confirmandoId = signal<string | null>(null);
  eliminandoId = signal<string | null>(null);
  errorEliminar = signal<string | null>(null);

  constructor() {}

  cargar() {
    const usuarioId = this.auth.usuarioActual()?.usuarioId;
    if (!usuarioId) {
      this.cargando.set(false);
      this.error.set(true);
      return;
    }

    this.cargando.set(true);
    this.error.set(false);
    this.amistadService.consultarAmistades(usuarioId).subscribe({
      next: (amigos) => {
        this.amigos.set(amigos);
        this.cargando.set(false);
        this.totalCambiado.emit(amigos.length);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  pedirConfirmacion(id: string) {
    this.errorEliminar.set(null);
    this.confirmandoId.set(id);
  }

  cancelar() {
    this.confirmandoId.set(null);
  }

  eliminar(amigo: AmigoResponse) {
    this.eliminandoId.set(amigo.usuarioSeguidoId);
    this.errorEliminar.set(null);

    this.amistadService.eliminarAmistad(amigo.usuarioSeguidoId).subscribe({
      next: () => {
        const restantes = this.amigos().filter((a) => a.usuarioSeguidoId !== amigo.usuarioSeguidoId);
        this.amigos.set(restantes);
        this.totalCambiado.emit(restantes.length);
        this.eliminandoId.set(null);
        this.confirmandoId.set(null);
      },
      error: () => {
        this.eliminandoId.set(null);
        this.errorEliminar.set('No se pudo eliminar la amistad. Intenta de nuevo.');
      },
    });
  }
}
