# Dockerfile per servire il prototipo NOC con nginx:alpine
FROM nginx:alpine

# Copia i file statici nella directory predefinita di nginx
COPY . /usr/share/nginx/html

# Espone la porta 8080 (richiesta)
EXPOSE 8080

# nginx parte automaticamente, ma configuriamo per ascoltare sulla 8080
# È necessario modificare la configurazione di default per ascoltare sulla porta 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Comando di default (nginx -g daemon off)
CMD ["nginx", "-g", "daemon off;"]