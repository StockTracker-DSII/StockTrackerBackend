# Imagen base oficial de Node
FROM node:18

# Establece el entorno en desarrollo (para que npm instale devDependencies)
ENV NODE_ENV=development

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "run", "dev"]
