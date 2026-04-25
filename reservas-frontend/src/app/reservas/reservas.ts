import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class ReservasComponent implements OnInit {
  api = 'http://localhost:3000/api';

  reservas: any[] = [];
  mensaje = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarReservas();

    setInterval(() => {
      this.cargarReservas();
    }, 5000);
  }

  cargarReservas(): void {
    this.http.get<any[]>(`${this.api}/reservas`).subscribe({
      next: (res) => {
        console.log('RESERVAS RECIBIDAS EN ADMIN:', res);

        this.reservas = res || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERROR ADMIN RESERVAS:', err);
        this.mensaje = 'Error al cargar reservas';
      }
    });
  }

  actualizarEstado(reserva: any): void {
    this.http.put<any>(`${this.api}/reservas/${reserva.id}/estado`, {
      estado: reserva.estado
    }).subscribe({
      next: (res) => {
        this.mensaje = res.message || 'Reserva actualizada correctamente';
        this.cargarReservas();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al actualizar reserva';
      }
    });
  }
}
