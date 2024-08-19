USE [PhoenixFitness]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE or alter PROCEDURE [dbo].[sp_deleteCitaMedicionxCliente] 
	@idEvo NVARCHAR(25)
AS
BEGIN
    DELETE FROM TCitasMedicion
    WHERE idEvo = @idEvo;
END;
GO
