import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription, filter, finalize } from 'rxjs';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './panel-usuario.html',
  styleUrl: './panel-usuario.css'
})
export class PanelUsuarioComponent implements OnInit, OnDestroy {
  api = 'http://localhost:3000/api';

  usuarioNombre = '';
  usuarioId = 0;
  reservas: any[] = [];
  proximaReserva: any = null;
  cargandoReservas = false;
  mensaje = '';
  private routerSubscription?: Subscription;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!usuarioGuardado) {
      this.router.navigate(['/']);
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (usuario.rol !== 'usuario') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.usuarioNombre = usuario.nombre;
    this.usuarioId = Number(usuario.id);
    this.cargarReservas();

    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.urlAfterRedirects === '/panel-usuario') {
          this.cargarReservas();
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  cargarReservas(): void {
    if (!this.usuarioId) {
      this.reservas = [];
      this.proximaReserva = null;
      return;
    }

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
        this.proximaReserva = this.obtenerProximaReserva();
      },
      error: (err) => {
        console.error('Error reservas usuario:', err);
        this.mensaje = 'No se pudieron cargar tus reservas';
      }
    });
  }

  obtenerProximaReserva(): any {
    const ahora = new Date();

    return this.reservas
      .filter(reserva => reserva.fecha && reserva.estado !== 'CANCELADA' && reserva.estado !== 'FINALIZADA')
      .sort((a, b) => {
        const fechaA = this.obtenerFechaReserva(a).getTime();
        const fechaB = this.obtenerFechaReserva(b).getTime();
        return fechaA - fechaB;
      })
      .find(reserva => this.obtenerFechaReserva(reserva) >= ahora) || null;
  }

  obtenerFechaReserva(reserva: any): Date {
    const fecha = String(reserva.fecha || '').split('T')[0];
    const hora = String(reserva.hora || '00:00').slice(0, 5);

    return new Date(`${fecha}T${hora}`);
  }

  contarReservasActivas(): number {
    return this.reservas.filter(
      reserva => reserva.estado !== 'CANCELADA' && reserva.estado !== 'FINALIZADA'
    ).length;
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/']);
  }
}
