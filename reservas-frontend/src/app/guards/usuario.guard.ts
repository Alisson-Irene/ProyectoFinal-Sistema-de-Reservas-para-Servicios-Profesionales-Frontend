import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const usuarioGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuarioGuardado = localStorage.getItem('usuarioLogueado');

  if (!usuarioGuardado) {
    router.navigate(['/']);
    return false;
  }

  const usuario = JSON.parse(usuarioGuardado);

  if (usuario.rol === 'usuario') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
