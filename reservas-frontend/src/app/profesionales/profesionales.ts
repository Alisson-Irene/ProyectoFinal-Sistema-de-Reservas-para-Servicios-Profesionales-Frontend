import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profesionales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profesionales.html',
  styleUrl: './profesionales.css'
})
export class ProfesionalesComponent implements OnInit {
  api = 'http://localhost:3000/api';

  profesionales: any[] = [];
  mensaje = '';
  cargando = false;
  editando = false;
  profesionalEditandoId: number | null = null;

  profesional = {
    nombre: '',
    especialidad: '',
    telefono: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    this.cargando = true;

    this.http.get<any[]>(`${this.api}/profesionales`).subscribe({
      next: (res) => {
        this.profesionales = Array.isArray(res) ? res : [];
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al cargar profesionales';
        this.cargando = false;
      }
    });
  }

  guardarProfesional(): void {
    this.mensaje = '';

    if (!this.profesional.nombre.trim()) {
      this.mensaje = 'Ingresa el nombre del profesional';
      return;
    }

    const datos = {
      nombre: this.profesional.nombre.trim(),
      especialidad: this.profesional.especialidad.trim(),
      telefono: this.profesional.telefono.trim()
    };

    if (!this.editando) {
      this.http.post<any>(`${this.api}/profesionales`, datos).subscribe({
        next: (res) => {
          this.mensaje = res?.message || 'Profesional creado correctamente';
          this.limpiarFormulario();
          this.cargarProfesionales();
        },
        error: (err) => {
          console.error(err);
          this.mensaje = err?.error?.message || 'Error al crear profesional';
        }
      });

      return;
    }

    this.http.put<any>(`${this.api}/profesionales/${this.profesionalEditandoId}`, datos).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Profesional actualizado correctamente';
        this.limpiarFormulario();
        this.cargarProfesionales();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al actualizar profesional';
      }
    });
  }

  editarProfesional(profesional: any): void {
    this.editando = true;
    this.profesionalEditandoId = profesional.id;
    this.profesional = {
      nombre: profesional.nombre || '',
      especialidad: profesional.especialidad || '',
      telefono: profesional.telefono || ''
    };
    this.mensaje = '';
  }

  eliminarProfesional(id: number): void {
    if (!confirm('Seguro que deseas eliminar este profesional?')) {
      return;
    }

    this.http.delete<any>(`${this.api}/profesionales/${id}`).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Profesional eliminado correctamente';
        this.cargarProfesionales();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al eliminar profesional';
      }
    });
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
    this.mensaje = '';
  }

  limpiarFormulario(): void {
    this.profesional = {
      nombre: '',
      especialidad: '',
      telefono: ''
    };
    this.editando = false;
    this.profesionalEditandoId = null;
  }
}
