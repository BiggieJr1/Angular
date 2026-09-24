import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CursoDetalle } from './curso-detalle/curso-detalle';
import { Leccion } from './leccion/leccion';
import { AdminUsuarios } from './admin/usuarios/admin-usuarios';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
    // 1. Cuando la URL esté vacía (Inicio), carga el HomeComponent
  { path: '', component: Home },

  // 2. Ruta dinámica: El ':id' es una variable que cambiará según el curso
  { path: 'curso/:id', component: CursoDetalle },

  { path: 'leccion/:id', component: Leccion },

  // Solo Admin puede entrar; cualquier otro rebota al home (ver admin.guard.ts)
  { path: 'admin/usuarios', component: AdminUsuarios, canActivate: [adminGuard] },

  // 3. Comodín de seguridad: Si escriben una URL que no existe, los regresa al inicio
  { path: '**', redirectTo: '' }
];
