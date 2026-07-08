import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-buttons',
  imports: [],
  templateUrl: './auth-buttons.html',
  styleUrl: './auth-buttons.css',
})
export class AuthButtons {
  // Nuestro interruptor: por defecto el modal está oculto (false)
  isModalOpen = false;

  abrirModal() {
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }
}
