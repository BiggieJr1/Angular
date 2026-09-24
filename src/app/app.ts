import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Navbar } from './navbar/navbar';
//import { Home } from "./home/home";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Angular');

  private router = inject(Router);

  // El banner promocional solo tiene sentido en el home; en páginas internas
  // (detalle de curso, lección, etc.) solo quita espacio al contenido real.
  protected readonly enHome = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map(evento => evento.urlAfterRedirects === '/')
    ),
    { initialValue: this.router.url === '/' }
  );
}
