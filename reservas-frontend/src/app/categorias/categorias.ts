import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {
  api = 'http://localhost:3000/api';

  categorias: any[] = [];
  mensaje = '';
  cargando = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    this.http.get<any[]>(`${this.api}/categorias`, { headers }).subscribe({
      next: (res) => {
        this.categorias = Array.isArray(res) ? res : [];
        this.cargando = false;
        this.cdr.detectChanges(); // fuerza actualización de la vista
      },
      error: (err) => {
        console.error('Error categorías:', err);
        this.mensaje = 'Error al cargar categorías';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}