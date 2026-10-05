import { Component } from '@angular/core';

@Component({
  selector: 'a[menu-enlace]',
  template: '<ng-content />',
  host: {
    class: 'block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors',
  },
})
export class MenuEnlaceComponent {}
