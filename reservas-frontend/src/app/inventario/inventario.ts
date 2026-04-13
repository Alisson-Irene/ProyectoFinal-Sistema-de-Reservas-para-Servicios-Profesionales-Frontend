import { Component } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  mensaje = '';

  servicio = {
    nombre: '',
    descripcion: '',
    precio: 0
  };

  servicios: any[] = [];
  editando = false;
  servicioEditandoId: number | null = null;
  cargandoServicios = false;
  creandoServicio = false;

  // OJO: no cargar automáticamente aquí
  ngOnInit() {}

  crearServicio() {
    if (this.creandoServicio) return;

    if (
      !this.servicio.nombre.trim() ||
      !this.servicio.descripcion.trim() ||
      this.servicio.precio <= 0
    ) {
      this.mensaje = 'Completa correctamente todos los campos';
      return;
    }

    this.creandoServicio = true;

    this.http.post<any>(`${this.api}/servicios`, this.servicio).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio creado';
        this.limpiarServicio();
        this.creandoServicio = false;
      },
      error: (err: any) => {
        console.log(err);
        this.mensaje = err?.error?.message || 'Error al crear servicio';
        this.creandoServicio = false;
      }
    });
  }

  cargarServicios() {
    if (this.cargandoServicios) return;

    this.cargandoServicios = true;

    this.http.get<any[]>(`${this.api}/servicios`).subscribe({
      next: (res: any[]) => {
        this.servicios = res;
        this.cargandoServicios = false;
      },
      error: (err: any) => {
        console.log(err);
        this.mensaje = err?.error?.message || 'Error al cargar servicios';
        this.cargandoServicios = false;
      }
    });
  }

  editarServicio(servicio: any) {
    this.editando = true;
    this.servicioEditandoId = servicio.id;
    this.servicio = {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio
    };
  }

  actualizarServicio() {
    if (!this.servicioEditandoId) return;

    this.http.put<any>(`${this.api}/servicios/${this.servicioEditandoId}`, this.servicio).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio actualizado';
        this.limpiarServicio();
        this.cargarServicios();
      },
      error: (err: any) => {
        console.log(err);
        this.mensaje = err?.error?.message || 'Error al actualizar servicio';
      }
    });
  }

  cancelarEdicionServicio() {
    this.limpiarServicio();
  }

  limpiarServicio() {
    this.servicio = {
      nombre: '',
      descripcion: '',
      precio: 0
    };
    this.editando = false;
    this.servicioEditandoId = null;
  }

  eliminarServicio(id: number) {
    this.http.delete<any>(`${this.api}/servicios/${id}`).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio eliminado';
        this.cargarServicios();
      },
      error: (err: any) => {
        console.log(err);
        this.mensaje = err?.error?.message || 'Error al eliminar servicio';
      }
    });
  }
}
