﻿CREATE procedure FI_SP_ConsBeneficiarioPorCliente
	@CPF VARCHAR(11)
AS
BEGIN
	
	SELECT B.NOME,  B.ID, B.CPF , B.IDCLIENTE 
	FROM BENEFICIARIOS B WITH(NOLOCK) 
	INNER JOIN CLIENTES C
	ON B.IDCLIENTE = C.ID
	WHERE C.CPF = @CPF

END