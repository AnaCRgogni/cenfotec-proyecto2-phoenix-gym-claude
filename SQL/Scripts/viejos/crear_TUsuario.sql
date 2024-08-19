SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TUsuario]
(
    [idTUsuario] [INT] NOT NULL, 
	[rolUsuario] [NVARCHAR](25) NOT NULL,
    [nombre] [NVARCHAR](25) NOT NULL,
    [apellido1] [NVARCHAR](25) NOT NULL,
    [apellido2] [NVARCHAR](25) NOT NULL,
    [telefono] [NVARCHAR](25) NOT NULL,
    [email] [NVARCHAR](25) NOT NULL,
    [fechaNacimiento] [DATE] NOT NULL,
    [contrasena] [NVARCHAR](30) NULL,
	[fotoIdCliente] [NVARCHAR](200),
	[fotoPerfilCliente] [NVARCHAR](200),
	[generoCliente] [NVARCHAR](25),
	[matriculaCliente] FLOAT,
	[mensualidadCliente] FLOAT,
	[fechaPagoCliente] DATE,
	[statusPagoCliente] [NVARCHAR](25),
	[tipoEntrenador] [NVARCHAR](45),
	[horarioEntrenadorPersonal] [NVARCHAR](200),
	[tarifaHoraEntrenadorPersonal] FLOAT,

PRIMARY KEY CLUSTERED 
(
	[idTUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO