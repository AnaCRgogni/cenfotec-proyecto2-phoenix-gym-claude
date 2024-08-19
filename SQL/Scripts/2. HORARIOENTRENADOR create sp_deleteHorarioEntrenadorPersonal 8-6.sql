USE [PhoenixFitness]
GO
/****** Object:  StoredProcedure [dbo].[sp_deleteCitaMedicionxCliente]    Script Date: 8/6/2024 12:22:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER   PROCEDURE [dbo].[sp_deleteHorarioEntrenadorPersonal] 
	@idEvo NVARCHAR(25)
AS
BEGIN
    DELETE FROM THorarioEntrenador
    WHERE idEvo = @idEvo;
END;
