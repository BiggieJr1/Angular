import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { Usuario } from '../../models/auth.model';

@Component({
  selector: 'app-auth-buttons',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-buttons.html',
  styleUrl: './auth-buttons.css',
})
export class AuthButtons implements OnInit {
 private authService = inject(Auth);

  isModalOpen = false;
  isLoginMode = true; // Para saber si mostramos "Entrar" o "Registrar"

  // Variables conectadas al formulario
  emailInput = '';
  passInput = '';
  nombreInput = '';
  mensajeError = '';

  // Aquí guardaremos los datos del jugador si tiene sesión activa
  jugadorActual: Usuario | null = null;

  ngOnInit() {
    // Al cargar la página, revisamos si ya había alguien logueado (sesión con JWT guardada)
    this.jugadorActual = this.authService.obtenerUsuarioActual();
  }

  abrirModal(esLogin: boolean) {
    this.isLoginMode = esLogin;
    this.isModalOpen = true;
    this.mensajeError = '';
    this.emailInput = '';
    this.passInput = '';
    this.nombreInput = '';
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  ejecutarAccion() {
    const accion$ = this.isLoginMode
      ? this.authService.iniciarSesion(this.emailInput, this.passInput)
      : this.authService.registrar(this.emailInput, this.passInput, this.nombreInput);

    accion$.subscribe({
      next: usuario => {
        this.jugadorActual = usuario;
        this.cerrarModal();
      },
      error: (error: HttpErrorResponse) => {
        this.mensajeError = this.mensajeDeError(error);
      },
    });
  }

  private mensajeDeError(error: HttpErrorResponse): string {
    if (this.isLoginMode) {
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

  cerrarSesionJugador() {
    this.authService.cerrarSesion();
    this.jugadorActual = null;
  }
}
