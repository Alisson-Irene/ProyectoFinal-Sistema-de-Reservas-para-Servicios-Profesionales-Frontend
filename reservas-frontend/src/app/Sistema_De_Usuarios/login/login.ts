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
  modoRegistro = false;
  cargando = false;

  registro = {
    nombre: '',
    correo: '',
    password: '',
    confirmarPassword: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  cambiarModo() {
    this.modoRegistro = !this.modoRegistro;
    this.mensaje = '';
    this.mostrarPassword = false;
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

    this.cargando = true;
    this.http.post<any>(`${this.api}/auth/login`, body).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensaje = res.mensaje || 'Inicio de sesion correcto';

        if (!res.token || !res.usuario) {
          this.mensaje = 'Respuesta de autenticacion invalida';
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
        this.cargando = false;
        this.mensaje = err?.error?.mensaje || 'Error al iniciar sesion';
      }
    });
  }

  registrarUsuario() {
    const nombre = this.registro.nombre.trim();
    const correo = this.registro.correo.trim();
    const password = this.registro.password.trim();
    const confirmarPassword = this.registro.confirmarPassword.trim();

    if (!nombre || !correo || !password || !confirmarPassword) {
      this.mensaje = 'Completa todos los campos';
      return;
    }

    if (password !== confirmarPassword) {
      this.mensaje = 'Las contrasenas no coinciden';
      return;
    }

    const body = {
      nombre,
      correo,
      password,
      rol: 'usuario'
    };

    this.cargando = true;
    this.http.post<any>(`${this.api}/usuarios`, body).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensaje = res.mensaje || 'Usuario registrado correctamente. Ya puedes iniciar sesion.';
        this.correo = correo;
        this.password = '';
        this.registro = {
          nombre: '',
          correo: '',
          password: '',
          confirmarPassword: ''
        };
        this.modoRegistro = false;
        this.mostrarPassword = false;
      },
      error: (err) => {
        this.cargando = false;
        this.mensaje = err?.error?.mensaje || 'Error al registrar usuario';
      }
    });
  }
}
