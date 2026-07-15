import { Service } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//@Service()
export class Auth {
    // Nombres de nuestras "tablas" en el localStorage
  private usuariosKey = 'gamiprog_usuarios';
  private sesionKey = 'gamiprog_sesion_actual';

  // 1. REGISTRAR USUARIO
  registrar(email: string, pass: string): boolean {
    const usuarios = this.obtenerTodosLosUsuarios();
    
    // Verificamos si el correo ya existe
    if (usuarios.find((u: any) => u.email === email)) {
      return false; // Falló el registro (ya existe)
    }

    // Guardamos el nuevo usuario
    usuarios.push({ email, pass, xp: 0, nivel: 1 }); // Le damos stats de jugador
    localStorage.setItem(this.usuariosKey, JSON.stringify(usuarios));
    
    // Iniciamos sesión automáticamente tras registrarse
    this.iniciarSesion(email, pass);
    return true; 
  }

  // 2. INICIAR SESIÓN
  iniciarSesion(email: string, pass: string): boolean {
    const usuarios = this.obtenerTodosLosUsuarios();
    const usuarioValido = usuarios.find((u: any) => u.email === email && u.pass === pass);
    
    if (usuarioValido) {
      // Guardamos la sesión activa
      localStorage.setItem(this.sesionKey, JSON.stringify(usuarioValido));
      return true;
    }
    return false; // Credenciales incorrectas
  }

  // 3. CERRAR SESIÓN
  cerrarSesion() {
    localStorage.removeItem(this.sesionKey);
  }

  // 4. SABER QUIÉN ESTÁ CONECTADO
  obtenerUsuarioActual() {
    const sesion = localStorage.getItem(this.sesionKey);
    return sesion ? JSON.parse(sesion) : null;
  }

  // Utilidad interna para leer el "caché"
  private obtenerTodosLosUsuarios(): any[] {
    const data = localStorage.getItem(this.usuariosKey);
    return data ? JSON.parse(data) : [];
  }
}
