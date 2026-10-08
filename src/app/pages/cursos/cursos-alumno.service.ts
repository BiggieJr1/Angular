import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../core/data-access/api-config';
import { CursoConMisiones, IntentoUsuario } from './models/curso.model';
import { Curso } from '../retos/models/reto.model';
import { ESTILOS_POR_CATEGORIA, ESTILO_DEFAULT } from './cursos.service';

function aTarjeta(curso: CursoConMisiones): Curso {
  const estilo = ESTILOS_POR_CATEGORIA[curso.categoria] ?? ESTILO_DEFAULT;
  const n = curso.misiones.length;
  return {
    id: curso.cursoId,
    titulo: curso.titulo,
    descripcion: curso.descripcion,
    categoria: curso.categoria,
    duracion: `${n} ${n === 1 ? 'misión' : 'misiones'}`,
    gradienteBg: estilo.gradienteBg,
    badgeColor: estilo.badgeColor,
    imagenUrl: curso.imagenUrl ?? estilo.imagenUrl,
    tipo: 'curso',
  };
}

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

  listarTarjetas(): Observable<Curso[]> {
    return this.listar().pipe(map((cursos) => cursos.map(aTarjeta)));
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
