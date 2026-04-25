import { Routes } from '@angular/router';
import { LoginComponent } from './Sistema_De_Usuarios/login/login';
import { DashboardComponent } from './Sistema_De_Usuarios/dashboard/dashboard';
import { UsuariosComponent } from './Sistema_De_Usuarios/CRUD_Usuarios/usuarios/usuarios';
import { InventarioComponent } from './inventario/inventario';
import { CambiarPasswordComponent } from './Sistema_De_Usuarios/Recuperacion/password';
import { ServiciosUsuarioComponent } from './servicios-usuario/servicios-usuario';
import { PanelUsuarioComponent } from './Sistema_De_Usuarios/panel-usuario/panel-usuario';

//  NUEVO IMPORT
import { CategoriasComponent } from './categorias/categorias';



export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'cambiar-password', component: CambiarPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'panel-usuario', component: PanelUsuarioComponent },
  { path: 'servicios-usuario', component: ServiciosUsuarioComponent },

  // NUEVAs RUTAS
  { path: 'categorias', component: CategoriasComponent },

  {path: 'reservas', loadComponent: () => import('./reservas/reservas').then(m => m.ReservasComponent)}

];
