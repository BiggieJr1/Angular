import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { maestroGuard } from './core/guards/maestro.guard';

export const routes: Routes = [
  //Públicas
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'cursos',
    loadChildren: () => import('./pages/cursos/cursos.routes').then((m) => m.CURSOS_ROUTES),
  },
  {
    path: 'curso/:id',
    loadComponent: () =>
      import('./pages/cursos/detalle-curso/detalle-curso').then((m) => m.CursoDetalle),
  },
  {
    path: 'leccion/:id',
    loadComponent: () => import('./pages/cursos/leccion/leccion').then((m) => m.Leccion),
  },

  //Solo Admin
  {
    path: 'admin/usuarios',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/usuarios/usuarios').then((m) => m.AdminUsuarios),
  },

  //Maestro o Admin
  {
    path: 'maestro',
    canActivate: [maestroGuard],
    children: [
      {
        path: 'retos',
        loadChildren: () => import('./pages/retos/retos.routes').then((m) => m.RETOS_ROUTES),
      },
      {
        path: 'cursos',
        loadChildren: () =>
          import('./pages/cursos/cursos-maestro.routes').then((m) => m.CURSOS_MAESTRO_ROUTES),
      },
    ],
  },

  //Comodín
  {
    path: '**',
    redirectTo: '',
  },
];
