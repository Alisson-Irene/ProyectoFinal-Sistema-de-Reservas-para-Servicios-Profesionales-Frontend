import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  crearServicio() {
    this.http.post(`${this.api}/servicios`, this.servicio).subscribe({
      next: () => {
        this.mensaje = 'Servicio creado';
        this.limpiarServicio();
        this.cargarServicios();
      },
      error: (err: any) => {
        console.log(err);
        this.mensaje = err?.error?.message || 'Error al crear servicio';
      }
    });
  }

  cargarServicios() {
    this.http.get<any[]>(`${this.api}/servicios`).subscribe({
      next: (res: any[]) => {
        this.servicios = res;
      },
      error: (err: any) => {
        console.log(err);
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

    this.http.put(`${this.api}/servicios/${this.servicioEditandoId}`, this.servicio).subscribe({
      next: () => {
        this.mensaje = 'Servicio actualizado';
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
    this.servicio = { nombre: '', descripcion: '', precio: 0 };
    this.editando = false;
    this.servicioEditandoId = null;
  }

  eliminarServicio(id: number) {
    this.http.delete(`${this.api}/servicios/${id}`).subscribe({
      next: () => {
        this.mensaje = 'Servicio eliminado';
        this.cargarServicios();
      },
      error: (err: any) => {
        console.log(err);
        this.mensaje = err?.error?.message || 'Error al eliminar servicio';
      }
    });
  }

  ngOnInit() {
    this.cargarServicios();
  }
}
