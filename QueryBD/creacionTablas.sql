/*** Usar BD ***/
use `resto` ;

/*** Tabla de tipos de pago ***/
  CREATE TABLE `resto`.`tipo_pagos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(30) NOT NULL,
	PRIMARY KEY (`id`)
  );

/*** Tabla de roles de usuario ***/
 CREATE TABLE `resto`.`roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`)
  );
  
/*** Tabla de estados  ***/
 CREATE TABLE `resto`.`estados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`)
  );
  
/*** Tabla de producto ***/
  CREATE TABLE `resto`.`productos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(80) NOT NULL,
  `precio` DECIMAL NOT NULL,
	`nombre_corto` VARCHAR(15) NOT NULL,
	`ruta` VARCHAR(250) NOT NULL,
	`favorito` TINYINT NOT NULL,
	PRIMARY KEY (`id`)
  );

/*** Tabla usuarios ***/
  CREATE TABLE `resto`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(45) NOT NULL,
  `nombre_completo` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `direccion_envio` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(45) NOT NULL,
  `id_rol` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_usuario_rol_idx` (`id_rol` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_rol`
    FOREIGN KEY (`id_rol`)
    REFERENCES `resto`.`roles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
	
/*** Tabla pedidos ***/	
CREATE TABLE `resto`.`pedidos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_estado` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `id_tipopago` INT NOT NULL,
  `fecha` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_pedidos_usuarios_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `fk_pedidos_estados_idx` (`id_estado` ASC) VISIBLE,
  INDEX `fk_pedidos_tipopago_idx` (`id_tipopago` ASC) VISIBLE,
  CONSTRAINT `fk_pedidos_usuarios`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `resto`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedidos_estados`
    FOREIGN KEY (`id_estado`)
    REFERENCES `resto`.`estados` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedidos_tipopago`
    FOREIGN KEY (`id_tipopago`)
    REFERENCES `resto`.`tipo_pagos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
	
/*** Tabla detalle pedidos ***/		
CREATE TABLE `resto`.`detalles_pedidos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_producto` INT NOT NULL,
  `id_pedido` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_detalle_pedido_idx` (`id_pedido` ASC) VISIBLE,
  INDEX `fk_detalle_producto_idx` (`id_producto` ASC) VISIBLE,
  CONSTRAINT `fk_detalle_pedido`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `resto`.`pedidos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_detalle_producto`
    FOREIGN KEY (`id_producto`)
    REFERENCES `resto`.`productos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);