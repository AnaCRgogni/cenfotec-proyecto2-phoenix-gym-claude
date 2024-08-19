USE [PhoenixFitness]
GO

/****** Object:  StoredProcedure [dbo].[sp_getAllEntrenadores]    Script Date: 7/26/2024 4:41:17 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER PROCEDURE [dbo].[sp_getAllEntrenadores]
    @rolUsuario nvarchar(25)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT  
	[idUsuario],
	[rolUsuario],
	[cedula],
    [nombre], 
    [apellido1], 
    [apellido2], 
    [email], 
    [contrasena], 
    [fechaNacimiento], 
    [telefono], 
    [tipoEntrenador], 
    [tarifaHoraEntrenadorPersonal],
	[estado]
    FROM [dbo].[TUsuario]
    WHERE [rolUsuario] = 'Entrenador';
END
GO
