import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  api = 'http://localhost:3000/api';

  usuario = {
    nombre: '',
    correo: '',
    password: '',
    rol: 'usuario'
  };

  mensaje = '';

  constructor(private http: HttpClient, private router: Router) {}

  registrarUsuario() {
    if (
      this.usuario.nombre.trim() === '' ||
      this.usuario.correo.trim() === '' ||
      this.usuario.password.trim() === ''
    ) {
      this.mensaje = 'Completa todos los campos';
      return;
    }

    this.http.post<any>(`${this.api}/usuarios`, this.usuario).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Usuario registrado correctamente';
        this.router.navigateByUrl('/');
      },
      error: (err) => {
         console.log('ERROR COMPLETO:', err);
         console.log('ERROR DEL BACKEND:', err?.error);
         this.mensaje = err?.error?.mensaje || 'Error al registrar usuario';
        }
    });
  }
}