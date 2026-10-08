import { Routes } from '@angular/router';
import { MaestroRetos } from './retos';
import { RetoForm } from './formulario-retos/formulario-retos';
import { ResultadosReto } from './resultados-reto/resultados-reto';

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
  {
    path: ':id/resultados',
    component: ResultadosReto,
  },
];
