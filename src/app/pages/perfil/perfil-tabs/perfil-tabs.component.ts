import { Component, input, signal } from '@angular/core';
import { ProgresoResponse } from '../../../core/models/perfil.model';
import { ResumenProgresoComponent } from '../resumen-progreso/resumen-progreso.component';
import { ListaAmigosComponent } from '../lista-amigos/lista-amigos.component';

type Pestana = 'resumen' | 'amigos';

@Component({
  selector: 'app-perfil-tabs',
  imports: [ResumenProgresoComponent, ListaAmigosComponent],
  templateUrl: './perfil-tabs.component.html',
  host: { class: 'block' },
})
export class PerfilTabsComponent {
  progreso = input.required<ProgresoResponse | null>();

  pestana = signal<Pestana>('resumen');
  amigosVisitado = signal(false);
  totalAmigos = signal<number | null>(null);

  seleccionar(pestana: Pestana) {
    this.pestana.set(pestana);
    if (pestana === 'amigos') this.amigosVisitado.set(true);
  }
}
