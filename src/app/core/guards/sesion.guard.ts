import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/auth.service';

// Deja pasar a cualquier usuario con sesión iniciada. Si no hay sesión, lo regresa al home
// y abre el modal de inicio de sesión para que pueda entrar sin pasos extra.
export const sesionGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.usuarioActual()) {
    return true;
  }
  authService.abrirModal(true);
  return inject(Router).parseUrl('/');
};
