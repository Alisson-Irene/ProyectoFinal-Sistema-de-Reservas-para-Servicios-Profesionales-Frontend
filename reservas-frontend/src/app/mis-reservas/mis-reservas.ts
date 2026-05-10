import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { API_BASE_URL } from '../config/api.config';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css'
})
export class MisReservasComponent implements OnInit {
  api = API_BASE_URL;

  usuarioNombre = 'Usuario';
  usuarioId = 0;
  reservas: any[] = [];
  filtroEstado = 'TODAS';
  cargandoReservas = false;
  mensaje = '';
  reservaParaCancelar: any = null;
  telefonoContacto = '2222-0000';

  estados = ['TODAS', 'ACTIVAS', 'PENDIENTES', 'COMPLETADAS', 'CANCELADAS'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();

    if (!usuario) {
      this.router.navigate(['/']);
      return;
    }

    this.usuarioNombre = usuario.nombre || usuario.correo || 'Usuario';
    this.usuarioId = Number(usuario.id);
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargandoReservas = true;
    this.mensaje = '';

    this.http.get<any[]>(`${this.api}/reservas?usuario_id=${this.usuarioId}&t=${Date.now()}`)
      .pipe(finalize(() => this.cargandoReservas = false))
      .subscribe({
        next: (res) => {
          const reservas = Array.isArray(res) ? res : [];
          this.reservas = reservas.filter(
            reserva => Number(reserva.usuario_id) === Number(this.usuarioId)
          );
        },
        error: (err) => {
          console.error('Error reservas usuario:', err);
          this.mensaje = 'No se pudieron cargar tus reservas';
        }
      });
  }

  seleccionarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  reservasFiltradas(): any[] {
    if (this.filtroEstado === 'TODAS') {
      return this.reservas;
    }

    return this.reservas.filter((reserva) => {
      const estado = String(reserva.estado || '').toUpperCase();

      if (this.filtroEstado === 'ACTIVAS') {
        return estado !== 'CANCELADA' && estado !== 'FINALIZADA';
      }

      if (this.filtroEstado === 'PENDIENTES') {
        return estado === 'PENDIENTE';
      }

      if (this.filtroEstado === 'COMPLETADAS') {
        return estado === 'FINALIZADA' || estado === 'COMPLETADA';
      }

      if (this.filtroEstado === 'CANCELADAS') {
        return estado === 'CANCELADA';
      }

      return true;
    });
  }

  puedeCancelar(reserva: any): boolean {
    const estado = String(reserva.estado || '').toUpperCase();
    return estado !== 'CANCELADA' && estado !== 'FINALIZADA' && estado !== 'COMPLETADA';
  }

  solicitarCancelacion(reserva: any): void {
    if (!this.puedeCancelar(reserva)) {
      return;
    }

    this.reservaParaCancelar = reserva;
    this.mensaje = '';
  }

  cerrarAvisoCancelacion(): void {
    this.reservaParaCancelar = null;
  }

  obtenerTelefonoContacto(reserva: any): string {
    return reserva?.telefono ||
      reserva?.telefono_profesional ||
      reserva?.profesional_telefono ||
      reserva?.telefono_contacto ||
      this.telefonoContacto;
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}
