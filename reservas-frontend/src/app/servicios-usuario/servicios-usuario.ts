import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicios-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './servicios-usuario.html',
  styleUrl: './servicios-usuario.css'
})
export class ServiciosUsuarioComponent implements OnInit {

  api = 'http://localhost:3000/api';

  servicios: any[] = [];
  categorias: any[] = [];
  profesionales: any[] = [];

  categoriaSeleccionada = '';
  cargando = true;
  mensaje = '';

  reserva = {
    usuario_id: 2,
    servicio_id: '',
    profesional_id: '',
    fecha: '',
    hora: ''
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.cargarCategorias();
    this.cargarServicios();
    this.cargarProfesionales();
  }

  obtenerUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.reserva.usuario_id = usuario.id;
    }
  }

  cargarCategorias(): void {
    this.http.get<any[]>(`${this.api}/categorias`).subscribe({
      next: (res) => this.categorias = res,
      error: (err) => console.error('Error categorías:', err)
    });
  }

  cargarServicios(): void {
    this.http.get<any[]>(`${this.api}/servicios/activos`).subscribe({
      next: (res) => {
        this.servicios = res;
        this.cargando = false;

        if (res.length === 0) {
          this.mensaje = 'No hay servicios disponibles';
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error servicios:', err);
        this.mensaje = 'Error al cargar servicios';
        this.cargando = false;
      }
    });
  }

  cargarProfesionales(): void {
    this.http.get<any[]>(`${this.api}/profesionales`).subscribe({
      next: (res) => this.profesionales = res,
      error: (err) => console.error('Error profesionales:', err)
    });
  }

  serviciosFiltrados(): any[] {
    if (!this.categoriaSeleccionada) {
      return this.servicios;
    }

    return this.servicios.filter(
      s => String(s.categoria_id) === String(this.categoriaSeleccionada)
    );
  }

  seleccionarServicio(servicio: any): void {
    this.reserva.servicio_id = servicio.id;
    this.mensaje = `Servicio seleccionado: ${servicio.nombre}`;
  }

  crearReserva(): void {
    this.mensaje = '';

    if (
      !this.reserva.usuario_id ||
      !this.reserva.servicio_id ||
      !this.reserva.profesional_id ||
      !this.reserva.fecha ||
      !this.reserva.hora
    ) {
      this.mensaje = 'Completa todos los campos para realizar la reserva';
      return;
    }

    this.http.post<any>(`${this.api}/reservas`, this.reserva).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Reserva creada correctamente';

        this.reserva.servicio_id = '';
        this.reserva.profesional_id = '';
        this.reserva.fecha = '';
        this.reserva.hora = '';
      },
      error: (err) => {
        console.error('Error reserva:', err);
        this.mensaje = err?.error?.message || 'Error al crear reserva';
      }
    });
  }
}
