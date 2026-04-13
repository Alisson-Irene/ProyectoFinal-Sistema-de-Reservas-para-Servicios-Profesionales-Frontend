import { Routes } from '@angular/router';
import { LoginComponent } from './Sistema_De_Usuarios/login/login';
import { RegisterComponent } from './Sistema_De_Usuarios/register/register';
import { DashboardComponent } from './Sistema_De_Usuarios/dashboard/dashboard';
import { UsuariosComponent } from './Sistema_De_Usuarios/CRUD_Usuarios/usuarios/usuarios';
import { InventarioComponent } from './inventario/inventario';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'inventario', component: InventarioComponent }
];
