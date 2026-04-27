import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {
  api = 'http://localhost:3000/api';

  categorias: any[] = [];
  mensaje = '';
  cargando = false;
  editando = false;
  categoriaEditandoId: number | null = null;

  categoria = {
    nombre: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;

    this.http.get<any[]>(`${this.api}/categorias`).subscribe({
      next: (res) => {
        this.categorias = Array.isArray(res) ? res : [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error categorias:', err);
        this.mensaje = err?.error?.message || 'Error al cargar categorias';
        this.cargando = false;
      }
    });
  }

  guardarCategoria(): void {
    this.mensaje = '';

    if (!this.categoria.nombre.trim()) {
      this.mensaje = 'Ingresa el nombre de la categoria';
      return;
    }

    const datos = {
      nombre: this.categoria.nombre.trim()
    };

    if (!this.editando) {
      this.http.post<any>(`${this.api}/categorias`, datos).subscribe({
        next: () => {
          this.mensaje = 'Categoria creada correctamente';
          this.limpiarFormulario();
          this.cargarCategorias();
        },
        error: (err) => {
          console.error(err);
          this.mensaje = err?.error?.message || 'Error al crear categoria';
        }
      });

      return;
    }

    this.http.put<any>(`${this.api}/categorias/${this.categoriaEditandoId}`, datos).subscribe({
      next: () => {
        this.mensaje = 'Categoria actualizada correctamente';
        this.limpiarFormulario();
        this.cargarCategorias();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al actualizar categoria';
      }
    });
  }

  editarCategoria(categoria: any): void {
    this.editando = true;
    this.categoriaEditandoId = categoria.id;
    this.categoria = {
      nombre: categoria.nombre
    };
    this.mensaje = '';
  }

  eliminarCategoria(id: number): void {
    if (!confirm('Seguro que deseas eliminar esta categoria?')) {
      return;
    }

    this.http.delete<any>(`${this.api}/categorias/${id}`).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Categoria eliminada correctamente';
        this.cargarCategorias();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.message || 'Error al eliminar categoria';
      }
    });
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
    this.mensaje = '';
  }

  limpiarFormulario(): void {
    this.categoria = {
      nombre: ''
    };
    this.editando = false;
    this.categoriaEditandoId = null;
  }
}
