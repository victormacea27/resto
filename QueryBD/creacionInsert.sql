/*** Usar BD ***/
use `resto` ;

/*** insert de tipos de pagos ***/
INSERT INTO `resto`.`tipo_pagos`
(`nombre`) VALUES ('TARJETA CREDITO'),('EFECTIVO');

/*** insert estados  ***/  
INSERT INTO `resto`.`estados`
(`nombre`)
VALUES	("NUEVO"),("CONFIRMADO"),("PREPARANDO"),("ENVIADO"),("CANCELADO"),("ENTREGADO");

/*** insert productos  ***/  
INSERT INTO `resto`.`productos`
(`nombre`,`precio`,`nombre_corto`,`ruta`,`favorito`)
VALUES
("Pizza","8","Pizza","Ruta_Pizza",0),
("Pasta","20","Pasta","Ruta_Pasta",	1);

/*** insert de rol ***/
INSERT INTO `resto`.`roles`
(`nombre`)
VALUES("admin"),('usuario');

/*** insert usuario admin y usuario  ***/
INSERT INTO `resto`.`usuarios`
(`usuario`,`nombre_completo`,`email`,`telefono`,`direccion_envio`,`contrasena`,`id_rol`)
VALUES
("admin","admin sistema","admin@mail.com","123445678","Calle 123","admin",1),
("vm","victor Macea","victor@mail.com","567890","Calle falsa 123","vm",2);

/*** insert de pedidos ***/
INSERT INTO `resto`.`pedidos`
(`id_estado`,`id_usuario`,`id_tipopago`,`Fecha`)
VALUES(2,2,2,(select now()));
INSERT INTO `resto`.`pedidos`
(`id_estado`,`id_usuario`,`id_tipopago`,`Fecha`)
VALUES(1,2,1,(select now()));

/*** insert detalle_pedidos  ***/ 
INSERT INTO `resto`.`detalles_pedidos`
(`id_producto`,`id_pedido`)
VALUES(2,1),(1,2);