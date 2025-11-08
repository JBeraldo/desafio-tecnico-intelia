# Stage 1: Build Angular app
FROM node:22 AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY ./frontend .
RUN npm run build -- --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY ../docker/nginx/application.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]