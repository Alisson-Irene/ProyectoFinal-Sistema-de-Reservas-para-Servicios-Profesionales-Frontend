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
  reservas: any[] = [];
  formasPago: any[] = [];

  categoriaSeleccionada = '';
  busquedaServicio = '';
  cargando = true;
  mensaje = '';
  mostrarConfirmacionPago = false;
  mensajePago = '';

  pagoSimulado = {
    tarjetaNumero: '',
    tarjetaVencimiento: '',
    tarjetaCvv: '',
    referenciaTransferencia: ''
  };

  reserva = {
    usuario_id: 2,
    servicio_id: '',
    profesional_id: '',
    forma_pago_id: '',
    fecha: '',
    hora: ''
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.cargarCategorias();
    this.cargarServicios();
    this.cargarProfesionales();
    this.cargarFormasPago();
    this.cargarReservas();
  }

  obtenerUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

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

  cargarFormasPago(): void {
    this.http.get<any[]>(`${this.api}/formas-pago/activas`).subscribe({
      next: (res) => this.formasPago = Array.isArray(res) ? res : [],
      error: (err) => {
        console.error('Error formas de pago:', err);
        this.mensaje = 'Error al cargar formas de pago';
      }
    });
  }

  cargarReservas(): void {
    this.http.get<any[]>(`${this.api}/reservas`).subscribe({
      next: (res) => {
        this.reservas = res.filter(
          r => Number(r.usuario_id) === Number(this.reserva.usuario_id)
        );
      },
      error: (err) => {
        console.error('Error reservas:', err);
        this.mensaje = 'Error al cargar reservas';
      }
    });
  }

  seleccionarCategoria(id: any): void {
    this.categoriaSeleccionada = id;
  }

  serviciosFiltrados(): any[] {
    const busqueda = this.busquedaServicio.trim().toLowerCase();

    return this.servicios.filter((servicio) => {
      const coincideCategoria = !this.categoriaSeleccionada ||
        String(servicio.categoria_id) === String(this.categoriaSeleccionada);

      const coincideBusqueda = !busqueda ||
        String(servicio.nombre || '').toLowerCase().includes(busqueda) ||
        String(servicio.descripcion || '').toLowerCase().includes(busqueda) ||
        String(servicio.categoria || '').toLowerCase().includes(busqueda);

      return coincideCategoria && coincideBusqueda;
    });
  }

  seleccionarServicio(servicio: any): void {
    this.reserva.servicio_id = servicio.id;
    this.mensaje = `Servicio seleccionado: ${servicio.nombre}`;
  }

  obtenerImagenServicio(index: number): string {
    const imagenes = [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80'
    ];

    return imagenes[index % imagenes.length];
  }

  obtenerServicioSeleccionado(): any {
    return this.servicios.find(
      servicio => String(servicio.id) === String(this.reserva.servicio_id)
    );
  }

  obtenerProfesionalSeleccionado(): any {
    return this.profesionales.find(
      profesional => String(profesional.id) === String(this.reserva.profesional_id)
    );
  }

  obtenerFormaPagoSeleccionada(): any {
    return this.formasPago.find(
      formaPago => String(formaPago.id) === String(this.reserva.forma_pago_id)
    );
  }

  tipoFormaPago(): string {
    const formaPago = this.obtenerFormaPagoSeleccionada();
    return (formaPago?.nombre || '').toLowerCase();
  }

  abrirConfirmacionPago(): void {
    this.mensaje = '';
    this.mensajePago = '';

    if (
      !this.reserva.usuario_id ||
      !this.reserva.servicio_id ||
      !this.reserva.profesional_id ||
      !this.reserva.forma_pago_id ||
      !this.reserva.fecha ||
      !this.reserva.hora
    ) {
      this.mensaje = 'Completa todos los campos para realizar la reserva';
      return;
    }

    this.mostrarConfirmacionPago = true;
  }

  cerrarConfirmacionPago(): void {
    this.mostrarConfirmacionPago = false;
    this.mensajePago = '';
  }

  confirmarPagoSimulado(): void {
    this.mensajePago = '';

    if (this.tipoFormaPago().includes('tarjeta')) {
      if (
        !this.pagoSimulado.tarjetaNumero.trim() ||
        !this.pagoSimulado.tarjetaVencimiento.trim() ||
        !this.pagoSimulado.tarjetaCvv.trim()
      ) {
        this.mensajePago = 'Completa los datos de tarjeta para simular el pago';
        return;
      }
    }

    if (this.tipoFormaPago().includes('transferencia')) {
      if (!this.pagoSimulado.referenciaTransferencia.trim()) {
        this.mensajePago = 'Ingresa una referencia para simular la transferencia';
        return;
      }
    }

    this.crearReserva();
  }

  crearReserva(): void {
    this.http.post<any>(`${this.api}/reservas`, this.reserva).subscribe({
      next: (res) => {
        this.mensaje = `${res?.message || 'Reserva creada correctamente'} - Pago simulado registrado`;
        this.cargarReservas();
        this.cerrarConfirmacionPago();

        this.reserva.servicio_id = '';
        this.reserva.profesional_id = '';
        this.reserva.forma_pago_id = '';
        this.reserva.fecha = '';
        this.reserva.hora = '';
        this.pagoSimulado = {
          tarjetaNumero: '',
          tarjetaVencimiento: '',
          tarjetaCvv: '',
          referenciaTransferencia: ''
        };
      },
      error: (err) => {
        console.error('Error reserva:', err);
        this.mensaje = err?.error?.message || 'Error al crear reserva';
      }
    });
  }
}
