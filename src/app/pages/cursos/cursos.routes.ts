import { Routes } from '@angular/router';
import { CatalogoCursos } from './catalogo-cursos/catalogo-cursos';
import { RutaCurso } from './ruta-curso/ruta-curso';

export const CURSOS_ROUTES: Routes = [
  {
    path: '',
    component: CatalogoCursos,
  },
  {
    path: 'id',
    component: RutaCurso,
  },
];
