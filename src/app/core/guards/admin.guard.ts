import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/auth.service';

// Solo deja pasar a quien tenga sesión con rol Admin; a cualquier otro lo regresa al home.
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.usuarioActual()?.rol === 'Admin') {
    return true;
  }
  return inject(Router).parseUrl('/');
};
