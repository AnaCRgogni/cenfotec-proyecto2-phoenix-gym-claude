USE [PhoenixFitness]
GO

/****** Object:  Table [dbo].[THorarioEntrenador]    Script Date: 7/25/2024 1:39:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[THorarioEntrenador](
	[idHorario] [int] IDENTITY(1,1) NOT NULL,
	[idEvo] [nvarchar](25) NOT NULL,
	[cedula] [nvarchar](25) NOT NULL,
	[name] [nvarchar](25) NOT NULL,
	[date] [date] NOT NULL,
	[type] [varchar](50) NOT NULL,
	[everyYear] [bit] NOT NULL,
	[color] [varchar](50) NOT NULL,
	[nombre] [nvarchar](25) NULL,
	[apellido1] [nvarchar](25) NULL,
	[apellido2] [nvarchar](25) NULL,
	[description] [nvarchar](80) NULL,
PRIMARY KEY CLUSTERED 
(
	[idHorario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_THorarioEntrenador_idEvo] UNIQUE NONCLUSTERED 
(
	[idEvo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[THorarioEntrenador]  WITH CHECK ADD  CONSTRAINT [FK_TUsuario_Cedula] FOREIGN KEY([cedula])
REFERENCES [dbo].[TUsuario] ([cedula])
GO

ALTER TABLE [dbo].[THorarioEntrenador] CHECK CONSTRAINT [FK_TUsuario_Cedula]
GO


