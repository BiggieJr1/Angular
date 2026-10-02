import { Component, input, output } from '@angular/core';
import { Categoria } from '../models';

@Component({
  selector: 'selector-categorias',
  templateUrl: 'selector-categorias.component.html',
})
export class SelectorCategoriasComponent {
  categorias = input.required<Categoria[]>();

  seleccionada = input<string>('');

  conteos = input<Record<string, number>>({});

  seleccionar = output<string>();
}
