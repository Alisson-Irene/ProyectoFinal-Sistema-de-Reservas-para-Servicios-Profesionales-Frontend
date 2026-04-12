import { Routes } from '@angular/router';
import { LoginComponent } from './Sistema_De_Usuarios/login/login';
import { InventarioComponent } from './inventario/inventario';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'inventario', component: InventarioComponent }
];
