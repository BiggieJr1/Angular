import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CursoDetalle } from './curso-detalle/curso-detalle';

export const routes: Routes = [
    // 1. Cuando la URL esté vacía (Inicio), carga el HomeComponent
  { path: '', component: Home }, 
  
  // 2. Ruta dinámica: El ':id' es una variable que cambiará según el curso
  { path: 'curso/:id', component: CursoDetalle }, 
  
  // 3. Comodín de seguridad: Si escriben una URL que no existe, los regresa al inicio
  { path: '**', redirectTo: '' }
];
