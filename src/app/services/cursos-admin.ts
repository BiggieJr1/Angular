import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api-config';
import { CursoConMisiones, CursoFormValue } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursosAdmin {
  private http = inject(HttpClient);

  listar(): Observable<CursoConMisiones[]> {
    return this.http.get<CursoConMisiones[]>(`${API_BASE_URL}/cursos`);
  }

  obtener(cursoId: string): Observable<CursoConMisiones> {
    return this.http.get<CursoConMisiones>(`${API_BASE_URL}/cursos/${cursoId}`);
  }

  crear(datos: CursoFormValue): Observable<CursoConMisiones> {
    return this.http.post<CursoConMisiones>(`${API_BASE_URL}/cursos`, datos);
  }

  actualizar(cursoId: string, datos: CursoFormValue): Observable<CursoConMisiones> {
    return this.http.put<CursoConMisiones>(`${API_BASE_URL}/cursos/${cursoId}`, datos);
  }

  agregarMision(cursoId: string, retoId: string): Observable<CursoConMisiones> {
    return this.http.post<CursoConMisiones>(`${API_BASE_URL}/cursos/${cursoId}/misiones`, { retoId });
  }

  quitarMision(cursoId: string, retoId: string): Observable<CursoConMisiones> {
    return this.http.delete<CursoConMisiones>(`${API_BASE_URL}/cursos/${cursoId}/misiones/${retoId}`);
  }

  reordenarMisiones(cursoId: string, retoIds: string[]): Observable<CursoConMisiones> {
    return this.http.put<CursoConMisiones>(`${API_BASE_URL}/cursos/${cursoId}/misiones/orden`, { retoIds });
  }
}
