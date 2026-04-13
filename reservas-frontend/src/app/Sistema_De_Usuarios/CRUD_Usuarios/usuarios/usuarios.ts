import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {
  api = 'http://localhost:3000/api';

  usuarios: any[] = [];
  mensaje = '';
  mostrarPassword = false;

  usuario = {
    id: 0,
    nombre: '',
    correo: '',
    password: '',
    rol: 'usuario'
  };

  editando = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  cargarUsuarios() {
    this.http.get<any[]>(`${this.api}/usuarios`).subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err?.error?.mensaje || 'Error al cargar usuarios';
      }
    });
  }

  guardarUsuario() {
    if (
      !this.usuario.nombre.trim() ||
      !this.usuario.correo.trim() ||
      (!this.editando && !this.usuario.password.trim())
    ) {
      this.mensaje = 'Completa los campos obligatorios';
      return;
    }

    if (!this.editando) {
      this.http.post<any>(`${this.api}/usuarios`, this.usuario).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje || 'Usuario creado correctamente';
          this.limpiarFormulario();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.log(err);
          this.mensaje = err?.error?.mensaje || 'Error al crear usuario';
        }
      });
    } else {
      this.http.put<any>(`${this.api}/usuarios/${this.usuario.id}`, this.usuario).subscribe({
        next: (res) => {
          this.mensaje = res.mensaje || 'Usuario actualizado correctamente';
          this.limpiarFormulario();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.log(err);
          this.mensaje = err?.error?.mensaje || 'Error al actualizar usuario';
        }
      });
    }
  }

  editarUsuario(u: any) {
    this.usuario = {
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      password: '',
      rol: u.rol
    };
    this.editando = true;
    this.mensaje = '';
    this.mostrarPassword = false;
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) {
      return;
    }

    this.http.delete<any>(`${this.api}/usuarios/${id}`).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Usuario eliminado correctamente';
        this.cargarUsuarios();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err?.error?.mensaje || 'Error al eliminar usuario';
      }
    });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.usuario = {
      id: 0,
      nombre: '',
      correo: '',
      password: '',
      rol: 'usuario'
    };
    this.editando = false;
    this.mostrarPassword = false;
  }


}
