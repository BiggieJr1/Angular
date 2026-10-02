import { Routes } from '@angular/router';
import { MaestroCursos } from './cursos';
import { CursoForm } from './formulario-curso/formulario-curso';

export const CURSOS_MAESTRO_ROUTES: Routes = [
  {
    path: '',
    component: MaestroCursos,
  },
  {
    path: 'nuevo',
    component: CursoForm,
  },
  {
    path: ':id/editar',
    component: CursoForm,
  },
];
