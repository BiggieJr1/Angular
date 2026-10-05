import { Component, input, output } from '@angular/core';

@Component({
  selector: 'menu-panel',
  templateUrl: './menu-panel.component.html',
  host: { class: 'contents' },
})
export class MenuPanelComponent {
  abierto = input.required<boolean>();
  cerrar = output<void>();
}
