Proyecto Delilah Resto

Para ejecutar el proyecto continua los siguientes pasos

1. Se deben instalar las siguientes aplicacines:
    -Node.js
    -MySQL con la extensión del WorkBrench
    -Postman

2. Crear pack.json ejecutando el comando npm init, ten encuenta que el archivo principal se llama index.js

3. Ejecutar la libreria express en la consola con npm i express
4. Ejecutar la libreria MySQL2 en la consola con npm i mysql2
5. Ejecutar la libreria sequelize en la consola con npm i sequelize
6. Ejecutar la libreria dotenv en la consola con npm i dotenv
7. Ejecutar la libreria jsonwebtoken en la consola con npm i jsonwebtoken

8. Digitar los datos de la conexión de la base de datos en el archivo .env

9. Ejecutar en el WorkBrench el archivo creacionBD
10. Ejecutar en el WorkBrench el archivo creacionTablas
11. Ejecutar en el WorkBrench el archivo creacionInsert

                                        MUY IMPORTANTE!!!!

Desde visual studio code ejecutar en la terminar para iniciar la aplicación: node index.js

En el swagger estan los request que se deben enviar en el body de postman para ejecutarlos, ademas de los paramatros.

Recuerda antes de ejecutar agregar el token de autorización en Authorization o en los headers(Bearer + espacio + token) de postman.

url de endpoint:
## Usuarios:
Metodo: GET
URL: http://localhost:8000/usuarios

Metodo: POST
URL: http://localhost:8000/login

Metodo: POST
URL: http://localhost:8000/crearUsuario

## Productos:
Metodo: GET
URL: http://localhost:8000/productos

Metodo: POST
URL: http://localhost:8000/crearProducto

Metodo: PUT
URL: http://localhost:8000/modificarProducto?id_producto=

Metodo: DELETE
URL: http://localhost:8000/eliminarProducto?id=

## Pedidos:
Metodo: GET
URL: http://localhost:8000/pedidos

Metodo: PUT
URL: http://localhost:8000/modificarPedido?id_pedido=

Metodo: POST
URL: http://localhost:8000/pedidoNuevo

Metodo: DELETE
URL: http://localhost:8000/eliminarPedido?id=
