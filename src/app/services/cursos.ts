//import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { Curso,CURSOS } from '../cursos.mock';
@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})

export class Cursos {
    obtenerCursos(): Curso[] {
    return CURSOS;
  }
}
