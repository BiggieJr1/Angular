import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CursoDetalle } from './pages/cursos/detalle-curso/detalle-curso';
import { Leccion } from './pages/cursos/leccion/leccion';
import { AdminUsuarios } from './pages/usuarios/usuarios';
import { adminGuard } from './core/guards/admin.guard';
import { MaestroRetos } from './pages/retos/retos';
import { RetoForm } from './pages/retos/formulario-retos/formulario-retos';
import { MaestroCursos } from './pages/cursos/cursos';
import { CursoForm } from './pages/cursos/formulario-curso/formulario-curso';
import { maestroGuard } from './core/guards/maestro.guard';

export const routes: Routes = [
  // 1. Cuando la URL esté vacía (Inicio), carga el HomeComponent
  { path: '', component: Home },

  // 2. Ruta dinámica: El ':id' es una variable que cambiará según el curso
  { path: 'curso/:id', component: CursoDetalle },

  { path: 'leccion/:id', component: Leccion },

  // Solo Admin puede entrar; cualquier otro rebota al home (ver admin.guard.ts)
  { path: 'admin/usuarios', component: AdminUsuarios, canActivate: [adminGuard] },

  // Solo Maestro o Admin pueden entrar (ver maestro.guard.ts)
  { path: 'maestro/retos', component: MaestroRetos, canActivate: [maestroGuard] },
  { path: 'maestro/retos/nuevo', component: RetoForm, canActivate: [maestroGuard] },
  { path: 'maestro/retos/:id/editar', component: RetoForm, canActivate: [maestroGuard] },
  { path: 'maestro/cursos', component: MaestroCursos, canActivate: [maestroGuard] },
  { path: 'maestro/cursos/nuevo', component: CursoForm, canActivate: [maestroGuard] },
  { path: 'maestro/cursos/:id/editar', component: CursoForm, canActivate: [maestroGuard] },

  // 3. Comodín de seguridad: Si escriben una URL que no existe, los regresa al inicio
  { path: '**', redirectTo: '' },
];
