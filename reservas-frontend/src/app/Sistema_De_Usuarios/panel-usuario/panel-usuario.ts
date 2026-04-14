import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './panel-usuario.html',
  styleUrl: './panel-usuario.css'
})
export class PanelUsuarioComponent {
  usuarioNombre = '';

  constructor(private router: Router) {}

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
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/']);
  }
}
