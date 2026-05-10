import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { API_BASE_URL } from '../config/api.config';

@Component({
  selector: 'app-profesionales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profesionales.html',
  styleUrl: './profesionales.css'
})
export class ProfesionalesComponent implements OnInit {
  api = API_BASE_URL;

  profesionales: any[] = [];
  categorias: any[] = [];
  categoriasBase = [
    { id: 'soporte-tecnico', nombre: 'Soporte técnico' },
    { id: 'mantenimiento', nombre: 'Mantenimiento' },
    { id: 'diseno-desarrollo', nombre: 'Diseño y desarrollo' },
    { id: 'capacitacion', nombre: 'Capacitación' }
  ];
  mensaje = '';
  cargando = false;
  editando = false;
  profesionalEditandoId: number | null = null;

  profesional = {
    nombre: '',
    especialidad: '',
    telefono: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProfesionales();
  }

  cargarCategorias(): void {
    this.http.get<any[]>(`${this.api}/categorias`).subscribe({
      next: (res) => {
        this.categorias = Array.isArray(res) && res.length > 0 ? res : this.categoriasBase;
      },
      error: (err) => {
        console.error('Error categorias profesionales:', err);
        this.categorias = this.categoriasBase;
      }
    });
  }

  cargarProfesionales(): void {
    this.cargando = true;

    this.http.get<any>(`${this.api}/profesionales`).subscribe({
      next: (res) => {
        this.profesionales = this.obtenerListaProfesionales(res);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al cargar profesionales';
        this.cargando = false;
      }
    });
  }

  private obtenerListaProfesionales(respuesta: any): any[] {
    if (Array.isArray(respuesta)) {
      return respuesta;
    }

    if (Array.isArray(respuesta?.profesionales)) {
      return respuesta.profesionales;
    }

    if (Array.isArray(respuesta?.data)) {
      return respuesta.data;
    }

    return [];
  }

  guardarProfesional(): void {
    this.mensaje = '';

    if (!this.profesional.nombre.trim()) {
      this.mensaje = 'Ingresa el nombre del profesional';
      return;
    }

    if (!this.profesional.especialidad.trim()) {
      this.mensaje = 'Selecciona la categoría o tipo de servicio del profesional';
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
