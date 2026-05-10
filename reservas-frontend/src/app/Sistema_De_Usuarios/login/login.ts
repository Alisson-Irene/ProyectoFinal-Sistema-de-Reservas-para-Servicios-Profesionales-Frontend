import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  api = API_BASE_URL;

  correo = '';
  password = '';
  mensaje = '';
  mostrarPassword = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

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

        if (!res.token || !res.usuario) {
          this.mensaje = 'Respuesta de autenticación inválida';
          return;
        }

        this.authService.guardarSesion(res.token, res.usuario);

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
