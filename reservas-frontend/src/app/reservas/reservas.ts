import { Component, OnInit } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.http.get<any[]>(`${this.api}/reservas`).subscribe({
      next: (res) => {
        this.reservas = res;
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al cargar reservas';
      }
    });
  }
}
