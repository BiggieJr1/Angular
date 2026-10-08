import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RetosAdmin } from './retos-admin.service';
import { MIN_INTENTOS_VEREDICTO, ResumenRetoMaestro, TASA_DIFICIL, TASA_FACIL } from './models/reto-resumen.model';

export type OrdenRetos = 'titulo' | 'tasa-asc' | 'tasa-desc' | 'intentos';

export interface Veredicto {
  texto: string;
  clases: string;
}

@Component({
  selector: 'app-retos',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './retos.html',
})
export class MaestroRetos implements OnInit {
  private retosAdmin = inject(RetosAdmin);

  retos = signal<ResumenRetoMaestro[]>([]);
  cargando = signal(true);
  error = signal(false);
  orden = signal<OrdenRetos>('titulo');

  retosOrdenados = computed(() => {
    const lista = [...this.retos()];
    const sinIntentosAlFinal = (a: ResumenRetoMaestro, b: ResumenRetoMaestro) => Number(a.totalIntentos === 0) - Number(b.totalIntentos === 0);

    switch (this.orden()) {
      case 'tasa-asc': // los más difíciles primero
        return lista.sort((a, b) => sinIntentosAlFinal(a, b) || a.tasaExito - b.tasaExito);
      case 'tasa-desc': // los más fáciles primero
        return lista.sort((a, b) => sinIntentosAlFinal(a, b) || b.tasaExito - a.tasaExito);
      case 'intentos':
        return lista.sort((a, b) => b.totalIntentos - a.totalIntentos);
      default:
        return lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
    }
  });

  ngOnInit(): void {
    this.retosAdmin.misRetos().subscribe({
      next: (retos) => {
        this.retos.set(retos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  cambiarOrden(evento: Event) {
    this.orden.set((evento.target as HTMLSelectElement).value as OrdenRetos);
  }

  // Etiqueta para detectar rápido los retos demasiado difíciles o demasiado fáciles
  veredicto(reto: ResumenRetoMaestro): Veredicto {
    if (reto.totalIntentos === 0) {
      return { texto: 'Sin intentos', clases: 'bg-gray-100 text-gray-600' };
    }
    if (reto.totalIntentos < MIN_INTENTOS_VEREDICTO) {
      return { texto: 'Pocos datos', clases: 'bg-gray-100 text-gray-600' };
    }
    if (reto.tasaExito < TASA_DIFICIL) {
      return { texto: 'Muy difícil', clases: 'bg-red-100 text-red-700' };
    }
    if (reto.tasaExito > TASA_FACIL) {
      return { texto: 'Muy fácil', clases: 'bg-amber-100 text-amber-700' };
    }
    return { texto: 'Equilibrado', clases: 'bg-green-100 text-green-700' };
  }
}
