import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

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
  mensajeError = '';

  // Aquí guardaremos los datos del jugador si tiene sesión activa
  jugadorActual: any = null;

  ngOnInit() {
    // Al cargar la página, revisamos si ya había alguien logueado en el caché
    this.jugadorActual = this.authService.obtenerUsuarioActual();
  }

  abrirModal(esLogin: boolean) {
    this.isLoginMode = esLogin;
    this.isModalOpen = true;
    this.mensajeError = '';
    this.emailInput = '';
    this.passInput = '';
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  ejecutarAccion() {
    if (this.isLoginMode) {
      // Intento de Login
      const exito = this.authService.iniciarSesion(this.emailInput, this.passInput);
      if (exito) {
        this.jugadorActual = this.authService.obtenerUsuarioActual();
        this.cerrarModal();
      } else {
        this.mensajeError = 'Correo o contraseña incorrectos.';
      }
    } else {
      // Intento de Registro
      const exito = this.authService.registrar(this.emailInput, this.passInput);
      if (exito) {
        this.jugadorActual = this.authService.obtenerUsuarioActual();
        this.cerrarModal();
      } else {
        this.mensajeError = 'Este correo ya está registrado.';
      }
    }
  }

  cerrarSesionJugador() {
    this.authService.cerrarSesion();
    this.jugadorActual = null;
  }
}
