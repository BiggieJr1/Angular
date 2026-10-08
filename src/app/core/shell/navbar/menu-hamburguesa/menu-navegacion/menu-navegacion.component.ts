import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuEnlaceComponent } from '../menu-enlace/menu-enlace.component';
import { AuthService } from '../../../../data-access/auth.service';

@Component({
  selector: 'menu-navegacion',
  imports: [RouterLink, MenuEnlaceComponent],
  templateUrl: './menu-navegacion.component.html',
  host: { class: 'block' },
})
export class MenuNavegacionComponent {
  usuarioActual = inject(AuthService).usuarioActual;

  isMaestroOrAdmin = computed(() => {
    const rol = this.usuarioActual()?.rol;
    return rol === 'Maestro' || rol === 'Admin';
  });

  isAdmin = computed(() => this.usuarioActual()?.rol === 'Admin');
}
