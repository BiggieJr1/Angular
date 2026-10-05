import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../core/data-access/auth.service';
import { PerfilService } from '../../core/data-access/perfil.service';
import { CuentaResponse, PerfilResponse, ProgresoResponse } from '../../core/models/perfil.model';
import { EditarPerfilModal } from './editar-perfil-modal/editar-perfil-modal';
import { InvitarAmigosModal } from './invitar-amigos-modal/invitar-amigos-modal';

@Component({
  selector: 'app-mi-perfil',
  imports: [RouterLink, DatePipe, EditarPerfilModal, InvitarAmigosModal],
  templateUrl: './perfil.html',
})
export class MiPerfil {
  private auth = inject(AuthService);
  private perfilService = inject(PerfilService);

  cargando = signal(true);
  perfil = signal<PerfilResponse | null>(null);
  cuenta = signal<CuentaResponse | null>(null);
  progreso = signal<ProgresoResponse | null>(null);
  editando = signal(false);
  invitando = signal(false);

  // Si el usuario no tiene perfil o puntuación todavía, la página se muestra igual
  sinDatos = computed(() => !this.perfil() && !this.cuenta() && !this.progreso());

  nombre = computed(() => this.perfil()?.nombre ?? this.auth.usuarioActual()?.email ?? 'Usuario');
  inicial = computed(() => this.nombre().charAt(0).toUpperCase());

  tasaAprobacion = computed(() => {
    const p = this.progreso();
    return p && p.totalIntentos > 0 ? Math.round((p.totalAprobados / p.totalIntentos) * 100) : 0;
  });

  alGuardar(actualizado: PerfilResponse) {
    this.perfil.set(actualizado);
    this.auth.usuarioActual.update((u) => (u ? { ...u, nombre: actualizado.nombre } : u));
    this.editando.set(false);
  }

  constructor() {
    const usuarioId = this.auth.usuarioActual()?.usuarioId;
    if (!usuarioId) {
      this.cargando.set(false);
      return;
    }

    forkJoin({
      perfil: this.perfilService.consultarPerfil(usuarioId).pipe(catchError(() => of(null))),
      cuenta: this.perfilService.consultarCuenta(usuarioId).pipe(catchError(() => of(null))),
      progreso: this.perfilService.consultarProgreso(usuarioId).pipe(catchError(() => of(null))),
    }).subscribe(({ perfil, cuenta, progreso }) => {
      this.perfil.set(perfil);
      this.cuenta.set(cuenta);
      this.progreso.set(progreso);
      this.cargando.set(false);
    });
  }
}