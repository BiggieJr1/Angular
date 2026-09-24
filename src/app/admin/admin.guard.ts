import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Solo deja pasar a quien tenga sesión con rol Admin; a cualquier otro lo regresa al home.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  if (auth.usuarioActual()?.rol === 'Admin') {
    return true;
  }
  return inject(Router).parseUrl('/');
};
