import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './password.html',
  styleUrl: './password.css'
})
export class CambiarPasswordComponent {

  api = 'http://localhost:3000/api';

  datos = {
    correo: '',
    actual: '',
    nueva: '',
    confirmar: ''
  };

  mensaje = '';
  tipoMensaje = '';
  cargando = false;

  mostrarActual = false;
  mostrarNueva = false;
  mostrarConfirmar = false;

  constructor(private http: HttpClient, private router: Router) {}

  toggleActual() {
    this.mostrarActual = !this.mostrarActual;
  }

  toggleNueva() {
    this.mostrarNueva = !this.mostrarNueva;
  }

  toggleConfirmar() {
    this.mostrarConfirmar = !this.mostrarConfirmar;
  }

  cambiarPassword() {
    if (this.cargando) return;

    this.mensaje = '';
    this.tipoMensaje = '';

    if (
      !this.datos.correo.trim() ||
      !this.datos.actual.trim() ||
      !this.datos.nueva.trim() ||
      !this.datos.confirmar.trim()
    ) {
      this.mensaje = 'Completa todos los campos';
      this.tipoMensaje = 'error';
      return;
    }

    if (this.datos.nueva !== this.datos.confirmar) {
      this.mensaje = 'Las contraseñas no coinciden';
      this.tipoMensaje = 'error';
      return;
    }

    this.cargando = true;

    this.http.put<any>(`${this.api}/usuarios/cambiar-password`, this.datos)
      .subscribe({
        next: (res) => {
          this.mensaje = res?.mensaje || 'Contraseña actualizada correctamente';
          this.tipoMensaje = 'success';
          this.limpiar();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1200);
        },
        error: (err) => {
          console.log(err);
          this.mensaje = err?.error?.mensaje || 'Error al cambiar contraseña';
          this.tipoMensaje = 'error';
          this.cargando = false;
        }
      });
  }

  limpiar() {
    this.datos = {
      correo: '',
      actual: '',
      nueva: '',
      confirmar: ''
    };
  }
}
