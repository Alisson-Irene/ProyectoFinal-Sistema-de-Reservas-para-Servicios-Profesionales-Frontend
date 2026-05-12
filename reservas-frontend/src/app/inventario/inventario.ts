import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class InventarioComponent implements OnInit {
  api = API_BASE_URL;

  mensaje = '';

  servicio = {
    nombre: '',
    descripcion: '',
    precio: null as number | null,
    categoria_id: '',
    estado: 'ACTIVO',
    imagen_url: ''
  };

  categorias: any[] = [];
  servicios: any[] = [];

  editando = false;
  servicioEditandoId: number | null = null;
  cargandoServicios = false;
  creandoServicio = false;
  insertandoServicios = false;
  mostrarListaCompleta = false;

  serviciosIniciales = [
    {
      nombre: 'Reparación de computadoras',
      descripcion: 'Revisión y solución de fallas en equipos de cómputo.',
      precio: 50,
      categoria: 'Soporte técnico',
      estado: 'ACTIVO'
    },
    {
      nombre: 'Limpieza y optimización del equipo',
      descripcion: 'Mejora del rendimiento del equipo mediante limpieza de archivos temporales, revisión de programas innecesarios y ajustes básicos del sistema',
      precio: 45,
      categoria: 'Soporte técnico',
      estado: 'ACTIVO'
    },
    {
      nombre: 'Mantenimiento preventivo',
      descripcion: 'Revisión periódica para evitar fallas futuras',
      precio: 30,
      categoria: 'Mantenimiento',
      estado: 'ACTIVO'
    },
    {
      nombre: 'Control de fallas',
      descripcion: 'Identificación y seguimiento de errores frecuentes',
      precio: 25,
      categoria: 'Mantenimiento',
      estado: 'ACTIVO'
    },
    {
      nombre: 'Desarrollo de sistemas',
      descripcion: 'Construcción de aplicaciones o sistemas según necesidades del cliente (Precio variable)',
      precio: 500,
      categoria: 'Diseño y desarrollo',
      estado: 'ACTIVO'
    },
    {
      nombre: 'Desarrollo de base de datos',
      descripcion: 'Creación y organización de datos para un sistema (Precio variable)',
      precio: 100,
      categoria: '',
      estado: 'ACTIVO'
    },
    {
      nombre: 'Capacitación en herramientas digitales',
      descripcion: 'Enseñanza del uso de aplicaciones y plataformas tecnológicas',
      precio: 45,
      categoria: 'Capacitación',
      estado: 'ACTIVO'
    },
    {
      nombre: 'Capacitación en seguridad informática',
      descripcion: 'Orientación para proteger datos, cuentas y equipos',
      precio: 54,
      categoria: 'Capacitación',
      estado: 'ACTIVO'
    },
    {
      nombre: 'Auditoría de sistemas',
      descripcion: 'Revisión del funcionamiento, seguridad y control de un sistema',
      precio: 300,
      categoria: 'Capacitación',
      estado: 'ACTIVO'
    }
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarServicios();
  }

  cargarCategorias(): void {
    this.http.get<any>(`${this.api}/categorias`).subscribe({
      next: (res) => {
        this.categorias = this.obtenerListaCategorias(res);
        console.log('Categorías cargadas:', res);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  crearServicio(): void {
    if (this.creandoServicio) return;

    this.mensaje = '';

    if (
      !this.servicio.nombre.trim() ||
      !this.servicio.descripcion.trim() ||
      this.servicio.precio === null ||
      this.servicio.precio <= 0
    ) {
      this.mensaje = 'Completa correctamente todos los campos';
      return;
    }

    const datosEnviar = {
      nombre: this.servicio.nombre.trim(),
      descripcion: this.servicio.descripcion.trim(),
      precio: this.servicio.precio,
      categoria_id: this.servicio.categoria_id || null,
      estado: this.servicio.estado,
      imagen_url: this.servicio.imagen_url.trim()
    };

    this.creandoServicio = true;

    this.http.post<any>(`${this.api}/servicios`, datosEnviar).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio creado correctamente';
        this.limpiarServicio();
        this.creandoServicio = false;
        this.cargarServicios();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al crear servicio';
        this.creandoServicio = false;
      }
    });
  }

  cargarServicios(): void {
    if (this.cargandoServicios) return;

    this.mensaje = '';
    this.cargandoServicios = true;
    this.mostrarListaCompleta = false;
    this.servicios = [];

    this.http.get<any>(`${this.api}/servicios`).subscribe({
      next: (res) => {
        this.servicios = this.obtenerListaServicios(res);
        this.mostrarListaCompleta = true;
        this.cargandoServicios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al cargar servicios';
        this.cargandoServicios = false;
      }
    });
  }

  private obtenerListaServicios(respuesta: any): any[] {
    if (Array.isArray(respuesta)) {
      return respuesta;
    }

    if (Array.isArray(respuesta?.servicios)) {
      return respuesta.servicios;
    }

    if (Array.isArray(respuesta?.data)) {
      return respuesta.data;
    }

    return [];
  }

  private obtenerListaCategorias(respuesta: any): any[] {
    if (Array.isArray(respuesta)) {
      return respuesta;
    }

    if (Array.isArray(respuesta?.categorias)) {
      return respuesta.categorias;
    }

    if (Array.isArray(respuesta?.data)) {
      return respuesta.data;
    }

    return [];
  }

  insertarServiciosIniciales(): void {
    if (this.insertandoServicios) return;

    this.mensaje = '';
    this.insertandoServicios = true;

    this.http.get<any>(`${this.api}/servicios`).pipe(
      switchMap((respuestaServicios) => {
        const serviciosGuardados = this.obtenerListaServicios(respuestaServicios);
        const nombresGuardados = new Set(
          serviciosGuardados.map(servicio => this.normalizarTexto(servicio.nombre))
        );
        const serviciosPendientes = this.serviciosIniciales.filter(
          servicio => !nombresGuardados.has(this.normalizarTexto(servicio.nombre))
        );

        if (serviciosPendientes.length === 0) {
          return of({ creados: 0, omitidos: this.serviciosIniciales.length });
        }

        return this.obtenerCategoriasParaServicios(serviciosPendientes).pipe(
          switchMap((categoriasPorNombre) => {
            const peticiones = serviciosPendientes.map(servicio => {
              const categoriaId = servicio.categoria
                ? categoriasPorNombre.get(this.normalizarTexto(servicio.categoria))?.id || null
                : null;

              return this.http.post<any>(`${this.api}/servicios`, {
                nombre: servicio.nombre,
                descripcion: servicio.descripcion,
                precio: servicio.precio,
                categoria_id: categoriaId,
                estado: servicio.estado,
                imagen_url: ''
              });
            });

            return forkJoin(peticiones).pipe(
              map(() => ({
                creados: serviciosPendientes.length,
                omitidos: this.serviciosIniciales.length - serviciosPendientes.length
              }))
            );
          })
        );
      })
    ).subscribe({
      next: (resultado) => {
        const omitidos = resultado.omitidos > 0
          ? ` ${resultado.omitidos} ya existían y se omitieron.`
          : '';

        this.mensaje = `Inserción finalizada: ${resultado.creados} servicios creados.${omitidos}`;
        this.insertandoServicios = false;
        this.cargarCategorias();
        this.cargarServicios();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al insertar servicios iniciales';
        this.insertandoServicios = false;
      }
    });
  }

  private obtenerCategoriasParaServicios(serviciosPendientes: any[]) {
    return this.http.get<any>(`${this.api}/categorias`).pipe(
      switchMap((respuestaCategorias) => {
        const categorias = this.obtenerListaCategorias(respuestaCategorias);
        const categoriasPorNombre = new Map(
          categorias.map(categoria => [this.normalizarTexto(categoria.nombre), categoria])
        );
        const nombresNecesarios = Array.from(new Set(
          serviciosPendientes
            .map(servicio => servicio.categoria)
            .filter(Boolean)
            .map(nombre => String(nombre))
        ));
        const categoriasFaltantes = nombresNecesarios.filter(
          nombre => !categoriasPorNombre.has(this.normalizarTexto(nombre))
        );

        if (categoriasFaltantes.length === 0) {
          return of(categoriasPorNombre);
        }

        const peticiones = categoriasFaltantes.map(nombre =>
          this.http.post<any>(`${this.api}/categorias`, { nombre }).pipe(
            map((respuesta: any) => respuesta?.categoria || respuesta?.data || respuesta),
            catchError(() => of(null))
          )
        );

        return forkJoin(peticiones).pipe(
          map((categoriasCreadas) => {
            categoriasCreadas
              .filter(Boolean)
              .forEach((categoria: any) => {
                categoriasPorNombre.set(this.normalizarTexto(categoria.nombre), categoria);
              });

            return categoriasPorNombre;
          })
        );
      })
    );
  }

  private normalizarTexto(valor: any): string {
    return String(valor || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  editarServicio(servicio: any): void {
    this.mensaje = '';
    this.editando = true;
    this.servicioEditandoId = servicio.id;

    this.servicio = {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: Number(servicio.precio),
      categoria_id: servicio.categoria_id || '',
      estado: servicio.estado || 'ACTIVO',
      imagen_url: servicio.imagen_url || ''
    };
  }

  actualizarServicio(): void {
    if (!this.servicioEditandoId) return;

    this.mensaje = '';

    if (
      !this.servicio.nombre.trim() ||
      !this.servicio.descripcion.trim() ||
      this.servicio.precio === null ||
      this.servicio.precio <= 0
    ) {
      this.mensaje = 'Completa correctamente todos los campos';
      return;
    }

    const datosActualizar = {
      nombre: this.servicio.nombre.trim(),
      descripcion: this.servicio.descripcion.trim(),
      precio: this.servicio.precio,
      categoria_id: this.servicio.categoria_id || null,
      estado: this.servicio.estado,
      imagen_url: this.servicio.imagen_url.trim()
    };

    this.http.put<any>(`${this.api}/servicios/${this.servicioEditandoId}`, datosActualizar).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio actualizado correctamente';
        this.limpiarServicio();
        this.cargarServicios();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al actualizar servicio';
      }
    });
  }

  cancelarEdicionServicio(): void {
    this.limpiarServicio();
    this.mensaje = '';
  }

  limpiarServicio(): void {
    this.servicio = {
      nombre: '',
      descripcion: '',
      precio: null,
      categoria_id: '',
      estado: 'ACTIVO',
      imagen_url: ''
    };

    this.editando = false;
    this.servicioEditandoId = null;
  }

  eliminarServicio(id: number): void {
    this.mensaje = '';

    this.http.delete<any>(`${this.api}/servicios/${id}`).subscribe({
      next: (res) => {
        this.mensaje = res?.message || 'Servicio eliminado correctamente';
        this.cargarServicios();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err?.error?.detalle || err?.error?.message || 'Error al eliminar servicio';
      }
    });
  }
}
