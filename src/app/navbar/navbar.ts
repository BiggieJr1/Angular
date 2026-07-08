import { Component } from '@angular/core';
import { AuthButtons } from "./auth-buttons/auth-buttons";

@Component({
  selector: 'app-navbar',
  imports: [AuthButtons],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
