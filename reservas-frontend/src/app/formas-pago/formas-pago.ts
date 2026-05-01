import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-formas-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formas-pago.html',
  styleUrl: './formas-pago.css'
})
export class FormasPagoComponent implements OnInit {
  api = 'http://localhost:3000/api';

  formasPago: any[] = [];
  mensaje = '';
  cargando = false;
  guardando = false;
  editando = false;
  formaPagoEditandoId: number | null = null;

  formaPago = {
    nombre: '',
    descripcion: '',
    estado: 'ACTIVO'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarFormasPago();
  }

  cargarFormasPago(): void {
    if (this.cargando) return;

    this.mensaje = '';
    this.cargando = true;

    this.http.get<any[]>(`${this.api}/formas-pago`).subscribe({
      next: (res) => {
        this.formasPago = Array.isArray(res) ? res : [];
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al cargar formas de pago';
        this.cargando = false;
      }
    });
  }

  guardarFormaPago(): void {
    if (this.guardando) return;

    this.mensaje = '';

    if (!this.formaPago.nombre.trim()) {
      this.mensaje = 'Ingresa el nombre de la forma de pago';
      return;
    }

    const datosEnviar = {
      nombre: this.formaPago.nombre.trim(),
      descripcion: this.formaPago.descripcion.trim(),
      estado: this.formaPago.estado
    };

    this.guardando = true;

    if (!this.editando) {
      this.http.post<any>(`${this.api}/formas-pago`, datosEnviar).subscribe({
        next: (res) => {
          this.mensaje = res?.message || 'Forma de pago creada correctamente';
          this.limpiarFormulario();
          this.cargarFormasPago();
          this.guardando = false;
        },
        error: (err) => {
          console.error(err);
          this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al crear forma de pago';
          this.guardando = false;
        }
      });

      return;
    }

    this.http.put<any>(`${this.api}/formas-pago/${this.formaPagoEditandoId}`, datosEnviar).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Forma de pago actualizada correctamente';
        this.limpiarFormulario();
        this.cargarFormasPago();
        this.guardando = false;
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al actualizar forma de pago';
        this.guardando = false;
      }
    });
  }

  editarFormaPago(formaPago: any): void {
    this.mensaje = '';
    this.editando = true;
    this.formaPagoEditandoId = formaPago.id;
    this.formaPago = {
      nombre: formaPago.nombre || '',
      descripcion: formaPago.descripcion || '',
      estado: formaPago.estado || 'ACTIVO'
    };
  }

  eliminarFormaPago(id: number): void {
    if (!confirm('Seguro que deseas eliminar esta forma de pago?')) {
      return;
    }

    this.mensaje = '';

    this.http.delete<any>(`${this.api}/formas-pago/${id}`).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Forma de pago eliminada correctamente';
        this.cargarFormasPago();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al eliminar forma de pago';
      }
    });
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
    this.mensaje = '';
  }

  limpiarFormulario(): void {
    this.formaPago = {
      nombre: '',
      descripcion: '',
      estado: 'ACTIVO'
    };
    this.editando = false;
    this.formaPagoEditandoId = null;
  }
}
