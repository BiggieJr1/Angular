import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../core/data-access/api-config';
import { CursoConMisiones, IntentoUsuario } from './models/curso.model';

// Consumo de cursos desde el punto de vista del Alumno (HU-10).
// GET /api/cursos y GET /api/cursos/{id} no traen el estado de cada misión, así que se
// calcula aparte con el historial de intentos del alumno.
@Injectable({
  providedIn: 'root',
})
export class CursosAlumno {
  private http = inject(HttpClient);

  listar(): Observable<CursoConMisiones[]> {
    return this.http.get<CursoConMisiones[]>(`${API_BASE_URL}/cursos`);
  }

  obtener(cursoId: string): Observable<CursoConMisiones> {
    return this.http.get<CursoConMisiones>(`${API_BASE_URL}/cursos/${cursoId}`);
  }

  // Ids de los retos que el alumno ya aprobó al menos una vez (requiere sesión).
  obtenerRetosResueltos(usuarioId: string): Observable<Set<string>> {
    return this.http
      .get<IntentoUsuario[]>(`${API_BASE_URL}/retos/${usuarioId}/intentos`)
      .pipe(map((intentos) => new Set(intentos.filter((i) => i.aprobado).map((i) => i.retoId))));
  }
}
