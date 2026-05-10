FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

ENV PORT=80
ENV API_BASE_URL=http://localhost:3000/api

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.d/50-runtime-env.sh /docker-entrypoint.d/50-runtime-env.sh
COPY --from=build /app/dist/reservas-frontend/browser /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.d/50-runtime-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
