import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-servicios-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios-usuario.html',
  styleUrl: './servicios-usuario.css'
})
export class ServiciosUsuarioComponent implements OnInit {

  servicios: any[] = [];
  cargando = true;
  mensaje = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    console.log('Intentando cargar servicios activos...');

    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    // 🔥 AQUÍ ESTÁ EL CAMBIO IMPORTANTE
    this.http.get<any[]>('http://localhost:3000/api/servicios/activos', { headers })
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
          console.log('Petición finalizada');
        })
      )
      .subscribe({
        next: (data) => {
          console.log('Servicios activos recibidos:', data);
          this.servicios = data;

          if (data.length === 0) {
            this.mensaje = 'No hay servicios disponibles';
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar servicios:', error);
          this.mensaje = 'No se pudieron cargar los servicios';
          this.cdr.detectChanges();
        }
      });
  }
}