import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RetosAdmin } from '../../../services/retos-admin';
import { CasoPruebaAdmin, CATEGORIAS_RETO, RetoFormValue } from '../../../models/reto-admin.model';

@Component({
  selector: 'app-reto-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reto-form.html',
  styleUrl: './reto-form.css',
})
export class RetoForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private retosAdmin = inject(RetosAdmin);

  categorias = CATEGORIAS_RETO;

  // Si hay id en la URL, estamos editando ese reto; si no, estamos creando uno nuevo
  retoId: string | null = null;

  form: RetoFormValue = {
    titulo: '',
    descripcion: '',
    dificultad: 1,
    lenguajeRequerido: '',
    categoria: CATEGORIAS_RETO[0],
    codigoBase: '',
    solucionEsperada: '',
  };

  casosPrueba = signal<CasoPruebaAdmin[]>([]);
  nuevoCaso = { entrada: '', salidaEsperada: '', visible: true };

  cargando = signal(false);
  guardando = signal(false);
  errorGeneral = signal('');
  mensajeExito = signal('');

  ngOnInit(): void {
    this.retoId = this.route.snapshot.paramMap.get('id');
    if (!this.retoId) {
      return;
    }

    this.cargando.set(true);
    this.retosAdmin.obtenerCompleto(this.retoId).subscribe({
      next: reto => {
        this.form = {
          titulo: reto.titulo,
          descripcion: reto.descripcion,
          dificultad: reto.dificultad,
          lenguajeRequerido: reto.lenguajeRequerido,
          categoria: reto.categoria,
          codigoBase: reto.codigoBase,
          solucionEsperada: reto.solucionEsperada,
        };
        this.casosPrueba.set(reto.casosPrueba);
        this.cargando.set(false);
      },
      error: () => {
        this.errorGeneral.set('No se pudo cargar el reto.');
        this.cargando.set(false);
      },
    });
  }

  guardar(): void {
    this.errorGeneral.set('');
    this.guardando.set(true);

    const accion$ = this.retoId
      ? this.retosAdmin.actualizar(this.retoId, this.form)
      : this.retosAdmin.crear(this.form);

    accion$.subscribe({
      next: reto => {
        this.guardando.set(false);
        if (this.retoId) {
          this.mensajeExito.set('Cambios guardados.');
        } else {
          // Al crear, pasamos a editar ese mismo reto para poder agregarle casos de prueba
          this.router.navigate(['/maestro/retos', reto.retoId, 'editar']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorGeneral.set(this.mensajeDeError(error));
      },
    });
  }

  agregarCaso(): void {
    if (!this.retoId || !this.nuevoCaso.entrada || !this.nuevoCaso.salidaEsperada) {
      return;
    }

    this.retosAdmin.agregarCasoPrueba(this.retoId, { ...this.nuevoCaso }).subscribe({
      next: caso => {
        this.casosPrueba.update(lista => [...lista, caso]);
        this.nuevoCaso = { entrada: '', salidaEsperada: '', visible: true };
      },
      error: () => {
        this.errorGeneral.set('No se pudo agregar el caso de prueba.');
      },
    });
  }

  private mensajeDeError(error: HttpErrorResponse): string {
    if (error.status === 403) {
      return 'No tienes permiso para hacer esto.';
    }
    if (error.status === 404) {
      return 'El reto ya no existe.';
    }
    return 'Ocurrió un error al guardar. Intenta de nuevo.';
  }
}
