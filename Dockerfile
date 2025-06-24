# Imagen base oficial de Node
FROM node:18

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "run", "dev"]
