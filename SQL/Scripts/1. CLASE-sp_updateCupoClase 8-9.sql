CREATE PROCEDURE [dbo].[sp_updateCupoClase]
    @idClase int
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    IF EXISTS (SELECT 1 FROM TClase WHERE idClase = @idClase AND cupos > 0)
    BEGIN
        UPDATE TClase
        SET 
            cupos = cupos - 1
        WHERE
            idClase = @idClase;

        COMMIT TRANSACTION;
    END
    ELSE
    BEGIN
        -- Manejo de error si la clase no existe o no hay cupos disponibles
        RAISERROR('Clase no encontrada o no hay cupos disponibles.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO
