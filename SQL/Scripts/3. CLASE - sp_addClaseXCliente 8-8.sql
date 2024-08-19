SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_addClaseXCliente]
    @idClase int,
    @idCliente NVARCHAR(25)
AS
BEGIN
    INSERT INTO TClaseXCliente (idClase, idCliente)
    VALUES (@idClase, @idCliente);
    
END;
GO
