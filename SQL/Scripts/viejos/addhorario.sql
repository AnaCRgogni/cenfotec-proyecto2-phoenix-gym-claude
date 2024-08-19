/****** Object:  StoredProcedure [dbo].[sp_addCliente]    Script Date: 7/18/2024 12:05:45 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- Create or update the stored procedure
CREATE PROCEDURE [dbo].[sp_addHorarioEntrenador]
    @cedula NVARCHAR(25),
    @name NVARCHAR(25),
    @date date
AS
BEGIN
    INSERT INTO THorarioEntrenador (cedula, name, date)
    VALUES (@cedula, @name, @date);
END;

GO