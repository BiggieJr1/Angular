import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/data-access/auth.service';
import { AmistadService, InvitacionPreview } from '../../core/data-access/amistad.service';

type Estado = 'cargando' | 'valida' | 'invalida' | 'aceptada';

@Component({
  selector: 'app-invitacion',
  imports: [RouterLink],
  templateUrl: './invitacion.html',
})
export class Invitacion implements OnInit {
  private route = inject(ActivatedRoute);
  private amistadService = inject(AmistadService);
  protected auth = inject(AuthService);

  private codigo = this.route.snapshot.paramMap.get('codigo') ?? '';

  estado = signal<Estado>('cargando');
  invitador = signal<InvitacionPreview | null>(null);
  aceptando = signal(false);
  error = signal('');

  inicial = computed(() => (this.invitador()?.nombre ?? '?').charAt(0).toUpperCase());

  esPropia = computed(() => {
    const inv = this.invitador();
    return !!inv && inv.usuarioId === this.auth.usuarioActual()?.usuarioId;
  });

  ngOnInit() {
    this.amistadService.consultarInvitacion(this.codigo).subscribe({
      next: (inv) => {
        this.invitador.set(inv);
        this.estado.set('valida');
      },
      error: () => this.estado.set('invalida'),
    });
  }

  aceptar() {
    this.aceptando.set(true);
    this.error.set('');

    this.amistadService.aceptarInvitacion(this.codigo).subscribe({
      next: () => this.estado.set('aceptada'),
      error: (e: HttpErrorResponse) => {
        this.aceptando.set(false);
        // El backend devuelve el mensaje como texto en 400/404/409
        this.error.set(
          typeof e.error === 'string' && e.error
            ? e.error
            : 'No se pudo aceptar la invitación. Intenta de nuevo.',
        );
      },
    });
  }
}