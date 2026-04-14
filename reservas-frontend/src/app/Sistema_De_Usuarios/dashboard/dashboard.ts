import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  usuarioNombre = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!usuarioGuardado) {
      this.router.navigate(['/']);
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (usuario.rol !== 'admin') {
      this.router.navigate(['/panel-usuario']);
      return;
    }

    this.usuarioNombre = usuario.nombre;
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/']);
  }
}
