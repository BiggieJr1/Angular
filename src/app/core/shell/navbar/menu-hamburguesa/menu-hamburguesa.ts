import { Component, effect, inject, signal } from '@angular/core';
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