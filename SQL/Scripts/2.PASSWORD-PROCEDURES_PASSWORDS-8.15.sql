USE PhoenixFitness;
GO

CREATE PROCEDURE dbo.sp_getLastFivePasswords
    @cedula NVARCHAR(25)
AS
BEGIN
    SELECT TOP 5 
        passwordHash,
        salt,
        fechaCambio
    FROM 
        TPasswords
    WHERE 
        cedula = @cedula
    ORDER BY 
        fechaCambio DESC;
END;
GO

CREATE PROCEDURE dbo.sp_deleteOldestPassword
    @cedula NVARCHAR(25)
AS
BEGIN
    IF (SELECT COUNT(*) FROM TPasswords WHERE cedula = @cedula) > 5
    BEGIN
        DELETE FROM 
            TPasswords
        WHERE 
            cedula = @cedula
        AND 
            fechaCambio = (
                SELECT MIN(fechaCambio) 
                FROM TPasswords 
                WHERE cedula = @cedula
            );
    END
END;
GO

CREATE PROCEDURE dbo.sp_saveNewPassword
    @cedula NVARCHAR(25),
    @passwordHash VARBINARY(256),
    @salt VARBINARY(128),
    @fechaCambio DATETIME
AS
BEGIN
    INSERT INTO TPasswords
    (
        cedula,
        passwordHash,
        salt,
        fechaCambio
    )
    VALUES
    (
        @cedula,
        @passwordHash,
        @salt,
        @fechaCambio
    );
END;
