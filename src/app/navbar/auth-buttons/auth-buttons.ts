import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-auth-buttons',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-buttons.html',
  styleUrl: './auth-buttons.css',
})
export class AuthButtons {
 private authService = inject(Auth);

  // Estado compartido en Auth: así otros componentes (ej. "Inscribirme" en un reto,
  // o el link de Admin en el navbar) también reaccionan al mismo login/logout.
  isModalOpen = this.authService.isModalOpen;
  isLoginMode = this.authService.isLoginMode; // Para saber si mostramos "Entrar" o "Registrar"
  jugadorActual = this.authService.usuarioActual;

  // Variables conectadas al formulario
  emailInput = '';
  passInput = '';
  nombreInput = '';
  mensajeError = signal('');

  abrirModal(esLogin: boolean) {
    this.authService.abrirModal(esLogin);
    this.mensajeError.set('');
    this.emailInput = '';
    this.passInput = '';
    this.nombreInput = '';
  }

  cerrarModal() {
    this.authService.cerrarModal();
  }

  ejecutarAccion() {
    const accion$ = this.isLoginMode()
      ? this.authService.iniciarSesion(this.emailInput, this.passInput)
      : this.authService.registrar(this.emailInput, this.passInput, this.nombreInput);

    accion$.subscribe({
      next: () => this.cerrarModal(),
      error: (error: HttpErrorResponse) => {
        this.mensajeError.set(this.mensajeDeError(error));
      },
    });
  }

  private mensajeDeError(error: HttpErrorResponse): string {
    if (this.isLoginMode()) {
      return 'Correo o contraseña incorrectos.';
    }
    if (error.status === 409) {
      return 'Este correo ya está registrado.';
    }
    if (error.status === 400) {
      return 'Revisa tus datos: la contraseña debe tener al menos 8 caracteres.';
    }
    return 'Ocurrió un error al conectar con el servidor. Intenta de nuevo.';
  }

  alternarModo() {
    this.isLoginMode.set(!this.isLoginMode());
    this.mensajeError.set('');
  }

  cerrarSesionJugador() {
    this.authService.cerrarSesion();
  }
}
