# Despliegue en Render con Docker

## Frontend

1. Sube este repositorio a GitHub.
2. En Render crea un **Web Service** nuevo.
3. Conecta el repositorio.
4. En **Root Directory** coloca:
   ```txt
   reservas-frontend
   ```
5. En **Language** selecciona:
   ```txt
   Docker
   ```
6. Agrega esta variable de entorno:
   ```txt
   API_BASE_URL=https://URL-DE-TU-BACKEND.onrender.com/api
   ```
7. Despliega el servicio.

## Prueba local con Docker

Desde la carpeta `reservas-frontend`:

```bash
docker build -t reservas-frontend .
docker run --rm -p 8080:80 -e API_BASE_URL=http://localhost:3000/api reservas-frontend
```

Abre:

```txt
http://localhost:8080
```

## Importante

El backend también debe estar desplegado y permitir CORS desde el dominio del frontend en Render.
Ejemplo:

```txt
https://tu-frontend.onrender.com
```

Si el backend está en Render, usa su URL pública terminada en `/api` como `API_BASE_URL`.
