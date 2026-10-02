import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthButtons } from "./auth-buttons/auth-buttons";
import { Auth } from '../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [AuthButtons, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  host: {
    class: 'transition-transform duration-300',
    '[class.-translate-y-full]': '!visible()',
    '(window:scroll)': 'onScroll()',
  },
})
export class Navbar {
  private authService = inject(Auth);
  usuarioActual = this.authService.usuarioActual;

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
