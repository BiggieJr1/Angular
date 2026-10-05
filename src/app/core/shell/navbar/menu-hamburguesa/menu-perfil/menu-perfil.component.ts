import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'menu-perfil',
  templateUrl: './menu-perfil.component.html',
  host: { class: 'block' },
})
export class MenuPerfilComponent {
  nombre = input.required<string>();
  rol = input.required<string>();

  iniciales = computed(() => {
    const palabras = this.nombre()
      .split(/[\s._-]+/)
      .filter(Boolean);

    if (palabras.length === 0) return '?';

    const primera = palabras[0][0];
    const segunda = palabras.length > 1 ? palabras[1][0] : '';
    return (primera + segunda).toUpperCase();
  });
}
