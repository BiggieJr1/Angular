import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgresoResponse } from '../../../core/models/perfil.model';

@Component({
  selector: 'app-resumen-progreso',
  imports: [RouterLink],
  templateUrl: './resumen-progreso.component.html',
  host: { class: 'block' },
})
export class ResumenProgresoComponent {
  progreso = input.required<ProgresoResponse | null>();

  tasaAprobacion = computed(() => {
    const p = this.progreso();
    return p && p.totalIntentos > 0 ? Math.round((p.totalAprobados / p.totalIntentos) * 100) : 0;
  });
}
