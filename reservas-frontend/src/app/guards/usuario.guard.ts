import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const usuarioGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.estaAutenticado()) {
    router.navigate(['/']);
    return false;
  }

  if (authService.tieneRol('usuario')) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
