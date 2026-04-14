import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  api = 'http://localhost:3000/api';

  correo = '';
  password = '';
  mensaje = '';
  mostrarPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {
    if (!this.correo.trim() || !this.password.trim()) {
      this.mensaje = 'Completa todos los campos';
      return;
    }

    const body = {
      correo: this.correo.trim(),
      password: this.password.trim()
    };

    this.http.post<any>(`${this.api}/auth/login`, body).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Inicio de sesión correcto';

        localStorage.setItem('usuarioLogueado', JSON.stringify(res.usuario));

        if (res.usuario.rol === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/panel-usuario']);
        }
      },
      error: (err) => {
        this.mensaje = err?.error?.mensaje || 'Error al iniciar sesión';
      }
    });
  }
}
