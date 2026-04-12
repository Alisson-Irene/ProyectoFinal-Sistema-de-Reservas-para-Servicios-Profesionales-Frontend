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

  constructor(private http: HttpClient, private router: Router) {}

  iniciarSesion() {
    if (this.correo.trim() === '' || this.password.trim() === '') {
      this.mensaje = 'Completa todos los campos';
      return;
    }

    const body = {
      correo: this.correo,
      password: this.password
    };

    this.http.post<any>(`${this.api}/auth/login`, body).subscribe({
      next: () => {
        this.mensaje = 'Inicio de sesión correcto';
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err?.error?.mensaje || 'Error al iniciar sesión';
      }
    });
  }
}