# Descripcion del repositorio
StockTracker es un sitio web en el cual las empresas como supermercados y almacenes podran hacer un inventario de sus productos, manejando información como entradas y salidas de stock, y analiticas de productos.

# Tecnologias del BackEnd:
- FrameWork: node.js - Express
- BD: PostgreSQL
- Testing: Jest
- Empaquetado: Docker

# Comando Utiles
Algunos comandos del bash que se usan frecuentemente

## Para el manejo de los contenedores:
Encendido: docker compose up --build -d
Apagado: docker compose down

## Ingresar a un contenedor:
1. docker ps //Lista de contenedores
2. docker exec -it <Nombre contenedor> bash
-- Para ver la BD --
3. psql -U <usuario> -d <nombre bd>
4. \dt ver tablas
5. \d "nombre tabla"

## Para el manejo de la base de datos:
Aplicar migraciones: docker compose exec backend npx sequelize-cli db:migrate
Deshacer migraciones: docker compose exec backend npx sequelize-cli db:migrate:undo

-- Comando para crear nuevos archivos de migraciones --
npx sequelize-cli migration:generate --name [descripcion-de-la-migracion]

-- Comando para crear nuevos archivos de models -- 
npx sequelize-cli model:generate --name Purchase --attributes field1:datatype,field2:datatype

## Testeo
- docker compose exec backend npm test
