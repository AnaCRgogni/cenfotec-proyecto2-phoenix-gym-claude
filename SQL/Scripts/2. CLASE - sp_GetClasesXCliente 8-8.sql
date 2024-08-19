SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Create or update the stored procedure
CREATE PROCEDURE [dbo].[sp_getClasesXCliente]
    @cedula NVARCHAR(25)
AS
BEGIN
    SET NOCOUNT ON;

    -- Query to get classes for a client
    SELECT 
        c.idClase, 
        d.nombreClase, 
        d.fechaClase, 
        d.cupos, 
        c.idCliente, 
        m.idMembresia, 
        m.estado
    FROM 
        TClaseXCliente c
    INNER JOIN 
        TClase d ON c.idClase = d.idClase
    LEFT JOIN 
        TUsuario m ON c.idCliente = m.cedula
    WHERE 
        c.idCliente = @cedula;
END
GO
