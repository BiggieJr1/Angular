import { Component, input } from '@angular/core';

@Component({
  selector: 'empty-state',
  templateUrl: 'empty-state.component.html',
  host: { class: 'block' },
})
export class EmptyStateComponent {
  mensaje = input.required<string>();
}
