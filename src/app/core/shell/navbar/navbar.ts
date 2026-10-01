import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthButtons } from './auth-buttons/auth-buttons';
import { AuthService } from '../../data-access/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [AuthButtons, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  usuarioActual = this.authService.usuarioActual;
}
