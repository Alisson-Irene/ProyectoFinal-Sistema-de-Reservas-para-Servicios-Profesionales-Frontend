import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  usuario = '';
  password = '';
  mensaje = '';

  constructor(private router: Router) {}

  iniciarSesion() {
    if (this.usuario.trim() === '' || this.password.trim() === '') {
      this.mensaje = 'Completa todos los campos';
      return;
    }

    if (this.usuario === 'admin' && this.password === '1234') {
      this.mensaje = 'Inicio de sesión correcto';
      this.router.navigate(['/inventario']);
    } else {
      this.mensaje = 'Usuario o contraseña incorrectos';
    }
  }
}
