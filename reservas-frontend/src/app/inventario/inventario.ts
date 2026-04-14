import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class InventarioComponent {
  api = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  mensaje = '';

  servicio = {
    nombre: '',
    descripcion: '',
    precio: null as number | null
  };

  servicios: any[] = [];
  editando = false;
  servicioEditandoId: number | null = null;
  cargandoServicios = false;
  creandoServicio = false;
  mostrarListaCompleta = false;

  ngOnInit(): void {}

  crearServicio(): void {
    if (this.creandoServicio) return;

    this.mensaje = '';

    if (
      !this.servicio.nombre.trim() ||
      !this.servicio.descripcion.trim() ||
      this.servicio.precio === null ||
      this.servicio.precio <= 0
    ) {
      this.mensaje = 'Completa correctamente todos los campos';
      this.cdr.detectChanges();
      return;
    }

    const datosEnviar = {
      nombre: this.servicio.nombre.trim(),
      descripcion: this.servicio.descripcion.trim(),
      precio: this.servicio.precio
    };

    this.creandoServicio = true;
    this.cdr.detectChanges();

    this.http.post<any>(`${this.api}/servicios`, datosEnviar).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio creado correctamente';
        this.mostrarListaCompleta = false;
        this.limpiarServicio();
        this.creandoServicio = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al crear servicio';
        this.creandoServicio = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarServicios(): void {
    if (this.cargandoServicios) return;

    this.mensaje = '';
    this.cargandoServicios = true;
    this.mostrarListaCompleta = false;
    this.servicios = [];
    this.cdr.detectChanges();

    this.http.get<any[]>(`${this.api}/servicios`).subscribe({
      next: (res) => {
        this.servicios = Array.isArray(res) ? res : [];
        this.mostrarListaCompleta = true;
        this.cargandoServicios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al cargar servicios';
        this.cargandoServicios = false;
        this.cdr.detectChanges();
      }
    });
  }

  editarServicio(servicio: any): void {
    this.mensaje = '';
    this.editando = true;
    this.servicioEditandoId = servicio.id;

    this.servicio = {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio
    };

    this.cdr.detectChanges();
  }

  actualizarServicio(): void {
    if (!this.servicioEditandoId) return;

    this.mensaje = '';

    if (
      !this.servicio.nombre.trim() ||
      !this.servicio.descripcion.trim() ||
      this.servicio.precio === null ||
      this.servicio.precio <= 0
    ) {
      this.mensaje = 'Completa correctamente todos los campos';
      this.cdr.detectChanges();
      return;
    }

    const datosActualizar = {
      nombre: this.servicio.nombre.trim(),
      descripcion: this.servicio.descripcion.trim(),
      precio: this.servicio.precio
    };

    this.http.put<any>(`${this.api}/servicios/${this.servicioEditandoId}`, datosActualizar).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio actualizado correctamente';
        this.limpiarServicio();
        this.cargarServicios();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al actualizar servicio';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicionServicio(): void {
    this.limpiarServicio();
    this.mensaje = '';
    this.cdr.detectChanges();
  }

  limpiarServicio(): void {
    this.servicio = {
      nombre: '',
      descripcion: '',
      precio: null
    };

    this.editando = false;
    this.servicioEditandoId = null;
  }

  eliminarServicio(id: number): void {
    this.mensaje = '';

    this.http.delete<any>(`${this.api}/servicios/${id}`).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio eliminado correctamente';
        this.cargarServicios();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al eliminar servicio';
        this.cdr.detectChanges();
      }
    });
  }
}
