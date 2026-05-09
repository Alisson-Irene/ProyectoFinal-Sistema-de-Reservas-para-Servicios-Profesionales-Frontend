import { Routes } from '@angular/router';
import { LoginComponent } from './Sistema_De_Usuarios/login/login';
import { DashboardComponent } from './Sistema_De_Usuarios/dashboard/dashboard';
import { UsuariosComponent } from './Sistema_De_Usuarios/CRUD_Usuarios/usuarios/usuarios';
import { InventarioComponent } from './inventario/inventario';
import { CambiarPasswordComponent } from './Sistema_De_Usuarios/Recuperacion/password';
import { ServiciosUsuarioComponent } from './servicios-usuario/servicios-usuario';
import { PanelUsuarioComponent } from './Sistema_De_Usuarios/panel-usuario/panel-usuario';
import { FormasPagoComponent } from './formas-pago/formas-pago';
import { ProfesionalesComponent } from './profesionales/profesionales';
import { MisReservasComponent } from './mis-reservas/mis-reservas';
import { PerfilComponent } from './perfil/perfil';
import { adminGuard } from './guards/admin.guard';
import { usuarioGuard } from './guards/usuario.guard';

//  NUEVO IMPORT
import { CategoriasComponent } from './categorias/categorias';



export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'cambiar-password', component: CambiarPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [adminGuard] },
  { path: 'inventario', component: InventarioComponent, canActivate: [adminGuard] },
  { path: 'profesionales', component: ProfesionalesComponent, canActivate: [adminGuard] },
  { path: 'formas-pago', component: FormasPagoComponent, canActivate: [adminGuard] },
  { path: 'panel-usuario', component: PanelUsuarioComponent, canActivate: [usuarioGuard] },
  { path: 'servicios', component: ServiciosUsuarioComponent, canActivate: [usuarioGuard] },
  { path: 'reservar', component: ServiciosUsuarioComponent, canActivate: [usuarioGuard] },
  { path: 'servicios-usuario', component: ServiciosUsuarioComponent, canActivate: [usuarioGuard] },
  { path: 'mis-reservas', component: MisReservasComponent, canActivate: [usuarioGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [usuarioGuard] },

  // NUEVAs RUTAS
  { path: 'categorias', component: CategoriasComponent, canActivate: [adminGuard] },

  {path: 'reservas', loadComponent: () => import('./reservas/reservas').then(m => m.ReservasComponent), canActivate: [adminGuard]}

];
