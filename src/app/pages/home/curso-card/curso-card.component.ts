import { Component, input, output } from '@angular/core';
import { Curso } from '../../retos';

@Component({
  selector: 'curso-card',
  templateUrl: 'curso-card.component.html',
  host: { class: 'block h-full' },
})
export class CursoCardComponent {
  curso = input.required<Curso>();
  verDetalles = output<void>(); 
}