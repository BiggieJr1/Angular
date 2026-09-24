import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UsuariosAdmin } from '../../services/usuarios-admin';
import { UsuarioAdmin, ROLES_DISPONIBLES } from '../../models/usuario-admin.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css',
})
export class AdminUsuarios implements OnInit {
  private usuariosAdmin = inject(UsuariosAdmin);

  usuarios = signal<UsuarioAdmin[]>([]);
  cargando = signal(true);
  errorGeneral = signal('');
  roles = ROLES_DISPONIBLES;

  // usuarioId al que se le está guardando un cambio, para deshabilitar su selector mientras tanto
  guardandoId = signal<string | null>(null);

  ngOnInit(): void {
    this.usuariosAdmin.listar().subscribe({
      next: usuarios => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: () => {
        this.errorGeneral.set('No se pudo cargar la lista de usuarios.');
        this.cargando.set(false);
      },
    });
  }

  cambiarRol(usuario: UsuarioAdmin, nuevoRol: string) {
    if (nuevoRol === usuario.rol) {
      return;
    }

    this.errorGeneral.set('');
    this.guardandoId.set(usuario.usuarioId);

    this.usuariosAdmin.cambiarRol(usuario.usuarioId, nuevoRol).subscribe({
      next: actualizado => {
        this.usuarios.update(lista =>
          lista.map(u => (u.usuarioId === usuario.usuarioId ? { ...u, rol: actualizado.rol } : u))
        );
        this.guardandoId.set(null);
      },
      error: () => {
        this.errorGeneral.set(`No se pudo actualizar el rol de ${usuario.email}.`);
        this.guardandoId.set(null);
      },
    });
  }
}
