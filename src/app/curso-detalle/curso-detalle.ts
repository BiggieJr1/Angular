import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Cursos } from '../services/cursos';
import { Curso } from '../cursos.mock';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-curso-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './curso-detalle.html',
  styleUrl: './curso-detalle.css',
})
export class CursoDetalle implements OnInit {
  // Inyectamos las herramientas necesarias
  private route = inject(ActivatedRoute);
  private cursoService = inject(Cursos);

  // Variable para guardar el curso encontrado
  curso: Curso | undefined;

  mostrarToast = false;

  ngOnInit(): void {
    // 1. Extraemos el 'id' de la URL (ej: /curso/2 -> extrae el 2)
    // Usamos Number() para convertir el texto de la URL a un número matemático
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    
    // 2. Buscamos el curso utilizando el servicio
    this.curso = this.cursoService.obtenerCursoPorId(idParam);
  }

  inscribirse() {
    this.mostrarToast = true;
    
    // 3. El setTimeout oculta el Toast automáticamente después de 3.5 segundos
    setTimeout(() => {
      this.mostrarToast = false;
    }, 3500);
  }
}
