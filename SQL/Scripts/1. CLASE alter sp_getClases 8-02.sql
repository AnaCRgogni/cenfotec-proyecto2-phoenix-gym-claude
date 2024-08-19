SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Create the new or updated stored procedure 
ALTER PROCEDURE [dbo].[sp_getClases]
AS
BEGIN
    SET NOCOUNT ON;
SELECT c.idClase, c.nombreClase, c.fechaClase, c.cupos, c.idTUsuario
    FROM TClase c
    INNER JOIN TUsuario m ON c.idTUsuario = m.idUsuario
END;
GO
