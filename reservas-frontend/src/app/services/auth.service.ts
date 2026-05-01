import { Injectable } from '@angular/core';

export interface UsuarioSesion {
  id: number;
  nombre?: string;
  correo: string;
  rol: 'admin' | 'usuario' | string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'token';
  private readonly usuarioKey = 'usuarioLogueado';

  guardarSesion(token: string, usuario: UsuarioSesion): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  obtenerUsuario(): UsuarioSesion | null {
    const usuarioGuardado = localStorage.getItem(this.usuarioKey);

    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado) as UsuarioSesion;
    } catch {
      this.cerrarSesion();
      return null;
    }
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken() && !!this.obtenerUsuario();
  }

  tieneRol(rol: string): boolean {
    return this.obtenerUsuario()?.rol === rol;
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
  }
}
