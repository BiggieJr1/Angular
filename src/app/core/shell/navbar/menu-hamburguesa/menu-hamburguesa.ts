import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../data-access/auth.service';

@Component({
  selector: 'app-menu-hamburguesa',
  imports: [RouterLink],
  templateUrl: './menu-hamburguesa.html',
  host: {
    '(document:keydown.escape)': 'cerrar()',
  },
})
export class MenuHamburguesa {
  usuarioActual = inject(AuthService).usuarioActual;

  abierto = signal(false);

  nombreMostrado = computed(() => {
    const usuario = this.usuarioActual();
    return usuario?.nombre?.trim() || usuario?.email?.split('@')[0] || '';
  });

  iniciales = computed(() => {
    const palabras = this.nombreMostrado()
      .split(/[\s._-]+/)
      .filter(Boolean);

    if (palabras.length === 0) return '?';

    const primera = palabras[0][0];
    const segunda = palabras.length > 1 ? palabras[1][0] : '';
    return (primera + segunda).toUpperCase();
  });

  constructor() {
    // Bloquea el scroll de la página mientras el menú está abierto
    effect(() => {
      document.body.classList.toggle('overflow-hidden', this.abierto());
    });
  }

  alternar() {
    this.abierto.update((v) => !v);
  }

  cerrar() {
    this.abierto.set(false);
  }
}
