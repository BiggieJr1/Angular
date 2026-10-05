import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthButtons } from './auth-buttons/auth-buttons';
import { AuthService } from '../../data-access/auth.service';
import { MenuHamburguesa } from './menu-hamburguesa/menu-hamburguesa';

@Component({
  selector: 'app-navbar',
  imports: [AuthButtons, RouterLink, MenuHamburguesa],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  host: {
    class: 'transition-transform duration-300',
    '[class.-translate-y-full]': '!visible()',
    '(window:scroll)': 'onScroll()',
  },
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuarioActual = this.authService.usuarioActual;

  private urlActual = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  mostrarBusqueda = computed(() => this.urlActual().split('?')[0] !== '/');

  visible = signal(true);
  private ultimoScroll = 0;

  onScroll() {
    const actual = window.scrollY;

    if (actual <= 64) {
      this.visible.set(true);
    } else if (actual > this.ultimoScroll) {
      this.visible.set(false);
    } else if (actual < this.ultimoScroll) {
      this.visible.set(true);
    }

    this.ultimoScroll = actual;
  }
}