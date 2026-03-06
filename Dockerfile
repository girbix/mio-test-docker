# Usa nginx come base
FROM nginx:alpine

# Copia il nostro file html dentro il container
COPY index.html /usr/share/nginx/html/login.html