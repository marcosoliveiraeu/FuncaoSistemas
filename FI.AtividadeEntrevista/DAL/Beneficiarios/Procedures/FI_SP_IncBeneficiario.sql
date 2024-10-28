﻿CREATE PROC FI_SP_Beneficiario
    @NOME          VARCHAR (50) ,
    @CPF           VARCHAR (11) , 
	@IDCLIENTE     BIGINT
AS
BEGIN
	INSERT INTO CLIENTES (NOME, CPF , IDCLIENTE) 
	VALUES (@NOME, @CPF, @IDCLIENTE )

	SELECT SCOPE_IDENTITY()
END