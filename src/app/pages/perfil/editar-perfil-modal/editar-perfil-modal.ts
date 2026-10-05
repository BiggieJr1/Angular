import { Component, DestroyRef, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../../core/data-access/perfil.service';
import { PerfilResponse } from '../../../core/models/perfil.model';

@Component({
  selector: 'app-editar-perfil-modal',
  imports: [FormsModule],
  templateUrl: './editar-perfil-modal.html',
  host: { '(document:keydown.escape)': 'cerrar.emit()' },
})
export class EditarPerfilModal implements OnInit {
  private perfilService = inject(PerfilService);

  perfil = input.required<PerfilResponse>();
  cerrar = output<void>();
  guardado = output<PerfilResponse>();

  readonly maxBiografia = 200;

  nombre = signal('');
  avatarUrl = signal('');
  biografia = signal('');
  avatarRoto = signal(false);
  guardando = signal(false);
  error = signal('');

  constructor() {
    // El modal bloquea el scroll de la página mientras existe
    document.body.classList.add('overflow-hidden');
    inject(DestroyRef).onDestroy(() => document.body.classList.remove('overflow-hidden'));
  }

  ngOnInit() {
    const p = this.perfil();
    this.nombre.set(p.nombre);
    this.avatarUrl.set(p.avatarUrl ?? '');
    this.biografia.set(p.biografia ?? '');
  }

  inicial = computed(() => (this.nombre().trim() || '?').charAt(0).toUpperCase());

  mostrarImagen = computed(() => !!this.avatarUrl().trim() && !this.avatarRoto() && this.urlValida());

  urlValida = computed(() => {
    const url = this.avatarUrl().trim();
    return !url || /^https?:\/\//i.test(url);
  });

  hayCambios = computed(() => {
    const p = this.perfil();
    return (
      this.nombre().trim() !== p.nombre ||
      this.avatarUrl().trim() !== (p.avatarUrl ?? '') ||
      this.biografia().trim() !== (p.biografia ?? '')
    );
  });

  puedeGuardar = computed(
    () => this.nombre().trim().length > 0 && this.urlValida() && this.hayCambios() && !this.guardando(),
  );

  alCambiarAvatar(valor: string) {
    this.avatarUrl.set(valor);
    this.avatarRoto.set(false);
  }

  guardar() {
    if (!this.puedeGuardar()) return;

    const datos = {
      nombre: this.nombre().trim(),
      avatarUrl: this.avatarUrl().trim() || null,
      biografia: this.biografia().trim() || null,
    };

    this.guardando.set(true);
    this.error.set('');

    this.perfilService.actualizarPerfil(this.perfil().usuarioId, datos).subscribe({
      next: () => this.guardado.emit({ ...this.perfil(), ...datos }),
      error: () => {
        this.error.set('No se pudo guardar el perfil. Intenta de nuevo.');
        this.guardando.set(false);
      },
    });
  }
}