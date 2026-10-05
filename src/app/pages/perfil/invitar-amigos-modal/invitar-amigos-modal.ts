import { Component, DestroyRef, OnInit, inject, output, signal } from '@angular/core';
import { AmistadService } from '../../../core/data-access/amistad.service';

@Component({
  selector: 'app-invitar-amigos-modal',
  templateUrl: './invitar-amigos-modal.html',
  host: { '(document:keydown.escape)': 'cerrar.emit()' },
})
export class InvitarAmigosModal implements OnInit {
  private amistadService = inject(AmistadService);

  cerrar = output<void>();

  enlace = signal('');
  cargando = signal(true);
  error = signal('');
  copiado = signal(false);

  constructor() {
    document.body.classList.add('overflow-hidden');
    inject(DestroyRef).onDestroy(() => document.body.classList.remove('overflow-hidden'));
  }

  ngOnInit() {
    this.generar();
  }

  generar() {
    this.cargando.set(true);
    this.error.set('');
    this.copiado.set(false);

    this.amistadService.generarInvitacion().subscribe({
      next: ({ codigo }) => {
        this.enlace.set(`${window.location.origin}/invitacion/${codigo}`);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo generar el enlace. Intenta de nuevo.');
        this.cargando.set(false);
      },
    });
  }

  async copiar() {
    try {
      await navigator.clipboard.writeText(this.enlace());
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2000);
    } catch {
      this.error.set('No se pudo copiar. Selecciona el enlace y cópialo a mano.');
    }
  }
}