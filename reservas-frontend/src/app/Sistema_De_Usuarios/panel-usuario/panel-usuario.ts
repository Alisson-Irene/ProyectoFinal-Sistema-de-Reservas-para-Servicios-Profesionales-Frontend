import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './panel-usuario.html',
  styleUrl: './panel-usuario.css'
})
export class PanelUsuarioComponent implements OnInit {
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

    if (usuario.rol !== 'usuario') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.usuarioNombre = usuario.nombre || usuario.correo || 'Usuario';
  }
}
