import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class InventarioComponent implements OnInit {
  api = 'http://localhost:3000/api';

  mensaje = '';

  servicio = {
    nombre: '',
    descripcion: '',
    precio: null as number | null,
    categoria_id: '',
    estado: 'ACTIVO',
    imagen_url: ''
  };

  categorias: any[] = [];
  servicios: any[] = [];

  editando = false;
  servicioEditandoId: number | null = null;
  cargandoServicios = false;
  creandoServicio = false;
  mostrarListaCompleta = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.http.get<any[]>(`${this.api}/categorias`).subscribe({
      next: (res) => {
        this.categorias = res;
        console.log('Categorías cargadas:', res);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

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
      return;
    }

    const datosEnviar = {
      nombre: this.servicio.nombre.trim(),
      descripcion: this.servicio.descripcion.trim(),
      precio: this.servicio.precio,
      categoria_id: this.servicio.categoria_id || null,
      estado: this.servicio.estado,
      imagen_url: this.servicio.imagen_url.trim()
    };

    this.creandoServicio = true;

    this.http.post<any>(`${this.api}/servicios`, datosEnviar).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio creado correctamente';
        this.mostrarListaCompleta = false;
        this.limpiarServicio();
        this.creandoServicio = false;
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al crear servicio';
        this.creandoServicio = false;
      }
    });
  }

  cargarServicios(): void {
    if (this.cargandoServicios) return;

    this.mensaje = '';
    this.cargandoServicios = true;
    this.mostrarListaCompleta = false;
    this.servicios = [];

    this.http.get<any[]>(`${this.api}/servicios`).subscribe({
      next: (res) => {
        this.servicios = Array.isArray(res) ? res : [];
        this.mostrarListaCompleta = true;
        this.cargandoServicios = false;
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al cargar servicios';
        this.cargandoServicios = false;
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
      precio: Number(servicio.precio),
      categoria_id: servicio.categoria_id || '',
      estado: servicio.estado || 'ACTIVO',
      imagen_url: servicio.imagen_url || ''
    };
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
      return;
    }

    const datosActualizar = {
      nombre: this.servicio.nombre.trim(),
      descripcion: this.servicio.descripcion.trim(),
      precio: this.servicio.precio,
      categoria_id: this.servicio.categoria_id || null,
      estado: this.servicio.estado,
      imagen_url: this.servicio.imagen_url.trim()
    };

    this.http.put<any>(`${this.api}/servicios/${this.servicioEditandoId}`, datosActualizar).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio actualizado correctamente';
        this.limpiarServicio();
        this.cargarServicios();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al actualizar servicio';
      }
    });
  }

  cancelarEdicionServicio(): void {
    this.limpiarServicio();
    this.mensaje = '';
  }

  limpiarServicio(): void {
    this.servicio = {
      nombre: '',
      descripcion: '',
      precio: null,
      categoria_id: '',
      estado: 'ACTIVO',
      imagen_url: ''
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
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al eliminar servicio';
      }
    });
  }
}
