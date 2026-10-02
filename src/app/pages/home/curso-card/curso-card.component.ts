import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Curso } from '../../retos';

@Component({
  selector: 'curso-card',
  imports: [RouterLink],
  templateUrl: 'curso-card.component.html',
  host: { class: 'block h-full' },
})
export class CursoCardComponent {
  curso = input.required<Curso>();
}
