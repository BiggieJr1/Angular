import { Routes } from '@angular/router';
import { MaestroRetos } from './retos';
import { RetoForm } from './formulario-retos/formulario-retos';

export const RETOS_ROUTES: Routes = [
  {
    path: '',
    component: MaestroRetos,
  },
  {
    path: 'nuevo',
    component: RetoForm,
  },
  {
    path: ':id/editar',
    component: RetoForm,
  },
];
