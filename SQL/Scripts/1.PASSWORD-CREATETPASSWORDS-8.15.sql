USE PhoenixFitness;
GO

CREATE TABLE TPasswords (
    cedula NVARCHAR(25),
    passwordHash VARBINARY(256),
    salt VARBINARY(128),
    fechaCambio DATETIME,
    PRIMARY KEY (cedula, fechaCambio),
    FOREIGN KEY (cedula) REFERENCES TUsuario(cedula)
);
