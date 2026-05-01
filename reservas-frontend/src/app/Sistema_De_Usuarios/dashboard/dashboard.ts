import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  usuarioNombre = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();

    if (!usuario) {
      this.router.navigate(['/']);
      return;
    }

    if (usuario.rol !== 'admin') {
      this.router.navigate(['/panel-usuario']);
      return;
    }

    this.usuarioNombre = usuario.nombre || usuario.correo;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}
