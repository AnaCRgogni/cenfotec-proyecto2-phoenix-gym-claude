Use [PhoenixFitness]

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_addClase]
    @nombreClase NVARCHAR(50),
    @fechaClase DATETIME,
    @cupos INT,
    @idTUsuario INT
AS
BEGIN
    INSERT INTO TClase (nombreClase, fechaClase, cupos, idTUsuario)
    VALUES (@nombreClase, @fechaClase, @cupos, @idTUsuario);
    
END;
GO
