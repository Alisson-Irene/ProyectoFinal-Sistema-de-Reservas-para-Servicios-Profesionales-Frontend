import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.estaAutenticado()) {
    router.navigate(['/']);
    return false;
  }

  if (authService.tieneRol('admin')) {
    return true;
  }

  router.navigate(['/panel-usuario']);
  return false;
};
