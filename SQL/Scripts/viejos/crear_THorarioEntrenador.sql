/****** Object:  Table [dbo].[THorarioEntrenador]    Script Date: 7/18/2024 12:49:43 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[THorarioEntrenador](
	[idHorario] [int] IDENTITY(1,1) NOT NULL,
	[cedula] [nvarchar](25) NOT NULL, -- del entrenador
	[name] [nvarchar](25) NOT NULL,
	[date] [date] NOT NULL,
	[type] [varchar](50) NOT NULL,
	[everyYear] [bit] NOT NULL,
	[color] [varchar](50) NOT NULL, -- cambia a rojo cuando un cliente reserva la hora y los siguientes campos se llenan
	[nombre] [nvarchar](25), -- del cliente
	[apellido1] [nvarchar](25), -- del cliente
	[apellido2] [nvarchar](25), -- del cliente
	[description] [nvarchar](80), -- nombre del cliente cuando reserva un espacio para mostrarse en el calendario
PRIMARY KEY CLUSTERED 
(
	[idHorario] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[THorarioEntrenador] ADD  DEFAULT ('Disponibilidad') FOR [type]
GO

ALTER TABLE [dbo].[THorarioEntrenador] ADD  DEFAULT ((0)) FOR [everyYear]
GO

ALTER TABLE [dbo].[THorarioEntrenador] ADD  DEFAULT ('#04E90C') FOR [color]
GO

ALTER TABLE [dbo].[THorarioEntrenador]  WITH CHECK ADD  CONSTRAINT [FK_TUsuario_Cedula] FOREIGN KEY([cedula])
REFERENCES [dbo].[TUsuario] ([cedula])
GO

ALTER TABLE [dbo].[THorarioEntrenador] CHECK CONSTRAINT [FK_TUsuario_Cedula]
GO



