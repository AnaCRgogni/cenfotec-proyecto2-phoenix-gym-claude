USE [PhoenixFitness]
GO

/****** Object:  Table [dbo].[TCitasMedicion]    Script Date: 7/25/2024 9:56:11 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TCitasMedicion](
	[idMedicion] [int] IDENTITY(1,1) NOT NULL,
	[idEvo] [nvarchar](25) NOT NULL,
	-- Cedula del cliente
	[cedula] [nvarchar](25) NOT NULL,
	-- Nombre del entrenador
	[nombre] [nvarchar](25) NULL,
	[apellido1] [nvarchar](25) NULL,
	[apellido2] [nvarchar](25) NULL,
	[description] [nvarchar](80) NULL,
	[name] [nvarchar](25) NOT NULL,
	[date] [date] NOT NULL,
	[type] [varchar](50) NOT NULL,
	[everyYear] [bit] NOT NULL,
	[color] [varchar](50) NOT NULL,
	

PRIMARY KEY CLUSTERED 
(
	[idMedicion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_TCitasMedicion_idEvo] UNIQUE NONCLUSTERED 
(
	[idEvo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TCitasMedicion]  WITH CHECK ADD  CONSTRAINT [FK_TCitasMedicion_Cedula] FOREIGN KEY([cedula])
REFERENCES [dbo].[TUsuario] ([cedula])
GO

ALTER TABLE [dbo].[TCitasMedicion] CHECK CONSTRAINT [FK_TCitasMedicion_Cedula]
GO

