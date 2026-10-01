import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leccion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './leccion.html',
  styleUrl: './leccion.css',
})
export class Leccion {}
