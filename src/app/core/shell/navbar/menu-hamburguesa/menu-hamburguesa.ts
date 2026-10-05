import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../data-access/auth.service';
import { MenuNavegacionComponent } from './menu-navegacion/menu-navegacion.component';
import { MenuPerfilComponent } from './menu-perfil/menu-perfil.component';
import { MenuPanelComponent } from './menu-panel/menu-panel.component';

@Component({
  selector: 'app-menu-hamburguesa',
  imports: [MenuPerfilComponent, MenuNavegacionComponent, MenuPanelComponent],
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
