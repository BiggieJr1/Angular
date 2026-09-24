import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Deja pasar a Maestro o Admin; a un Estudiante (o sin sesión) lo regresa al home.
export const maestroGuard: CanActivateFn = () => {
  const rol = inject(Auth).usuarioActual()?.rol;
  if (rol === 'Maestro' || rol === 'Admin') {
    return true;
  }
  return inject(Router).parseUrl('/');
};
