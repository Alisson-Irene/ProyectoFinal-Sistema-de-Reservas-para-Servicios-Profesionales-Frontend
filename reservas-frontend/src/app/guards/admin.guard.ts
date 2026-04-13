import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuarioGuardado = localStorage.getItem('usuarioLogueado');

  if (!usuarioGuardado) {
    router.navigate(['/']);
    return false;
  }

  const usuario = JSON.parse(usuarioGuardado);

  if (usuario.rol === 'admin') {
    return true;
  }

  router.navigate(['/panel-usuario']);
  return false;
};
