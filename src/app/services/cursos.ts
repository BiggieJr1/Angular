import { Injectable } from '@angular/core';
import { Curso, CURSOS } from '..//cursos.mock';

@Injectable({
  providedIn: 'root'
})
export class Cursos {

  obtenerCursos(): Curso[] {
    return CURSOS;
  }
  
  // NUEVO MÉTODO: Busca un curso específico por su ID
  obtenerCursoPorId(id: number): Curso | undefined {
    return CURSOS.find(curso => curso.id === id);
  }
  
}