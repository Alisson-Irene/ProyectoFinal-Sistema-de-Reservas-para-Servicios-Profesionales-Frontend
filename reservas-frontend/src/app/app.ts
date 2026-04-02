import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  mensaje = '';

  servicio = {
    nombre: '',
    descripcion: '',
    precio: 0
  };

  servicios: any[] = [];

  crearServicio() {
    this.http.post(`${this.api}/servicios`, this.servicio).subscribe({
      next: () => {
        this.mensaje = 'Servicio creado';
        this.servicio = { nombre: '', descripcion: '', precio: 0 };
        this.cargarServicios();
      },
      error: () => {
        this.mensaje = 'Error al crear servicio';
      }
    });
  }

  cargarServicios() {
    this.http.get<any[]>(`${this.api}/servicios`).subscribe(res => {
      this.servicios = res;
    });
  }

  ngOnInit() {
    this.cargarServicios();
  }
}
