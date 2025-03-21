# syntax=docker.io/docker/dockerfile:1.7-labs

FROM --platform=$BUILDPLATFORM node:lts-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

COPY --exclude=nginx . .

# Build app for production with minification
RUN npm run build

FROM nginx:stable-alpine

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Copy nginx configuration if you have a custom one
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
