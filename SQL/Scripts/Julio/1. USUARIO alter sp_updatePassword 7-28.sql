SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_updatePassword]
  @cedula NVARCHAR(25),
  @email NVARCHAR(50),
  @contrasena NVARCHAR(100),
  @newSalt NVARCHAR(25)
-- Nuevo parámetro para el salt
AS
BEGIN
  SET NOCOUNT ON;

  -- Actualizar la tabla TUsuario
  UPDATE TUsuario
    SET 
        contrasena = @contrasena
    WHERE
        cedula = @cedula;

  -- Actualizar la tabla TSalt
  IF @newSalt IS NOT NULL
    BEGIN
    -- Asegúrate de que el email existe en TUsuario
    IF EXISTS (SELECT 1
    FROM TUsuario
    WHERE email = @email)
        BEGIN
      UPDATE TSalt
            SET salt = @newSalt
            WHERE cedulaUsuario = @cedula;
    END
        ELSE
        BEGIN
      -- Si no existe, podrías manejar el error o agregar un nuevo registro
      RAISERROR('La cedula no existe.', 16, 1);
    END
  END
END;
GO
